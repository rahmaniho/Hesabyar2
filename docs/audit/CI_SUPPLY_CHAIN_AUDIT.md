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

## کنترل‌های مثبت مشاهده‌شده

- Android tag build در گام validation کلید امضا متوقف شد؛ مراحل بعدی اجرا و debug fallback منتشر نشد. این fail-closed است، هرچند علت دقیق run واقعی به‌خاطر در دسترس نبودن log نامعلوم ماند.
- Testing APK پیش از انتشار با `apksigner`/`aapt` از نظر debug certificate، application ID، version، debuggable و min SDK بررسی می‌شود؛ release noteها روشن می‌گویند TEST/DEBUG و NOT FOR STORES و هشدار backup/حذف داده دارند.
- test publication checksum می‌سازد و ابتدا draft prerelease ایجاد و بعد از upload/validation منتشر می‌کند.
- Pages environment policy طبق API branch `main` را مجاز می‌داند؛ branch آزمایشی در workflow trigger می‌شود اما در policy نیست. این ممکن است عمداً build-only باشد؛ policy را بدون تصمیم owner باز نکنید.

## ریسک عملیاتی نرخ‌ها

`scripts/update-rates.mjs` در Pages workflow با `continue-on-error: true` اجرا می‌شود. وقتی منبع نرخ در دسترس نباشد، build ادامه می‌یابد و از نرخ داخل repository استفاده می‌شود. این fallback availability را حفظ می‌کند، اما ممکن است مقدار کهنه منتشر شود؛ UI/خروجی باید زمان آخرین به‌روزرسانی و stale بودن داده را قابل مشاهده کند. متن source این fallback را توضیح می‌دهد؛ freshness واقعی نرخ زنده از sandbox بررسی نشد.

## حدود و گیت بعدی

- Branch protection، rulesets، tag rules، required checks، Environment approvals و secret scopes به‌علت 403 در GitHub API قابل بررسی نبودند؛ هیچ‌کدام را absent فرض نمی‌کنیم.
- Secret value، signing keystore، host زنده و artifact دستگاه واقعی بررسی نشدند.
- workflow logs برای run Android امضا به‌علت خطای دریافت log در دسترس نبودند؛ علت شکست مشخص نیست.
- پیشنهادها صرفاً remediation هستند؛ هیچ workflow/config/release/secret در این ممیزی تغییر نکرد.
