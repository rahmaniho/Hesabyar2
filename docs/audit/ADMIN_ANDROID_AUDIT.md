# ممیزی امنیتی Admin Android — سورس حساب‌یار

**مبنای بررسی:** `rahmaniho/KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** static review از shell اندرویدی `admin-android/` و workflow انتشار. Run `41274386135` برای همان Admin subtree/workflow build، verifier، upload و انتشار را گذراند؛ APK در این sandbox مستقل دانلود/parse نشد، و device/server بررسی نشدند.

## معماری مشاهده‌شده

این APK یک WebView shell برای `https://staging.karen-soft.ir/admin/` است؛ اپ Android مستقلِ دارای backend داخلی نیست. احراز هویت UI، HTTP Basic/cPanel Directory Privacy است و username/password در dialog گرفته می‌شوند. منبع، release pipeline را debug APK آزمایشی می‌نامد.

## کنترل‌های مثبت در سورس

- Manifest: `usesCleartextTraffic=false`, `allowBackup=false`; network security config فقط system trust anchor دارد.
- WebView: TLS error را `cancel()` می‌کند؛ mixed content، file/content access و geolocation را خاموش؛ third-party cookies را رد؛ zoom را خاموش می‌کند.
- `shouldOverrideUrlLoading` فقط HTTPS، host دقیق `staging.karen-soft.ir` و مسیر `/admin` یا `/admin/` را در WebView نگه می‌دارد؛ سایر navigationها را به browser خارجی می‌فرستد.
- Basic-auth prompt برای host غیرمجاز لغو می‌شود. در این Java source هیچ credential ثابت/هاردکدشده‌ای برای login مشاهده نشد؛ فیلدهای `authUser` و `authPass` داخل instance Activity هستند.
- Workflow از `assembleDebug` استفاده می‌کند، و پیش از Actions artifact/GitHub release `apksigner verify` و `aapt dump badging` اجرا می‌کند؛ app ID، versionName، minSdk و targetSdk را چک و checksum می‌سازد. اما certificate identity را با Android Debug signer تطبیق نمی‌دهد، `application-debuggable` را assert نمی‌کند و versionCode/permissions را چک نمی‌کند (ADM-04). Gradle source صریحاً `debuggable=true` برای debug variant دارد، اما artifact guard آن را مستقل نمی‌سنجد.
- Run `41274386135` در گام‌های Build, Verify APK, Upload APK artifact و Publish GitHub prerelease موفق بود. Commit run `a9f392dcdfc207d66458efc308d4c7b98b647b32` از baseline `d41ca...` متفاوت است، اما `admin-android` subtree و `admin-android.yml` blob با baseline دقیقاً برابرند. GitHub API APK را 44,282 بایت و با digest `sha256:95c0b44236f603aae56efcaee684576aad21fd462a34ecf844e5ee7a2f6b8946` گزارش می‌کند؛ این metadata است، نه hash محلی. APK binary مستقل دانلود/parse نشد.

مراجع: [MainActivity.java](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/admin-android/app/src/main/java/ir/karensoft/hesabyar/admin/MainActivity.java), [Manifest](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/admin-android/app/src/main/AndroidManifest.xml), [network security config](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/admin-android/app/src/main/res/xml/network_security_config.xml).

## Findings

### ADM-01 — session/DOM data cleanup نامشخص و احتمال ماندگاری روی دستگاه (متوسط؛ نیازمند verification)

در `MainActivity.java:68-89`، JavaScript و DOM storage فعال و cookie پذیرفته می‌شود؛ در `onPause()`، `CookieManager.flush()` صریحاً اجرا می‌شود. در همان Activity، cleanup صریح cookieها، `WebStorage`، HTTP-auth credentials یا session state در مسیر logout/`onDestroy()` دیده نشد؛ `LOAD_NO_CACHE` فقط cache-mode شبکه را تنظیم می‌کند و به‌تنهایی اثبات نمی‌کند که DOM storage/session داده‌ای ذخیره نمی‌کند. README ادعای «no sensitive offline cache» دارد، اما cookie/session flags و رفتار dashboard زنده بررسی نشدند.

اگر session cookie یا DOM data حساس باشد، دستگاه گم‌شده/مشترک یا logout ناقص می‌تواند دسترسی بعدی را باقی بگذارد. **وقوع این مسئله live اثبات نشده**؛ `Secure`, `HttpOnly`, `SameSite`, expiration/revocation و logout server-side نیازمند بررسی authorized در staging هستند.

**کاهش ریسک پیشنهادی:** تعیین timeout/re-auth، logout server-side، پاک‌سازی storage/cookies پس از logout و سیاست دستگاه مشترک؛ فقط cache را حذف‌شده فرض نکنید. اگر محتوای admin حساس است، نمایش در app switcher/screenshot را نیز ارزیابی کنید (در Activity فعلی `FLAG_SECURE` مشاهده نشد).

### ADM-02 — توزیع عمومی debug Admin APK باید staging-only بماند (متوسط؛ تصمیم مالک)

`admin-android.yml` از `workflow_dispatch` و push branch مشخص APK debug را به GitHub prerelease می‌فرستد؛ workflow فقط یک branch push را trigger می‌کند، اما manual dispatch branch policy در YAML ندارد. README و release noteها staging target و debug/test بودن را اعلام می‌کنند. دسترسی واقعی staging، نوع دادهٔ آن، cPanel Directory Privacy، rate limit و server-side authorization از sandbox قابل بررسی نیست.

**گیت:** تأیید شود APK فقط به testerهای مجاز داده می‌شود، staging دادهٔ production ندارد، و authorization در سرور enforce می‌شود—نه با مخفی‌بودن APK یا URL. کلید/credential ورود را در APK، GitHub Release یا سورس قرار ندهید.

### ADM-03 — auth retry در client، کنترل server-side را جایگزین نمی‌کند

`authAttempts` در Activity تعداد retryهای credential موجود را کنترل می‌کند، ولی کاربر می‌تواند dialog را دوباره باز کند؛ این app-level rate limit واقعی نیست. Lockout/rate limit/captcha/account policy باید در server یا cPanel واقعاً enforce و log شود. رفتار server بررسی نشده است (`NEEDS_VERIFICATION`).

### ADM-04 — Admin APK verifier گواهی/حالت debug را به‌صورت صریح assert نمی‌کند (کم؛ verification gap)

در [`admin-android.yml`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/.github/workflows/admin-android.yml#L33-L64)، workflow `assembleDebug` اجرا می‌کند و `Verify APK` از `apksigner verify --verbose --print-certs` فقط برای fail کردن روی امضای نامعتبر استفاده می‌کند؛ subject گواهی را parse یا با `CN=Android Debug` مقایسه نمی‌کند. `aapt dump badging` نیز برای package name، versionName، minSdk و targetSdk grep می‌شود، نه `application-debuggable`, versionCode یا permissionها. Gradle source `debuggable=true` برای build type `debug` دارد؛ این انتظار source-level است و verifier روی binary آن را assert نمی‌کند. Run `41274386135` با همین checkهای محدود موفق بود و subtree/workflow blob با baseline ممیزی یکی است؛ هیچ شواهدی از signer اشتباه یا artifact غیر-debug به‌دست نیامد.

**کاهش ریسک پیشنهادی:** signer subject را صریحاً به گواهی مورد انتظار محدود کنید و از `aapt`/`apkanalyzer`، debuggable state، versionCode و manifest policy را هم قبل از upload و release assert کنید. این finding شکاف test gate است، نه رخداد اثبات‌شده.

## حدود ممیزی

- host `staging.karen-soft.ir`، admin routes، response headers، cookies، Directory Privacy و server access logs بررسی نشدند. کاربر وجود یک cPanel server قابل‌اجرا را گزارش کرده، اما تعلق آن به همین staging host یا محیط production مشخص/تأیید نشده است.
- Android device، WebView version matrix، screenshot/recents، rooted device، login/logout و session expiry تست نشدند.
- PHP CLI در sandbox موجود نبود؛ هیچ PHP lint/runtime test انجام نشد.
- هیچ APK، server config، account, secret یا release تغییر نکرد.

## گیت‌های پیشنهادی

1. از owner/security تیم یک staging environment بی‌دادهٔ production و credential آزمایشی بگیرید؛ secret را در chat/repo نفرستید.
2. cookie/session flags، logout/revocation، expiry، brute-force rate limit و audit logs را server-side تأیید کنید.
3. session retention را با device test بررسی کنید: login, app background/kill/restart, logout, account switch, lost-device revocation.
4. تصمیم بگیرید APK admin debug را فقط به testerها ارائه کنید یا link عمومی را حذف/محدود کنید؛ public availability هرگز authorization محسوب نشود.
