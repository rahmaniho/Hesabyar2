# ممیزی CI/CD و زنجیرهٔ تأمین — سورس حساب‌یار

**Source baseline:** `rahmaniho/KarenYar`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** سه workflow موجود در `.github/workflows/` و metadata عمومی GitHub؛ هیچ workflow، secret یا تنظیم مخزن تغییر نکرد.

## نمای workflowها

| Workflow | Trigger و دسترسی | آنچه واقعاً اجرا/منتشر می‌کند |
|---|---|---|
| `pages.yml` | push به `main` و `arena/7c7cf0f8-karenyar`، schedule و manual dispatch؛ permissionهای workflow-wide شامل `contents:read`, `pages:write`, `id-token:write` | `npm ci`, update نرخ با `continue-on-error`, build و deploy به Pages؛ `npm test`, typecheck و lint در آن دیده نشد |
| `android.yml` | push به چند branch آزمایشی، همهٔ tagهای `v*` و manual dispatch؛ `contents:write` در سطح workflow | tagها به `signed-release` می‌روند؛ dispatch می‌تواند `github-test`, `test-apk` یا `signed-release` را انتخاب کند؛ `npm ci`, guard tests، build و در مسیر release، امضای APK/AAB و انتشار tag |
| `admin-android.yml` | manual dispatch و push به یک branch مشخص؛ `contents:write` در سطح workflow | debug APK را می‌سازد، metadata و debug signature را validate می‌کند، checksum می‌سازد و به GitHub prerelease می‌فرستد |

در commit بررسی‌شده workflowای با trigger `pull_request` یا CI عمومی که test/typecheck/lint را روی تغییرات به‌طور خودکار اجرا کند مشاهده نشد. API مسیرهای branch protection و rulesets با `403 Resource not accessible by integration` پاسخ داد؛ این **به معنی نبودن** protection نیست، فقط تنظیماتش برای این ممیزی قابل مشاهده نبود.

## یافته‌ها

### CI-01 — build code در job دارای مجوز نوشتن اجرا می‌شود (ریسک بالقوه بالا)

`android.yml` و `admin-android.yml` در سطح workflow `contents:write` دارند، در حالی‌که همان jobها `npm ci`/Gradle و scriptهای repository را اجرا می‌کنند. `actions/checkout@v4` نیز `persist-credentials: false` تنظیم نکرده است؛ [تعریف action](https://github.com/actions/checkout/blob/v4/action.yml) مقدار پیش‌فرض `true` دارد، پس credential checkout تا پایان job در git configuration می‌ماند. اگر dependency، build script یا کد branch/tag کنترل‌نشده دستکاری شود، blast radius از build/test فراتر می‌رود و می‌تواند به repository/release write برسد. این یک مسیر ریسک زنجیرهٔ تأمین است، نه شاهد سوءاستفادهٔ رخ‌داده.

**کاهش ریسک پیشنهادی:** build/test job با `contents:read` و checkout بدون credential پایدار؛ انتشار در job جدا با `contents:write` فقط پس از validation؛ محدودکردن runner/token دسترسی‌اش؛ protected GitHub Environment برای signing با required reviewers؛ و tag ruleset/branch policy برای source مجاز. تنظیمات واقعی rulesets/protection باید توسط owner تأیید شوند.

### CI-02 — مسیر signed release در YAML به ref/approval صریح محدود نشده (ریسک بالقوه بالا)

`android.yml` هر tag با الگوی `v*` را signed release می‌داند. در `workflow_dispatch` نیز ورودی `signed-release` و مسیر legacy `release=true` پذیرفته می‌شوند؛ فایل workflow برای این مسیر شرط `environment:` یا allowlist ref نشان نمی‌دهد. گام signing secret، فایل keystore را **پیش از** `npm ci` و build decode می‌کند و مسیر آن را در `GITHUB_ENV` می‌گذارد؛ passwordها فقط در Gradle step به env داده می‌شوند. بنابراین در مسیر signed، dependency/build code بعدی داخل همان job به فایل keystore دسترسی دارد و Gradle code هنگام امضا passwordها را می‌گیرد. در tag `v1.4.2` validation شکست خورد، اما log در این ممیزی قابل دریافت نبود و علت دقیق معلوم نشد؛ در آن run مراحل بعدی و فایل keystore اجرا/ساخته نشدند. نمی‌دانیم branch/tag protection یا secret/environment policy خارج از YAML چه کنترل‌هایی دارد.

**کاهش ریسک پیشنهادی:** signing secrets را به Environment دارای approval متصل کنید، deploy را فقط از tag محافظت‌شده و commit مصوب `main` مجاز کنید، manual dispatch از branch غیرمجاز را رد کنید و signature/source lineage را قبل از انتشار بسنجید. secret value هرگز در log یا repo قرار نگیرد.

### CI-03 — testهای اصلی به‌عنوان gate در CI مشاهده نشدند (ریسک کیفیت/مالی بالا)

در `pages.yml` build وب انجام می‌شود؛ در `android.yml` `npm run test:android-release` (guardهای انتشار) و build اجرا می‌شوند؛ workflow ادمین APK metadata را بررسی می‌کند. اجرای `npm test` (۴۷ فایل/۳۶۹ تست در ممیزی محلی)، `typecheck` و `lint` در workflowهای مشاهده‌شده نبود. بنابراین نتیجهٔ موفق build/deploy به‌تنهایی به معنی گذر unit tests، type safety یا lint نیست. branch protection و required checks از API قابل بررسی نبودند.

**کاهش ریسک پیشنهادی:** PR CI اجباری برای `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` و `npm run test:android-release`; required status checks روی branchهای release؛ تست artifact امضاشده و device/E2E جداگانه. هیچ‌یک در این ممیزی اضافه یا اجرا نشد.

### CI-04 — actionها با major tag ارجاع شده‌اند، نه full commit SHA (سخت‌سازی زنجیرهٔ تأمین)

در workflowها نمونه‌هایی مثل `actions/checkout@v4`, `actions/setup-node@v4`, `actions/setup-java@v4`, `actions/deploy-pages@v4` و `softprops/action-gh-release@v2` دیده شدند. tag نسخه می‌تواند در آینده به commit دیگری اشاره کند؛ در source pin به SHA کامل مشاهده نشد.

**کاهش ریسک پیشنهادی:** actionهای خارجی را به full SHA pin کنید، نسخهٔ قابل‌خواندن را در comment نگه دارید و updateهای SHA را با Dependabot/Renovate و review کنترل کنید. در `.github/` این commit فقط `workflows/` دیده شد؛ فایل `.github/dependabot.yml` یافت نشد. این عدم مشاهده، تنظیمات سازمانی/خارجی را رد نمی‌کند.

### CI-05 — permissionهای Pages بیش از حد لازم به build job هم می‌رسند

`pages.yml` `pages:write` و `id-token:write` را در سطح workflow اعلام می‌کند، نه فقط job `deploy`. هم‌زمان job `build`، `npm ci` و rate-update script را اجرا می‌کند. طبق YAML، build job سطح دسترسی Pages/OIDC لازم برای deploy را نیز می‌گیرد؛ نیاز دقیق `configure-pages` با `enablement: true` باید در طراحی اصلاح حفظ شود.

**کاهش ریسک پیشنهادی:** permission را per-job تعریف کنید؛ build فقط `contents:read` داشته باشد و `pages:write`/`id-token:write` تا جای ممکن فقط به deploy job برسد. اگر فعال‌سازی خودکار Pages نیازمند write است، آن کار را جدا و محدود کنید.

### CI-06 — debug Actions artifact پیش از verification upload می‌شود یا اصلاً verify نمی‌شود (کم؛ CI hardening)

در [`android.yml`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/.github/workflows/android.yml#L120-L146)، targetهای `github-test` و `test-apk` هر دو `assembleDebug` می‌سازند و ابتدا Actions artifact را upload می‌کنند (`L127-L134`). فقط بعد از آن target `github-test`، `android:publish-test` را اجرا می‌کند؛ [`publishTestRelease`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/scripts/android-test-release.mjs#L128-L165) ابتدا `verifyTestApk()` را روی APK واقعی اجرا می‌کند و در صورت موفقیت checksum می‌سازد و release را منتشر می‌کند. پس public pre-release asset در این مسیر verifier-gated است، اما Actions artifact همان run پیش از verifier upload شده و verifier fail کردن job الزاماً upload قبلی را پس نمی‌گیرد. در target `test-apk` اصلاً `android:publish-test` اجرا نمی‌شود و Actions artifact هیچ binary verifier ندارد. دسترسی/retention/قابلیت دانلود این Actions artifactها بررسی نشد.

Run `41813070224` از همان tree source build/sync و publication verifier را با موفقیت گذراند؛ این، نقص ordering برای Actions artifact و فقدان verifier در target `test-apk` را رفع نمی‌کند. تست Node `test:android-release` کد guardها را می‌آزماید، نه APK خروجی `test-apk` را.

برای نمونهٔ اجرای artifact-only، run [`41645205606`](https://github.com/rahmaniho/KarenYar/actions/runs/41645205606) از push به `arena/bec0e04f-karenyar` با head `63b882febb78473854ddb09a2fbe46b73751cc67` پیدا شد. Workflow و `android-test-release.mjs` در همان commit branch را به `test-apk` نگاشت می‌کنند؛ job، build و `Upload debug APK` را موفق و `Publish verified testing APK` را skipped ثبت کرده است. GitHub Actions API artifact را با ID `13235042667`, اندازهٔ `9,314,231` بایت و expiry `2026-12-03T13:35:36Z` گزارش می‌کند (`expired=false` در query مورخ 2026-11-05). این run پیش از baseline ممیزی است و binary مستقلاً download/parse نشد؛ API metadata اندازه/retention را می‌دهد، نه محتوای artifact یا access policy. برای baseline فعلی، فقدان verifier در `test-apk` از بررسی workflow source نتیجه شده است.

**کاهش ریسک پیشنهادی:** verifier مشترک `verifyTestApk` را پیش از هر upload debug artifact اجرا کنید؛ app ID/version/minSdk/debuggable/signing identity و checksum را validate و verification را fail-closed کنید. اگر upload قبل از validation از نظر workflow ناگزیر است، artifact را تا موفقیت verifier غیرقابل‌دسترسی نگه دارید.

### CI-07 — signed-release AAB بدون verifier مستقل upload/publish می‌شود (کم؛ نیازمند تأیید artifact)

[`android.yml`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/.github/workflows/android.yml#L148-L184) در target `signed-release` هر دو `assembleRelease` و `bundleRelease` را می‌سازد. مرحلهٔ [`android:verify`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/scripts/verify-android-release.mjs#L9-L51) فقط `app-release.apk` را می‌گیرد و روی همان APK `apksigner verify` و `aapt dump badging` اجرا می‌کند. سپس `upload-artifact` و GitHub Release هر دو APK و `app-release.aab` را با هم می‌فرستند؛ AAB به verifier صریحی مانند `jarsigner`/`bundletool validate` یا signer/metadata comparison پاس داده نمی‌شود.

این missing gate است، نه شاهدی از AAB نامعتبر؛ run tag `v1.4.2` در signing-key validation پیش از build fail شد و AAB نهایی در این ممیزی مشاهده نشد.

**کاهش ریسک پیشنهادی:** پیش از upload/release خود AAB را verify کنید، application ID/version/signer را با release metadata/APK تطبیق دهید و checksum/provenance هر دو artifact را ثبت کنید.

### CI-08 — Admin APK gate امضای معتبر را می‌سنجد، نه signer/debug state (کم؛ hardening)

در [`admin-android.yml`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/.github/workflows/admin-android.yml#L33-L64)، `Verify APK` پیش از upload از `apksigner verify` استفاده می‌کند و app ID، versionName، minSdk و targetSdk را با `aapt dump badging` چک می‌کند؛ این ترتیب از CI-06 بهتر است. اما script signer subject را parse/محدود نمی‌کند، `application-debuggable`, versionCode و permission set را assert نمی‌کند. Run `41274386135` گام Verify/Upload/Publish را موفق گذراند؛ workflow blob و `admin-android` subtree همان‌هایی هستند که در baseline ممیزی. این CI evidence برای همان checkهای موجود است، نه تضمین شروطی که verifier اجرا نمی‌کند؛ APK binary مستقل بررسی نشد و artifact نامعتبر مشاهده نشد.

**کاهش ریسک پیشنهادی:** certificate subject مورد انتظار، `application-debuggable`, versionCode و manifest policy را با `aapt`/`apkanalyzer` صریحاً بررسی کنید؛ fail-closed پیش از upload و prerelease بماند.

## کنترل‌های مثبت مشاهده‌شده

- Android tag build در گام validation کلید امضا متوقف شد؛ مراحل بعدی اجرا و debug fallback منتشر نشد. این fail-closed است، هرچند علت دقیق run واقعی به‌خاطر در دسترس نبودن log نامعلوم ماند.
- مسیر public `github-test` پیش از انتشار با `apksigner`/`aapt`، debug certificate، application ID، version، debuggable و min SDK را روی همان APK بررسی می‌کند؛ release noteها TEST/DEBUG و NOT FOR STORES را روشن می‌گویند. Run `41813070224` روی commit `f724e847b7aa87f7facb8c04be5e27c7473d82a5` از نظر build/sync و publication موفق بود؛ tree آن با baseline ممیزی `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24` برابر است. GitHub API برای فایل APK digest `sha256:0474e5015531dedf4daa1c35a11848d7db1dd43412eef5bc6a275fb011ebd3fc` گزارش می‌کند (metadata، نه محاسبهٔ محلی). این verifier permissionهای merged را enumerate نمی‌کند و در artifact-only target `test-apk` هم اجرا نمی‌شود (CI-06).
- test publication checksum می‌سازد و ابتدا draft prerelease ایجاد و بعد از upload/validation منتشر می‌کند.
- Pages environment policy طبق API branch `main` را مجاز می‌داند؛ branch آزمایشی در workflow trigger می‌شود اما در policy نیست. این ممکن است عمداً build-only باشد؛ policy را بدون تصمیم owner باز نکنید.

## ریسک عملیاتی نرخ‌ها

`scripts/update-rates.mjs` در Pages workflow با `continue-on-error: true` اجرا می‌شود. وقتی منبع نرخ در دسترس نباشد، build ادامه می‌یابد و از نرخ داخل repository استفاده می‌شود. این fallback availability را حفظ می‌کند، اما ممکن است مقدار کهنه منتشر شود؛ UI/خروجی باید زمان آخرین به‌روزرسانی و stale بودن داده را قابل مشاهده کند. متن source این fallback را توضیح می‌دهد؛ freshness واقعی نرخ زنده از sandbox بررسی نشد.

## حدود و گیت بعدی

- Branch protection، rulesets، tag rules، required checks، Environment approvals و secret scopes به‌علت 403 در GitHub API قابل بررسی نبودند؛ هیچ‌کدام را absent فرض نمی‌کنیم.
- Secret value/keystore، host زنده و دستگاه واقعی بررسی نشدند؛ APKها فقط از طریق run/asset metadata و verifier source بررسی شدند و binary مستقل download/parse نشد. برای Actions artifactهای runهای مشاهده‌شدهٔ `41813070224`, `41645205606` و `41274386135`، GitHub API نام/اندازه/expiry را گزارش کرد؛ archiveها یا access policy آن‌ها بررسی نشدند. signed-release AAB نیز مشاهده/دانلود نشد.
- workflow logs برای run Android امضا به‌علت خطای دریافت log در دسترس نبودند؛ علت شکست مشخص نیست.
- پیشنهادها صرفاً remediation هستند؛ هیچ workflow/config/release/secret در این ممیزی تغییر نکرد.

## برنامهٔ پذیرش artifactها

برای تبدیل یافته‌های CI-06..08 و ADM-04 به معیارهای قابل‌آزمون، ماتریس پیشنهادی [راستی‌آزمایی artifactهای Android/Admin](ANDROID_ARTIFACT_VERIFICATION_PLAN.md) تهیه شده است. این سند ترتیب gateها، metadata و manifest checks، signer policy، checksum/provenance و negative tests را مشخص می‌کند؛ **تصویب یا پیاده‌سازی CI محسوب نمی‌شود** و اجرای workflow همچنان نیازمند تأیید owner/security است.
