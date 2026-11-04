# ممیزی امنیت و حریم خصوصی — سورس حساب‌یار 1.4.2

**مبنای کد:** `rahmaniho/KarenYar/main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** source/lockfile محلی؛ هیچ live server، production config، endpoint واقعی، دادهٔ کاربر یا penetration test بررسی نشد.

## یافته‌های اولویت‌دار

### SEC-01 — محرمانهٔ HMAC در کد/کلاینت (بحرانی برای یکپارچگی مجوز)

`src/core/license/license-core.ts:108-112` کلید HMAC را از `VITE_LICENSE_SECRET` می‌خواند و مقدار fallback هم در همان کد قرار دارد؛ `scripts/generate-license.mjs` نیز کلید متناظر را برای صدور استفاده می‌کند. هر `VITE_*` وارد bundle مرورگر می‌شود، و سورس عمومی است. بنابراین secret client-side قابل محرمانه‌ماندن نیست و مسیر offline KS1 از نظر صدور مجوز قابل اعتماد نیست. مسیر server-issued Ed25519 موجود است، ولی فقط با `VITE_LICENSE_API_BASE` فعال می‌شود؛ وضعیت config production `NEEDS_VERIFICATION` است. مقدار secret در این گزارش عمداً چاپ نشده است.

### SEC-02 — PIN قفل UI است، نه رمزنگاری داده (بالا)

`src/core/utils/pin.ts` PIN ۴ تا ۱۲ رقمی را با SHA-256 و salt ثابت hash می‌کند. `LockScreen` محدودیت تلاش/قفل موقت را enforce نمی‌کند؛ تلاش‌ها فقط برای انیمیشن UI استفاده می‌شوند. IndexedDB/localStorage و backup JSON در سورس بازرسی‌شده رمزنگاری نشده‌اند. تهدید سرقت دستگاه/دسترسی به browser profile باید صریحاً از تهدید remote attacker جدا شود.

### SEC-03 — مرز تک‌دستگاهی برای دادهٔ مالی (بالا برای هدف Business)

هیچ login/session مالی، backend authorization، RBAC یا company/tenant isolation در سورس فعلی وجود ندارد. در معماری local-only این نبودن خودبه‌خود آسیب‌پذیری remote نیست، اما محصول را برای multi-user/business سازمانی نامناسب می‌کند تا این لایه طراحی و آزمون شود.

### SEC-04 — Pages HTTPS/domain configuration نامتجانس (بحرانی تا verification)

GitHub Pages settings API در زمان ممیزی `html_url=http://hesabyar.karen-soft.ir/`, `custom_domain=null` و `https_enforced=false` گزارش داد؛ status آخرین deployment موفق نیز `environment_url=http://hesabyar.karen-soft.ir/` ثبت کرد. در مقابل، source دارای CNAME برای همین دامنه و workflow commentی است که HTTPS را ادعا می‌کند. این‌ها شواهد پیکربندی GitHub هستند، نه HTTP response زنده؛ host از sandbox قابل دسترسی نبود و معلوم نیست HTTPS دستی/redirect دیگری برقرار باشد. اگر app از HTTP قابل دریافت باشد، کد client و اطلاعات واردشده در مرورگر در معرض tampering/MITM خواهند بود. پیش از release باید Pages/domain/TLS را روی host واقعی reconcile و HTTP→HTTPS را تأیید کرد.

### SEC-05 — dependency advisories (بالا؛ نیازمند triage)

روی lockfile همین commit:

- `npm audit --omit=dev`: **۳ advisory** (۲ moderate، ۱ high) شامل Zod و React Router.
- `npm audit`: **۳۰ advisory** (۳ low، ۲۲ moderate، ۲ high، ۳ critical)، از جمله `tinypool` در test toolchain، Vite/esbuild و transitive dependencies.

این تعداد، ارزیابی exploitability یا وجود exploit در production نیست. dev-only و runtime باید جدا شوند؛ `npm audit fix --force` انجام نشد چون major upgrade می‌تواند breaking change باشد.

### SEC-06 — CI build steps با token دارای write permission اجرا می‌شوند (ریسک بالقوه بالا)

`android.yml` و `admin-android.yml` `contents:write` را در سطح workflow می‌دهند و در همان jobها `npm ci`/Gradle یا scriptهای repository اجرا می‌شود. `actions/checkout@v4` مقدار پیش‌فرض `persist-credentials=true` دارد و workflow آن را خاموش نکرده است؛ بنابراین credential checkout به شکل git configuration تا پایان job باقی می‌ماند. کد dependency/build در صورت compromise ممکن است از permissionهای job سوءاستفاده کند. این مسیر بالقوه است؛ هیچ سوءاستفاده‌ای مشاهده نشده است. راهکار: build کم‌دسترسی، checkout بدون credential پایدار و publication جدا با token حداقلی.

### SEC-07 — signed release مسیر tag و dispatch دارد، اما gate در YAML دیده نشد (بالا تا verification)

`android.yml` هر tag `v*` را برای signed release می‌گیرد و `workflow_dispatch` نیز گزینهٔ `signed-release`/legacy release را می‌پذیرد. فایل workflow برای signing job، GitHub Environment با reviewer approval یا source-ref allowlist نشان نمی‌دهد. Keystore در workflow پیش از `npm ci` decode می‌شود و مسیرش برای stepهای بعدی export می‌گردد؛ passwordها هنگام Gradle signing داده می‌شوند. Rulesets/branch protection قابل بررسی نبودند (API 403)، پس بیرون از YAML وجودداشتن کنترل را نمی‌توان رد کرد. Owner باید tag rules, required reviewers و secret scope را تأیید کند.

### SEC-08 — Pages write/OIDC permission در کل workflow به build job هم می‌رسد (متوسط)

`pages.yml` `pages:write` و `id-token:write` را workflow-wide اعلام می‌کند، در حالی‌که build job `npm ci` و rate-update script اجرا می‌کند. دسترسی‌ها را تا حد ممکن به deploy job محدود کنید؛ نیاز `configure-pages` با enablement باید جداگانه لحاظ شود.

### SEC-09 — Admin WebView می‌تواند session/DOM state را روی دستگاه نگه دارد (متوسط؛ NEEDS_VERIFICATION)

`admin-android`، `setDomStorageEnabled(true)`, cookie acceptance و `CookieManager.flush()` روی pause را فعال می‌کند؛ در `MainActivity` پاک‌سازی صریح cookie/WebStorage در logout/destroy مشاهده نشد. `LOAD_NO_CACHE` جایگزین پاک‌سازی DOM/cookie نیست. این به‌تنهایی ثابت نمی‌کند session حساس روی staging باقی می‌ماند: server cookie attributes, expiration, logout/revocation و محتوای dashboard زنده بررسی نشدند. جزئیات در [ممیزی Admin Android](ADMIN_ANDROID_AUDIT.md).

### SEC-10 — Debug Admin APK عمومی، staging-only بودنش باید تأیید شود (متوسط)

Workflow debug APK را به GitHub prerelease می‌فرستد و README، target را staging می‌داند. Public distribution باید فقط برای testerهای مجاز باشد؛ Directory Privacy/download secrecy جای server-side authorization نیست. وجود/عدم وجود دادهٔ production روی staging و protection زنده `NEEDS_VERIFICATION` است.

### SEC-11 — staging admin deploy in-place است و session hardening نیازمند verification است

`deploy-app.php` پس از hash-pinned download، archive را مستقیماً روی target `app` extract می‌کند؛ atomic swap/rollback مشاهده نشد. ZIP filename checks دفاع پایه دارند اما size/symlink limits در قطعهٔ بررسی‌شده دیده نشد. Admin PHP فایل‌های session را با `Secure`/`HttpOnly`/`SameSite=Strict`, CSRF و rate limit پیکربندی می‌کنند؛ با این حال `session_regenerate_id()` در فایل‌های دیده‌شده نبود و bootstrap خارج repo است. این‌ها فقط static finding برای staging code هستند؛ runtime exposure یا production effect اثبات نشده. جزئیات: [ممیزی Admin PHP staging](ADMIN_SERVER_AUDIT.md).

### SEC-12 — FileProvider external root is broader than observed export flow (کم؛ hardening)

`android/app/src/main/res/xml/file_paths.xml` includes `external-path` and `cache-path` roots at `.`; provider itself is non-exported and requires URI grants. Source search found only `saveBlob`, which writes to `Directory.Cache` and shares that URI; no app call-site using `external-path` was found. Plugin/runtime uses and final APK URI grants remain unverified, so this is a narrowing/hardening item—not a proven leak. See [Android platform audit](ANDROID_PLATFORM_AUDIT.md).

### SEC-13 — Android merged manifest/network policy needs artifact verification

App source manifest has `targetSdk=36` from Gradle but no explicit `usesCleartextTraffic`/`networkSecurityConfig`; Capacitor local scheme is HTTPS. Plugin manifest merges and the final APK were not inspected, so this is a hardening/verification item—not evidence of HTTP requests. Verify merged permissions, exported components, and cleartext block on a release APK.

### SEC-14 — Backup/CSV/PDF export files remain in app cache without explicit cleanup (متوسط؛ نیازمند policy)

`src/core/utils/file-save.ts` writes sensitive exports to `Directory.Cache`, opens the Share sheet, and does not call `Filesystem.deleteFile` after normal return; the catch path explicitly leaves the cache file. Call-sites include full JSON backup, CSV, payroll PDF and invoice PDF. The existing `file-save.test.ts` covers only the web download path; no native cleanup test was found. App-private cache/`allowBackup=false` reduce exposure to other apps/OS backup but do not encrypt the file or guarantee prompt deletion. Define retention and user messaging; do not delete the file before the receiving share target has consumed it. See [Android platform audit](ANDROID_PLATFORM_AUDIT.md).

### SEC-15 — خطای راه‌اندازی scanner ممکن است stream دوربین را تا بسته‌شدن dialog فعال نگه دارد (کم تا متوسط؛ source finding)

در `BarcodeScannerDialog.tsx:70-103`، پس از موفق‌شدن `getUserMedia`، stream به ref داده می‌شود؛ اگر `video.play()` یا ساخت `BarcodeDetector` شکست بخورد، `catch` فقط status را `denied` می‌کند و trackها را متوقف نمی‌کند. مسیر `stop()` برای scan موفق و effect cleanup هنگام close/unmount هست، اما error state خود dialog آن cleanup را اجرا نمی‌کند. این فقط وقتی مطرح است که کاربر scanner را باز و camera permission را داده باشد؛ شواهدی از فعال‌سازی بدون رضایت، رفتار live یا رخداد واقعی وجود ندارد. تست component/device در source ممیزی‌شده پیدا نشد.

**پیشنهاد:** stop/clear را در تمام error paths بعد از دریافت stream تضمین کنید، و error راه‌اندازی را از permission denial جدا کنید. مجاز برای بررسی بعدی: `video.play()`/BarcodeDetector failure، close/unmount، deny/revoke و خاموش‌شدن camera indicator. جزئیات: [Android platform audit](ANDROID_PLATFORM_AUDIT.md).

### SEC-16 — WebView debugging در buildهای debug از app flag پیروی می‌کند (کم؛ artifact verification)

برنامه در `capacitor.config.ts` گزینهٔ `android.webContentsDebuggingEnabled` را override نمی‌کند. Capacitor 8.5.3، در نبود مقدار config، `WebContentsDebuggingEnabled` را از `ApplicationInfo.FLAG_DEBUGGABLE` می‌گیرد؛ `Bridge` آن را به `WebView.setWebContentsDebuggingEnabled()` می‌دهد. Gradle برای release صریحاً `debuggable=false` می‌گذارد، ولی workflow آزمایشی `assembleDebug` را می‌سازد و debug APK منتشر می‌کند. پس source انتظار debugging خاموش در release و روشن در debug test variant را می‌دهد. مسیر public `github-test` artifact را با `apksigner`/`aapt` بررسی می‌کند و release verifier `debuggable` را رد می‌کند؛ artifact-only `test-apk` همان check را ندارد (CI-06). actual APKها در این نشست بازبینی نشدند. این گزینه به‌تنهایی دسترسی شبکه‌ای عمومی را اثبات نمی‌کند؛ بااین‌حال tooling مجاز دستگاه می‌تواند WebView را inspect کند.

**پیشنهاد:** debug APK فقط به testerهای مجاز و با دادهٔ آزمایشی داده شود؛ `debuggable` و WebView debugging را روی artifact واقعی debug/release جداگانه تأیید کنید. جزئیات: [Android platform audit](ANDROID_PLATFORM_AUDIT.md).

## کنترل‌های مثبت مشاهده‌شده

- WebChromeClient پین‌شدهٔ Capacitor 8.5.3، WebView `VIDEO_CAPTURE` را به مجوز runtime دوربین وصل می‌کند؛ این source evidence است، نه اثبات آزمون روی device.
- Capacitor 8.5.3 mixed-content config را پیش‌فرض false می‌گیرد و release Gradle `debuggable=false` دارد؛ merged manifest و APK نهایی همچنان verify نشده‌اند.
- WebCrypto Ed25519 client verifier، public key pin option و device key identity برای مسیر server license وجود دارند.
- endpointهای PHP staging دارای `Cache-Control: no-store` و روش POST هستند؛ پنل staging در کد به environment guard و CSRF/session متکی است. production deployment تأیید نشد.
- backup import پیش از clear، ساختار و برخی رابطه‌ها را validate می‌کند؛ CSV writer تست formula injection دارد.
- Vite build sourcemap را کنترل می‌کند؛ هیچ ادعای امنیت production از این مورد نتیجه نمی‌شود.

## موارد نیازمند verification/تست

- آیا production از server license path استفاده می‌کند؟ issuer private key و envها کجا نگهداری می‌شوند؟
- HTTPS، CSP، headers، access logs، admin protection و rate limits روی host واقعی.
- backup encryption، دستگاه گم‌شده، XSS/local access و بازیابی PIN.
- Android barcode scanner: runtime camera permission، WebView `BarcodeDetector`, deny/revoke، exactly-once callback و توقف stream بعد از setup failure.
- debug/release APK: merged manifest، `debuggable` و WebView debugging state؛ no APK binary در این نشست verify نشد.
- امضا/لغو مجوز و compatibility با مشتریانی که KS1 مادام‌العمر خریده‌اند.
- triage advisories و برنامهٔ ارتقای کم‌ریسک با تست رگرسیون.

هیچ secret واقعی از config محیطی بازیابی نشد؛ production secrets در دسترس نبودند و نباید در Git/chat قرار گیرند.
