# دفتر اجرای آژانس مهندسی هوش مصنوعی — Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05 local
**شاخهٔ نشست فعلی:** `arena/72006e53-hesabyar2` (`active`), based on PR #3 merge commit `64cafd61f803f641fabe13d032256a822159859f`
**مخزن همین نشست:** `rahmaniho/Hesabyar2`
**PRهای مستندات:** [#1](https://github.com/rahmaniho/Hesabyar2/pull/1)، [#2](https://github.com/rahmaniho/Hesabyar2/pull/2) و [#3](https://github.com/rahmaniho/Hesabyar2/pull/3) در `main` ادغام شدند؛ آخرین merge commit `64cafd61f803f641fabe13d032256a822159859f` است.
**مخزن برنامهٔ شناسایی‌شده:** `rahmaniho/KarenYar`، ممیزی read-only روی `main` commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.

## تاریخچهٔ اجرا

### مرحلهٔ آغازین

- بررسی مخزن متصل به نشست نشان داد فقط `README.md` با محتوای `# Hesabyar2` وجود دارد.
- قابلیت‌های Arena و connectorها بررسی شدند: Linear فعال و اعتبارسنجی‌شده؛ Vercel/Supabase/Google Drive disconnected؛ GitHub connector unsupported ولی `git`/`gh` read access موفق.
- upstream `agency-agents` در commit `b37b5bb33b78f2c1d6567d98e25ca818e3259219` بررسی شد. در این نشست delegation/subagent وجود نداشت؛ personaها فقط نقش‌های متوالی همین ایجنت‌اند.

### پس از درخواست «ادامه بده»

- با خواندن مستند `rahmaniho/karen-soft/docs/hesabyar-release-update.md` مشخص شد مخزن برنامهٔ حساب‌یار `rahmaniho/KarenYar` است.
- هویت source با package `karenyar-hesabyar`, version `1.4.2` و app ID `ir.karensoft.hesabyar` تأیید شد.
- snapshot دقیق `main` در commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24` به فضای `/tmp` دریافت شد؛ هیچ source file/branch upstream تغییر نکرد.
- آزمون‌های local روی snapshot: unit 369/369، typecheck موفق، lint موفق، build موفق با هشدار chunk PDF؛ Android release script tests 35/35؛ npm audit شامل advisories؛ E2E به‌علت نبود browser اجرا نشد.
- معماری فعلی، شکاف حسابداری، DB محلی، license، privacy، print/export و ریسک void فروش بررسی شد.
- پیشنهاد معماری Phase 1 در `docs/architecture/` تهیه شد.
- GitHub Actions/Pages metadata به‌صورت read-only بررسی شد: Pages deployهای `main` موفق بودند، اما Pages API `https_enforced=false` و `custom_domain=null` و deployment status هم `environment_url` با `http` گزارش دادند. `pages.yml` branch آزمایشی را trigger می‌کند، ولی Pages environment فقط `main` را مجاز می‌کند؛ اجرای تاریخی branch آزمایشی build موفق/deploy ناموفق داشت و علت دقیق معلوم نیست. tag Android `v1.4.2` در signing-key validation fail شد؛ log fetch نشد، پس علت دقیق نامعلوم است؛ 1.4.2 فعلی فقط test pre-release است و آخرین stable فهرست‌شده 1.2.5 است.
- جزئیات به `docs/audit/DEPLOYMENT_AND_RELEASE_AUDIT.md`, security audit و risk register افزوده شد؛ هیچ Pages setting، DNS، secret، release یا workflow تغییر نکرد.
- سه workflow عمومی `pages.yml`, `android.yml`, `admin-android.yml` از نظر least privilege و test/release gates به‌صورت read-only بررسی شدند. Android/Admin `contents:write` در سطح workflow دارند و کد build در همان job اجرا می‌شود؛ Pages write/OIDC workflow-wide است؛ full unit/typecheck/lint در CI مشاهده نشد. Rulesets/branch protection API با 403 پاسخ داد، بنابراین وضعیت آن‌ها `NEEDS_VERIFICATION` است. یافته‌ها در `docs/audit/CI_SUPPLY_CHAIN_AUDIT.md` و اسناد امنیت/ریسک ثبت شدند.
- Admin Android shell نیز static review شد: HTTPS-only، SSL cancellation، host/path allowlist و محدودیت WebView مثبت‌اند؛ در عین حال DOM storage/cookies فعال و cookies روی pause flush می‌شوند، بدون cleanup صریح در Activity. Server session, logout, cookie flags و staging data در live host بررسی نشدند.
- Admin PHP staging endpoints هم static بررسی شدند: server-auth guard, staging-only guard, secure session cookie flags, CSRF, rate limiting, prepared queries و hash-pinned app package مثبت‌اند؛ SHA-256 artifact از GitHub blob دوباره محاسبه و با deploy script تطبیق داده شد. Branch منبع hash-pinned فعلاً `protected=false` گزارش شد (rulesetها نامعلوم)؛ deploy in-place است و session rotation/bootstrap/runtime نیازمند verification است. PHP lint اجرا نشد چون PHP CLI موجود نیست.
- Main Android native config نیز static بررسی شد: manifest permission set محدود، `allowBackup=false`, optional camera و non-exported FileProvider؛ external-path root در XML وجود دارد اما call-site برنامه backup/PDF/CSV را در Directory.Cache می‌نویسد/share می‌کند و delete صریح ندارد؛ test موجود فقط web path را پوشش می‌دهد. merged manifest/HTTP policy/APK نهایی نیازمند artifact-level verification هستند.
- کاربر اعلام کرد سرور cPanel برای اجرا در صورت نیاز موجود است. lookup connector cPanel در Arena `unsupported` برگشت؛ server/host یا محیط staging/production از این sandbox متصل/شناسایی نشد و هیچ فرمانی روی آن اجرا نشد. `docs/audit/CPANEL_READ_ONLY_RUNBOOK.md` آماده شد.
- کاربر بعداً روشن کرد cPanel را به خاطر داشته باشیم ولی فعلاً اتصال/بررسی آن لازم نیست؛ سرور در این گام خارج scope ماند و ممیزی read-only source ادامه یافت.
- ادامهٔ Android audit در source دقیق: package-lock نسخه‌های Capacitor Android/pluginها را pin می‌کند؛ manifests همین npm packageها خالی‌اند ولی Gradle merged APK بررسی نشده. `BarcodeScannerDialog` از `getUserMedia`/`BarcodeDetector` استفاده می‌کند؛ Capacitor 8.5.3 `VIDEO_CAPTURE` را به runtime CAMERA permission bridge می‌کند؛ `Bridge.java` و `BridgeWebChromeClient.java` با GitHub tag 8.5.3 byte-for-byte تطبیق داده شدند. در setup error پس از گرفتن stream، `catch`، `stop()` را صدا نمی‌کند و stream ممکن است تا close فعال بماند. همچنین interval async بدون one-shot/in-flight guard است و `cancelled` بعد از await دوباره سنجیده نمی‌شود؛ callbackهای detect هم‌پوشان ممکن است POS basket quantity را افزایش دهند (device confirmation pending). هیچ component/device test اجرا نشد؛ یافته‌های AND-05..08، SEC-15 و R-35..36 مستند شدند.
- ادامهٔ Android WebView/CI review: `@capacitor/cli`, `@capacitor/android` هر دو در lockfile روی 8.5.3 هستند؛ CLI tag در `loadExtConfigTS`، TS default export را مستقیم `extConfig` می‌گیرد و `copyCapacitorConfig` همان را serialize می‌کند، پس مسیر copy پیش‌فرض `webContentsDebuggingEnabled` تزریق نمی‌کند و config برنامه نیز آن را نمی‌نویسد؛ `CapConfig` از `FLAG_DEBUGGABLE` fallback می‌گیرد. CLI مسیر عادی `copy`، Cordova manifest generator را بدون آرگومان live-reload cleartext فراخوانی می‌کند؛ app config `server.cleartext` ندارد. این یافته‌های static و عدم اجرای `cap sync`/Gradle/APK در AND-02/09، SOURCE_EVIDENCE، SEC-13/16، R-33/37 و IMPLEMENTATION_PROGRESS ثبت شدند. `github-test` APK واقعی را با `apksigner`/`aapt` verify می‌کند، اما artifact-only `test-apk` verifier ندارد؛ این شکاف در AND-10، CI-06 و R-38 باقی است. هیچ generated config، merged manifest یا APK در این گام ساخته/بررسی نشد.
- Read-only artifact lineage follow-up: run `41813070224`، head `f724e847b7aa87f7facb8c04be5e27c7473d82a5`, release tag به همان commit و tree برابر با baseline `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24` است. Workflow build/sync، debug build و `Publish verified testing APK` را success گزارش می‌کند؛ `publishTestRelease()` قبل از انتشار `verifyTestApk()` را اجرا می‌کند و GitHub API digest APK را اعلام می‌کند. دانلود binary در sandbox به‌دلیل redirect به host خارج از egress allowlist ناممکن بود؛ هیچ APK اجرا یا تغییر داده نشد. همچنین ترتیب workflow نشان داد Actions artifact برای `github-test` پیش از verifier upload می‌شود، `test-apk` verifier ندارد، و signed-release `android:verify` فقط APK را می‌سنجد نه AAB. این artifact-gate gaps به CI-06/07، R-38/39 و G-06 افزوده شدند. نتایج/محدودیت run و API digest در AND-05/09/10، CI audit، security, deployment, source evidence, risk, progress و audit report ثبت شدند.

- Admin Android artifact gate follow-up: `admin-android.yml` verifier runs before upload/publication and the observed run `41274386135` passed; the run’s `admin-android` subtree and workflow blob match the audited baseline. The script checks valid signature + app ID/versionName/min/target SDK, but does not assert signer subject, `application-debuggable`, versionCode or permissions; API digest is recorded, binary not independently downloaded. ADM-04/CI-08/R-40 and CI/progress gates were updated; no Admin APK/config was changed.

## محدودیت‌های قطعی

- PR #2 مستندات follow-up را نیز به `main` ادغام کرد؛ PR #3 هم در `main` با merge commit `64cafd61f803f641fabe13d032256a822159859f` ادغام شد. شاخهٔ فعال فعلی نشست `arena/72006e53-hesabyar2` از همین merge commit شروع می‌شود؛ app source همچنان در repo نیست.
- `KarenYar` منبع بسیار محتمل و مستندشده است، ولی هنوز تأیید کتبی مالک برای اینکه همین source مبنای Hesabyar 2.0 باشد لازم است.
- دامنه‌های رسمی خارج از allowlist شبکهٔ این sandbox هستند؛ کاربر cPanel server را قابل اجرا گزارش کرده، اما cPanel connector پشتیبانی نمی‌شود و server/host/environment این نشست متصل نشده؛ live application/HTTP headers، production DB و secrets بررسی نشده‌اند.
- execution نقش‌ها مستقل نیست؛ هیچ گزارش specialist نباید به‌عنوان تأیید چندعامل یا code review مستقل انسانی تلقی شود.

## وضعیت تغییرات

- **کد برنامه:** بدون تغییر.
- **دیتابیس/production/release:** بدون تغییر.
- **مستندات قبلی:** commit `612c011` از PR #1 به `main` ادغام شد.
- **مستندات پیگیری ادغام‌شده:** PR #2، `ADMIN_ANDROID_AUDIT.md`, `ADMIN_SERVER_AUDIT.md`, `ANDROID_PLATFORM_AUDIT.md`, `CPANEL_READ_ONLY_RUNBOOK.md` را به `main` افزود؛ PR #3 نیز Capacitor CLI config-copy، Android/Admin artifact verifier coverage، evidence, risks و gates را تکمیل کرد. شاخهٔ فعلی `arena/72006e53-hesabyar2` است؛ app source تغییر نکرده. ادامهٔ کار source/owner approval gate را دور نمی‌زند.
- در follow-up جاری، ماتریس پیشنهادی راستی‌آزمایی APK/AAB و Admin debug artifact در `docs/audit/ANDROID_ARTIFACT_VERIFICATION_PLAN.md` تهیه شد تا CI-06..08 و ADM-04 معیار پذیرش و negative-testهای مشخص داشته باشند؛ workflow، signer config یا artifact تغییر نکرد و اجرای این معیارها نیازمند approval است.

## گیت بعدی

پیش از source changes، مالک باید `rahmaniho/KarenYar` را به‌عنوان source رسمی تأیید کند و تصمیم دهد چگونه کار روی کد با محدودیت شاخهٔ فعال `arena/72006e53-hesabyar2` سازگار شود. پس از آن، مرحلهٔ بعدی جداگانه و با approval، تغییر کوچک و reviewable است؛ نه migration بزرگ یا deployment.
