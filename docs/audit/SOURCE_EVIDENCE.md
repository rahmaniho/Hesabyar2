# شواهد منبع، مخزن و اجرای ممیزی

**گردآوری اولیه:** 2026-11-04 UTC؛ **آخرین تکمیل:** 2026-11-05 local
**مخزن متصل این نشست:** `https://github.com/rahmaniho/Hesabyar2`
**سورس برنامهٔ شناسایی‌شده:** `https://github.com/rahmaniho/KarenYar`
**مخزن وب‌سایت شرکت:** `https://github.com/rahmaniho/karen-soft`

## `Hesabyar2` در نشست

- ابتدای ممیزی روی branch `arena/39118004-hesabyar2` با commit `38aedc6e1c1ea97fbe0b7b95ddf3fa8436955c05`، پیام `Initial commit`, درخت `Hesabyar2` فقط `README.md` (`# Hesabyar2`) داشت.
- PR #1، شامل 42 فایل Markdown مستنداتی، در `main` با merge commit `cf0864939070073ddaeb28783da036a02a6530d8` ادغام شد. PR #2 با merge commit `68588c0e685e108c81835356c0d0fe8f98495ded` و PR #3 با merge commit `64cafd61f803f641fabe13d032256a822159859f` نیز در `main` ادغام شدند؛ هیچ app source به repo منتقل نشد.
- شاخهٔ فعال فعلی نشست `arena/72006e53-hesabyar2` (`active`) روی merge commit PR #3 شروع شده است؛ این repo حالا audit/architecture docs دارد، اما منبع کد محصول نیست.
- مخزن عمومی است؛ عبارت «بدون tag/PR/release» مربوط به snapshot اولیهٔ بررسی است و پس از آن PR #1 ایجاد/ادغام شد.

## شناسایی مخزن واقعی برنامه

- در `rahmaniho/karen-soft`, commit `24056725c5f27000160e7a631043d46672592618`, فایل `docs/hesabyar-release-update.md` منبع APK حساب‌یار را `rahmaniho/KarenYar` اعلام می‌کند.
- `rahmaniho/KarenYar` مخزن عمومی با default branch `main` است؛ commit بررسی‌شده `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`, تاریخ `2026-11-04T11:26:59Z`.
- `package.json`: `name=karenyar-hesabyar`, `version=1.4.2`؛ `capacitor.config.ts`: `appId=ir.karensoft.hesabyar`.
- tag `v1.4.2` در `e24906ee02b59d8a9250b1bfa7eaf07617a7d3d0` است؛ ممیزی روی `main` بعد از merge و همان نسخهٔ package انجام شد.
- snapshot دقیق commit از codeload به `/tmp` دریافت و read-only بررسی شد. فایل‌ها/branchهای هیچ مخزن upstream تغییر نکردند.

## آزمون‌هایی که واقعاً در این نشست اجرا شدند

روی snapshot دقیق `KarenYar/main`، پس از `npm ci --ignore-scripts --no-audit --no-fund`:

- `npm test`: 47 فایل و 369 تست موفق.
- `npm run typecheck`: موفق.
- `npm run lint`: موفق.
- `npm run build`: موفق، با هشدار chunk بزرگ PDF.
- `npm run test:android-release`: 35 تست موفق.
- `npm run release:check`: نسخه 1.4.2، code 10402، application ID `ir.karensoft.hesabyar`.
- `npm audit --omit=dev`: 3 advisory؛ `npm audit`: 30 advisory. هیچ fix اجرا نشد.
- E2E Playwright اجرا نشد: Chromium/Chrome نصب یا در cache نبود.

## شواهد deployment/release از GitHub

- `gh run list` نشان داد Pages deploy برای `main@d41ca291...` در runs `41820955584` و `41850909227` موفق بوده است؛ این build/deploy status است، نه آزمایش HTTP زنده.
- `gh api repos/rahmaniho/KarenYar/pages` در زمان بررسی `html_url=http://hesabyar.karen-soft.ir/`, `custom_domain=null`, `https_enforced=false` گزارش کرد؛ source هم‌زمان root و `public/CNAME` با `hesabyar.karen-soft.ir` دارد.
- آخرین Pages deployment `7549155928` از `main@d41ca291...` success بود؛ deployment status نیز `environment_url=http://hesabyar.karen-soft.ir/` داد. این GitHub metadata است، نه اثبات HTTP response زنده.
- Pages workflow branchهای `main` و `arena/7c7cf0f8-karenyar` را trigger می‌کند، اما deployment-branch-policy فقط `main` را می‌پذیرد. اجرای تاریخی `38646826391` روی branch آزمایشی build موفق/deploy ناموفق داشت؛ علت از metadata روشن نیست.
- `gh run view 41809043536` نشان داد tag `v1.4.2` در گام تأیید/بازکردن release signing key fail شد و signed APK/AAB build نشد. بازیابی log با خطای `EOF` ناموفق بود؛ بنابراین علت دقیق (secret غایب/نامعتبر یا keystore format) تأیید نشده است.
- Run `41813070224` روی `arena/74812266-karenyar` با نتیجهٔ success بود؛ `headSha=f724e847b7aa87f7facb8c04be5e27c7473d82a5` و release tag نیز به همان commit اشاره دارند. Git tree این commit `0a4d5a687dde09e3acf8eccea353079bfb7adbe3` است و با tree snapshot ممیزی `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24` برابر است. Job metadata `Build web app + sync into Android`, `Build debug APK`, upload و `Publish verified testing APK` را همگی success نشان می‌دهد.
- کد [`publishTestRelease`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/scripts/android-test-release.mjs#L128-L165) پیش از publish، `verifyTestApk` را اجرا می‌کند؛ script روی APK واقعی debug certificate و package/version/versionCode/debuggable/minSdk را بررسی می‌کند و سپس SHA-256 می‌سازد. Release API، APK آزمایشی را با اندازهٔ 9,146,513 بایت و digest `sha256:0474e5015531dedf4daa1c35a11848d7db1dd43412eef5bc6a275fb011ebd3fc` گزارش می‌کند؛ این GitHub metadata است و محلی دوباره محاسبه نشد. تلاش دانلود در sandbox در redirect به `release-assets.githubusercontent.com`—خارج از egress allowlist—متوقف شد؛ پس APK مستقل parse یا hash/signature مقایسه نشد. `gh release list` این pre-release را NOT FOR STORES می‌خواند؛ آخرین stable release ثبت‌شده `v1.2.5` است.
- در commit دقیق، `.github/workflows/` فقط `admin-android.yml`, `android.yml`, `pages.yml` دارد؛ هیچ workflowای با `pull_request` trigger دیده نشد. Android/Admin `contents:write` را workflow-wide می‌دهند؛ Pages نیز `pages:write` و `id-token:write` را workflow-wide دارد.
- `pages.yml` build/deploy می‌کند، Android workflow `test:android-release` را اجرا می‌کند، اما در سه workflow مشاهده‌شده `npm test`, typecheck و lint gate نیستند. `admin-android.yml` debug APK و prerelease را تولید می‌کند.
- `gh api repos/rahmaniho/KarenYar/rulesets` و branch-protection endpoint پاسخ 403 `Resource not accessible by integration` دادند؛ تنظیمات protection قابل تأیید/رد نبودند.
- `.github/` در commit فقط directory `workflows/` دارد؛ `.github/dependabot.yml` مشاهده نشد. این فقط یافتهٔ مخزن است و تنظیمات بیرونی/سازمانی را رد نمی‌کند.
- `admin-android/MainActivity.java` روی commit همان source، `https://staging.karen-soft.ir/admin/`, host/path guard، cancel SSL error، JavaScript/DOM storage، cookies و `CookieManager.flush()` روی pause را دارد؛ manifest `allowBackup=false`/`usesCleartextTraffic=false` است. این فقط static code evidence است.
- Admin Android provenance: run `41274386135`، head `a9f392dcdfc207d66458efc308d4c7b98b647b32`، گام‌های Verify/Upload/Publish همگی success هستند. `admin-android` subtree (`d414ae64d3ffd901da6a3e78d02cc2b59cccc816`) و workflow blob (`7322d7a49a2c69fea6ba8be279d17a5437c8d50e`) با baseline `d41ca...` برابرند. GitHub API asset `hesabyar-admin-1.0.0-debug.apk` را 44,282 بایت و digest `sha256:95c0b44236f603aae56efcaee684576aad21fd462a34ecf844e5ee7a2f6b8946` گزارش می‌کند؛ binary مستقل دانلود/parse نشد. Workflow verifier validity امضا و app ID/versionName/min/target SDK را می‌سنجد، اما signer subject و `application-debuggable` را assert نمی‌کند (ADM-04/CI-08).
- `deploy/cpanel-staging/admin/{index,issue-license,deploy-app}.php` در source، staging-only guard، server auth identity، secure session cookie flags، CSRF/rate limit و prepared SQL دارد؛ `deploy-app.php` SHA-256 ثابت را validate و ZIP را in-place extract می‌کند. `bootstrap.php` خارج repo است.
- SHA-256 artifact این نشست از GitHub blob API دوباره محاسبه شد و با expected hash موجود در deploy script تطبیق داشت؛ branch artifact `arena/1bdeff0a-karenyar` در API به `1d54bf4...` اشاره کرد و `protected=false` گزارش شد. rulesetهای repo به‌علت 403 قابل بررسی نبودند.
- Main Android manifest، app Gradle و Capacitor config در commit دقیق نشان می‌دهند: `allowBackup=false`, direct permissions فقط INTERNET/CAMERA، camera optional، `FileProvider` non-exported ولی `external-path path="."` و target SDK 36؛ Capacitor scheme محلی HTTPS است. جست‌وجوی source call-site فقط `src/core/utils/file-save.ts` را یافت که backup JSON/CSV/PDF را در `Directory.Cache` می‌نویسد و همان URI را share می‌کند؛ `Filesystem.deleteFile` call-site پیدا نشد و catch فایل را در cache باقی می‌گذارد. `file-save.test.ts` فقط مسیر وب را پوشش می‌دهد؛ native cleanup test مشاهده نشد. APK merged/final manifest بررسی نشد.
- `package-lock.json`، `@capacitor/android@8.5.3` و pluginهای app/filesystem/share/status-bar را pin می‌کند؛ package AndroidManifestهای منتشرشدهٔ همین نسخه‌ها empty هستند، اما Gradle merge/وابستگی‌های transitive و APK نهایی اجرا/بررسی نشدند. `BarcodeScannerDialog.tsx` در source از `getUserMedia` و `BarcodeDetector` استفاده می‌کند و ورود دستی fallback دارد؛ Capacitor tag `8.5.3` در `Bridge.java`، `BridgeWebChromeClient` را نصب و در `onPermissionRequest`، `VIDEO_CAPTURE` را به مجوز runtime `CAMERA` وصل می‌کند؛ `Bridge.java` و `BridgeWebChromeClient.java` در tarball پین‌شده byte-for-byte با همان فایل‌های GitHub tag مقایسه شدند. همان component پس از stream setup error در `catch` track را explicit متوقف نمی‌کند. interval async هر 350ms `detect()` را صدا می‌زند، اما one-shot/in-flight guard ندارد و `cancelled` بعد از await بررسی نمی‌شود؛ POS callback هر بار واحد کالا را به basket اضافه می‌کند. پس چند Promise هم‌پوشان می‌توانند به‌طور شرطی مقدار draft را دوباره افزایش دهند. هیچ device/runtime یا component test اجرا نشد، پس این‌ها source-level risk هستند، نه رخداد تأییدشده.
- Capacitor 8.5.3 `allowMixedContent` را پیش‌فرض false می‌گیرد و app config آن را تغییر نمی‌دهد؛ WebView debugging را در نبود override از `ApplicationInfo.FLAG_DEBUGGABLE` می‌خواند. `android/app/build.gradle` در release `debuggable=false` دارد، ولی workflow آزمون `assembleDebug` را می‌سازد. در workflow، Actions artifact برای هر دو target `github-test` و `test-apk` پیش از verifier upload می‌شود؛ `android:publish-test` بعداً فقط برای `github-test` اجرا و APK را پیش از GitHub pre-release verify می‌کند؛ `test-apk` هیچ binary verifier ندارد. Signed-release `android:verify` فقط APK را می‌سنجد و AAB همراه بدون verifier مستقل upload/release می‌شود. `npm run test:android-release` فقط guard-scriptها را تست می‌کند. Run `41813070224` همان public APK را با verifier CI گذراند، اما binary در sandbox مستقل دانلود/parse نشد (provenance/digest در bullet بعد).
- `package-lock.json` همچنین `@capacitor/cli@8.5.3` را pin می‌کند. در CLI tag 8.5.3، [`loadExtConfigTS`](https://github.com/ionic-team/capacitor/blob/8.5.3/cli/src/config.ts#L98-L124) export تنظیمات را به‌عنوان `extConfig` می‌گیرد و مسیر Android [`copyCapacitorConfig`](https://github.com/ionic-team/capacitor/blob/8.5.3/cli/src/tasks/copy.ts#L135-L164) همان را در `capacitor.config.json` می‌نویسد (پس از حذف `android/ios.buildOptions`)؛ تابع defaultهای WebView را تزریق نمی‌کند. `capacitor.config.ts` داخل `server` فقط `androidScheme: 'https'` دارد و `webContentsDebuggingEnabled` و `server.cleartext` را تعیین نمی‌کند. Android `copy`، manifest generator را بدون آرگومان live-reload `cleartext` صدا می‌زند؛ [generator](https://github.com/ionic-team/capacitor/blob/8.5.3/cli/src/cordova.ts#L869-L879) مسیر built-in افزودن `usesCleartextTraffic=true` را فقط با آن آرگومان یا `server.cleartext` فعال می‌کند. بنابراین در مسیر معمول source هیچ‌یک از این overrideها دیده نمی‌شوند. این تحلیل ایستای کد است: در این sandbox `cap sync` اجرا نشد؛ GitHub run `41813070224` آن را روی tree یکسان اجرا و APK آزمایشی را build/verify کرد، اما JSON بومی، Gradle merged manifest و APK binary مستقل در اینجا بازیابی/parse نشدند.
- Admin WebView/APK, session cookies, server headers, Directory Privacy, logout, rate limit, staging dataset و PHP runtime زنده اجرا/بررسی نشدند.

## حدود شواهد

سایت/اپ زنده، production database، logs، configuration secrets، license server واقعی، backup مشتری، دستگاه Android واقعی و چاپگر فیزیکی بررسی نشدند. کاربر گزارش کرده تیم یک سرور cPanel دارد که در صورت نیاز می‌تواند روی آن اجرا انجام دهد؛ lookup connector `cpanel` در Arena `unsupported` بود، این اطلاع هنوز مستقلاً verify یا از این sandbox به سرور متصل نشده، و مشخص نیست staging است یا production/چه سطح مجوزی دارد. hostهای رسمی خارج allowlist این sandbox هستند. بررسی کد `KarenYar` نمی‌تواند وضعیت deployment یا دادهٔ مشتری را ثابت کند.
