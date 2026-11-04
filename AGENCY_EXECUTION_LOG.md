# دفتر اجرای آژانس مهندسی هوش مصنوعی — Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05 local
**شاخهٔ نشست فعلی:** `arena/e38db981-hesabyar2` (`active`)، بر پایهٔ merge commit PR #8: `5d58f36bd2e3cee266a28c93f8abbb6aebcd354d`
**مخزن همین نشست:** `rahmaniho/Hesabyar2`
**PRهای مستندات/پروتوتایپ:** PRهای [#1](https://github.com/rahmaniho/Hesabyar2/pull/1)، [#2](https://github.com/rahmaniho/Hesabyar2/pull/2)، [#3](https://github.com/rahmaniho/Hesabyar2/pull/3)، [#4](https://github.com/rahmaniho/Hesabyar2/pull/4)، [#5](https://github.com/rahmaniho/Hesabyar2/pull/5)، [#6](https://github.com/rahmaniho/Hesabyar2/pull/6)، [#7](https://github.com/rahmaniho/Hesabyar2/pull/7) و [#8](https://github.com/rahmaniho/Hesabyar2/pull/8) در `main` ادغام شدند؛ آخرین merge commit `5d58f36bd2e3cee266a28c93f8abbb6aebcd354d` است.
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
- GitHub Actions artifact metadata follow-up: API reported names, sizes and 30-day expirations for observed artifacts from runs `41813070224` (`github-test`), `41645205606` (historical `test-apk`, head `63b882f...`, before current baseline) and `41274386135` (Admin). Job/source metadata confirm the historical `test-apk` build uploaded before its verifier/public-publish step was skipped; no archive was downloaded or parsed, and API metadata does not disclose access policy. Exact IDs/expiries are recorded in `ANDROID_ARTIFACT_VERIFICATION_PLAN.md`, `CI_SUPPLY_CHAIN_AUDIT.md`, `ADMIN_ANDROID_AUDIT.md` and `SOURCE_EVIDENCE.md`.

## محدودیت‌های قطعی

- PR #2 و #3 اسناد follow-up، PR #4 ماتریس artifact verification، PR #5 greenfield UI shell، PR #6 فرم موقت مشتری، PR #7 جزئیات فقط‌خواندنی مشتری و PR #8 فیلتر وضعیت مشتری را به `main` افزودند. PR #8 با merge commit `5d58f36bd2e3cee266a28c93f8abbb6aebcd354d` ادغام شد؛ شاخهٔ فعال فعلی `arena/e38db981-hesabyar2` از همین commit آغاز می‌شود. `main` اکنون UI shell دارد ولی هنوز source کامل/منطق محصول ندارد؛ `KarenYar` همچنان source candidate جدا و تأییدنشده است.
- `KarenYar` منبع بسیار محتمل و مستندشده است، ولی هنوز تأیید کتبی مالک برای اینکه همین source مبنای Hesabyar 2.0 باشد لازم است.
- دامنه‌های رسمی خارج از allowlist شبکهٔ این sandbox هستند؛ کاربر cPanel server را قابل اجرا گزارش کرده، اما cPanel connector پشتیبانی نمی‌شود و server/host/environment این نشست متصل نشده؛ live application/HTTP headers، production DB و secrets بررسی نشده‌اند.
- execution نقش‌ها مستقل نیست؛ هیچ گزارش specialist نباید به‌عنوان تأیید چندعامل یا code review مستقل انسانی تلقی شود.

## وضعیت تغییرات

- **کد برنامه:** greenfield shell/UI prototype در `main` و شاخهٔ `arena/e38db981-hesabyar2`: React/TypeScript/Vite، رابط RTL، dashboard و صفحه‌های mock، navigation/search/notification/modal، تعامل‌های مشتری در حافظهٔ موقت، فیلتر وضعیت و سری‌های hard-coded نمودار برای بازه‌های انتخابی. منطق مالی یا persistence وجود ندارد.
- **اعتبارسنجی prototype:** ۹ UI tests، typecheck و build موفق؛ `npm audit` صفر vulnerability گزارش کرد. Vite preview روی `0.0.0.0:5173` فعال است؛ صفحه و module با HTTP 200 پاسخ می‌دهند.
- **دیتابیس/production/release:** بدون تغییر؛ هیچ API، license، migration، APK یا deployment اجرا/تغییر نشده.
- **مستندات قبلی:** commit `612c011` از PR #1 به `main` ادغام شد.
- **مستندات و prototype ادغام‌شده:** PRهای #1 تا #4 اسناد ممیزی/معماری را و PRهای #5 تا #8 greenfield UI و تعامل‌های mock مشتری/داشبورد را به `main` افزودند. شاخهٔ فعلی `arena/e38db981-hesabyar2` ادامهٔ prototype را با mock data می‌دهد؛ اجازه هنوز منطق مالی، persistence پایدار، backend یا source اصلی `KarenYar` را پوشش نمی‌دهد.
- در follow-up جاری، ماتریس پیشنهادی راستی‌آزمایی APK/AAB و Admin debug artifact در `docs/audit/ANDROID_ARTIFACT_VERIFICATION_PLAN.md` تهیه شد تا CI-06..08 و ADM-04 معیار پذیرش و negative-testهای مشخص داشته باشند؛ workflow، signer config یا artifact تغییر نکرد و اجرای این معیارها نیازمند approval است.

## گیت بعدی

ادامهٔ UI prototype و mock interactions در شاخهٔ فعال `arena/e38db981-hesabyar2` مجاز است. پیش از واردکردن یا ویرایش source اصلی، ذخیره‌سازی پایدار، منطق مالی، backend, licensing, migration یا release، مالک باید `rahmaniho/KarenYar` و مسیر توسعه را جداگانه تأیید کند؛ اگر برای این تصمیم‌ها ورودی لازم شد، مرحله‌به‌مرحله از کاربر خواسته می‌شود.
