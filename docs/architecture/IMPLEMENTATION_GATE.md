# گیت آمادگی برای اولین تغییر اجرایی

**وضعیت:** architecture کلی و backend/tenant details هنوز approval نشده‌اند؛ پیش‌نویس ADR-001 فقط گزینه‌ها و پرسش‌های باز را ثبت می‌کند. کاربر `Hesabyar2` را به‌عنوان source greenfield و Shared Core را به‌عنوان هدف سطح‌بالا انتخاب کرد؛ همچنین فقط helper خالص WP‑1 را با قرارداد محدود پایین‌تر تأیید کرد. هیچ transaction، posting یا persistence مجاز/پیاده‌سازی نشده است.
**Baseline شواهد:** snapshot read-only `KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`; PR #11 با merge `f13e3d95e6af86a394a42e22a2e0ea031de0a7f0` و PR #12 با merge `621136567b69fe895e985e76cf94fa691596ef3b` در `Hesabyar2/main` ادغام شده‌اند؛ شاخهٔ فعال نشست `arena/4085f085-hesabyar2` روی merge #12 است. CI روی mergeهای #11/#12 با runs `41939981854` و `42004918329` موفق شد. Pages build/deploy خودکار برای هر دو merge موفق بود (آخرین run `42004917176`); محتوا browser-verified نیست. کاربر خواسته Pages deployment دیگری بدون مجوز جداگانه انجام نشود. ADR-001 فقط draft است و Shared Core implementation details همچنان approval pending است.

## چرا این گیت لازم است؟

`KarenYar` به‌صورت read-only بررسی شد، اما کاربر بعداً `Hesabyar2` را source greenfield برای توسعهٔ جدید و Shared Core را هدف سطح‌بالا انتخاب کرد؛ کد موجود همچنان prototype است و هیچ source از `KarenYar` منتقل نشده. کاربر وجود سرور cPanel را گزارش کرده، اما host، staging/production boundary و دسترسی تأیید نشده و بررسی cPanel به درخواست کاربر deferred است. production behavior، migration مشتری، Pages/TLS، branch/ruleset protection، CI signing secrets و تصمیم‌های دامنه‌ای همچنان نیازمند بررسی/تأیید‌اند. تنها مجوز مالی مشخص فعلی، helper خالص WP‑1 با قرارداد دقیق همین سند است؛ این مجوز شامل تراکنش، persistence، API/DB، migration، release یا deployment نیست.

## تصمیم‌ها/شواهد لازم پیش از اولین PR برنامه

| Gate | مالک/نقش لازم | تصمیم یا evidence موردنیاز | وضعیت |
|---|---|---|---|
| G-01 — Canonical source | product/repository owner | کاربر `Hesabyar2` را برای توسعهٔ greenfield انتخاب کرده؛ آیا `KarenYar` فقط legacy compatibility/reference می‌ماند یا بعداً import/migration لازم می‌شود؟ | `HESABYAR2_SELECTED / LEGACY RELATION OPEN` |
| G-02 — Scope و baseline پشتیبانی | product/release owner | کاربر Shared Core را به‌عنوان هدف سطح‌بالا برگزید؛ مرز Personal/Business، migration و release support هنوز چیست؟ | `HIGH-LEVEL TARGET SELECTED / DETAILS PENDING` |
| G-03 — پول و قواعد ثبت | accounting/domain owner | قرارداد محدود WP‑1 تأیید شده: واحد صریح Rial/Toman، ورودی صحیح مثبت، remainder دقیق بدون rounding، دو شیوهٔ رقم؛ قواعد posting، refund flow، tax، effective date و بستن دوره هنوز چیست؟ | `WP-1 INPUT POLICY CONFIRMED / OTHER DOMAIN RULES PENDING` |
| G-04 — سازگاری و داده | database/product owner | fixture ناشناس از backup/versionهای پشتیبانی‌شده، سناریوی restore و plan rollback کجاست؟ آیا برای legacy voidها source record قابل اتکا هست؟ | `NEEDS_VERIFICATION` |
| G-05 — مجوز/حریم خصوصی | licensing/security owner | حفظ lifetime/KS1، سرور مجوز، crypto keys، retention و رفتار هنگام license failure چگونه باید باشد؟ | `NEEDS_SECURITY_APPROVAL` |
| G-06 — CI/release authority | repository/security owner | branch/tag rules، required checks، Environment reviewers و secret scopes چیست؟ آیا همهٔ APK/AAB و Actions artifactها پیش از upload/انتشار verify می‌شوند (از جمله `test-apk` و artifactی که در `github-test` پیش از verifier upload می‌شود)؛ آیا Admin gate signer/debuggable را assert و signed-release AAB مستقلاً validate می‌کند؟ معیار پیشنهادی: [ماتریس راستی‌آزمایی artifactها](../audit/ANDROID_ARTIFACT_VERIFICATION_PLAN.md). Pages branch preview عمدی است؟ | `NEEDS_ADMIN_VERIFICATION` |
| G-07 — Deployment/TLS | Pages/DNS owner | چرا Pages API/deployment URL با HTTP گزارش می‌شود و custom domain خالی است؟ live TLS/redirect/headers چگونه تأیید می‌شوند؟ | `NEEDS_LIVE_VERIFICATION` |
| G-08 — Admin session lifecycle | security/admin owner | admin debug APK فقط به staging وصل است؟ server cookie/session flags, expiry, logout/revocation و storage cleanup چگونه‌اند؟ | `NEEDS_STAGING_REVIEW` |
| G-09 — Staging deployment rollback | release/infra owner | in-place ZIP extraction را با atomic deploy/rollback چگونه کنترل می‌کنند؟ artifact hash/provenance و staging snapshot کجاست؟ | `NEEDS_STAGING_REVIEW` |
| G-10 — Android final artifact | Android/security owner | merged manifest/permissions، cleartext/mixed-content policy، FileProvider URI grants و debuggable/WebView-debug state در APK release و debug دقیقاً چیست؟ ماتریس artifact verification معیارهای اولیه را مشخص می‌کند؛ تأیید binary و device همچنان لازم است. | `NEEDS_ARTIFACT_REVIEW` |
| G-11 — Android export retention | product/privacy owner | backup/CSV/PDF پس از share/cancel در app cache چه مدت می‌ماند و چه پیام/cleanupی دارد؟ | `NEEDS_POLICY_AND_DEVICE_TEST` |
| G-12 — cPanel run scope | site/security owner | کدام cPanel environment (staging/production)، چه host/path، و دقیقاً کدام read-only checks مجازند؟ | `DEFERRED_BY_USER / NEEDS_SCOPE_BEFORE_FUTURE_EXECUTION` |
| G-13 — Barcode scanner one-shot | app/QA owner | برای هر scan حداکثر یک `onDetected` رخ می‌دهد، callback پس از close لغو می‌شود، و camera track در همهٔ failureها متوقف می‌شود؟ | `NEEDS_COMPONENT_AND_DEVICE_TEST` |

مقادیر secret، backup واقعی مشتری یا دادهٔ production را به Git/chat منتقل نکنید؛ verification باید از مسیر امن مالک و با دادهٔ ناشناس انجام شود.

## Work packages — گیت‌ها، مجوزها و وضعیت

### WP-0 — منبع و CI قابل تکرار (`IN PROGRESS / WORKFLOW ACTIVE; BRANCH POLICY PENDING`)

- source greenfield در سطح بالا `Hesabyar2` انتخاب شده؛ baseline برنامه روی شاخهٔ فعلی تثبیت است و معماری/edition boundaries جزئی‌تر هنوز ADR می‌خواهند.
- `.github/workflows/ci.yml` روی pull requestها و push به `main` اجرا می‌شود: Node 22، `npm ci`, `npm run lint`, tests, typecheck, build و `npm audit --audit-level=low`.
- Workflow فقط `contents: read` دارد، `actions/checkout` و `actions/setup-node` را به commit SHA کامل pin می‌کند، checkout credential را نگه نمی‌دارد، timeout/concurrency دارد و هیچ deploy، sign، release یا artifact publication انجام نمی‌دهد.
- Lint با Oxlint 1.91 در `.oxlintrc.json` تنظیم شده: قواعد correctness برای TypeScript/React/Vitest/import و قواعد React Hooks مشخص؛ style/pedantic lint عمداً فعال نشده‌اند. Release guard هم موضوع این test-only workflow نیست.
- **خروجی پذیرش:** PRهای #11 و #12 با check سبز ادغام شدند؛ CI روی merge commit PR #12 با run `42004918329` موفق است. Owner هنوز باید required-check/branch-protection policy را جداگانه تأیید کند؛ تنظیمات branch protection تغییر نکرده‌اند و workflow به‌تنهایی check را اجباری نمی‌کند.

### WP-1 — مرز ورودی پول POS (`IN PROGRESS / PURE HELPER ONLY`)

- **قرارداد مصوب کاربر:** caller واحد `rial` یا `toman` را صریح می‌دهد؛ ورودی در هر واحد عدد صحیح مثبت است؛ Rial به‌صورت دقیق نگه داشته می‌شود و Toman با ضریب ۱۰ به integer Rial تبدیل می‌شود؛ هیچ rounding نداریم؛ صفر/منفی و اعشار رد می‌شوند؛ رقم فارسی و لاتین پذیرفته می‌شوند؛ برگشت وجه در جریان جداگانه‌ای خواهد بود.
- نمایش دقیق Rial به Toman: `۱۱ ریال` به‌صورت `۱ تومان و ۱ ریال`، نه rounded decimal. helper خالص `src/domain/money.ts` همین قرارداد را اجرا می‌کند و به UI فروش، posting یا persistence وصل نیست.
- تست‌ها پوشش می‌دهند: ۰، تمام ۱..۱۱ ریال، ورودی ریال/تومان، رقم فارسی/لاتین، grouping معتبر/نامعتبر، decimals، منفی، و مقدار BigInt بزرگ بدون overflow. حد تجاری مبلغ برای transaction flow هنوز تعیین نشده است.
- **خروجی پذیرش فعلی:** هیچ ورودی helper بی‌صدا گرد یا حذف نمی‌شود؛ caller باید unit را تعیین کند؛ invalid input explicit result می‌دهد؛ helper تنها در isolation تست شده است. PR #11 و CI روی merge commit main سبز شدند؛ PR #12 مستندات را افزود؛ review مستقل و اتصال به POS خارج از WP‑1 فعلی‌اند.
- هیچ schema/data migration یا تراکنش واقعی در این WP اجرا نشده است.

### WP-2 — ابطال/اصلاح فروش

- ابتدا mapping موجودی invoice، `transactions`, payments/refunds، گزارش و `financialEvents` به مدل reversal تصویب شود.
- original posted evidence immutable بماند؛ reversal به original reference داشته باشد؛ درخواست تکراری idempotent باشد؛ مجموع postingها متوازن باشد.
- مشخص شود آیا draft/void/posted/returned states جدا می‌مانند و گزارش تاریخی چگونه رفتار می‌کند؛ برای legacy voidها دادهٔ حذف‌شده را حدس نزنید.
- **خروجی پذیرش:** fixture قدیمی و جدید، migration/rollback rehearsal، audit trail و account reconciliation با owner sign-off.

### WP-3 — Shared Core/Business ledger

- تنها پس از WP-0..2 و domain approval؛ accounting product mappings، fiscal periods، currencies, tax/legal rules و tenant model باید جدا تصویب شوند.
- backend/DB/host در این سند انتخاب نشده‌اند؛ Supabase یا provider دیگر بدون requirements و operational approval انتخاب نشود.
- هیچ migration از IndexedDB کاربر به cloud بدون consent, reconciliation, restore و rollback rehearsal اجرا نشود.

## Definition of Done برای هر تغییر مالی

1. تغییر روی canonical repo/ref مصوب، با diff کوچک و قابل review باشد.
2. baseline test پیش از تغییر و tests پس از تغییر ثبت شود؛ هر آزمونی که اجرا نشد صریحاً `NOT RUN` بماند.
3. محاسبه پول در واحد/precision مصوب و overflow-safe باشد؛ rounding یا conversion خاموش ممنوع.
4. posting/reversal اتمیک، idempotent و متوازن باشد؛ posted source فیزیکی پاک/overwrite نشود.
5. migration و rollback روی fixture ناشناس تمرین شوند؛ هیچ Customer DB یا production write بدون approval جدا.
6. CI least-privilege باشد؛ secret/token/keystore در log یا artifact ناخواسته ظاهر نشود.
7. accounting, security, QA و owner acceptance بر اساس نقش لازم ثبت شود؛ اجرای یک agent، review مستقل انسانی محسوب نمی‌شود.

## وضعیت فعلی

- WP-0: `IN PROGRESS / CI ACTIVE; BRANCH POLICY PENDING`; WP-1: `IN PROGRESS / PURE HELPER ONLY`; WP-2/WP-3: `NOT STARTED`.
- `.github/workflows/ci.yml` lint، test، typecheck، build و npm audit را با دسترسی read-only اجرا می‌کند؛ آخرین run main روی merge commit PR #12 (`42004918329`) موفق است؛ branch protection/required-check policy تغییر نکرده است.
- `src/domain/money.ts` تنها helper مستقلِ WP-1 است؛ هیچ sales flow، posting، ledger، DB، license، production، Android artifact یا release به آن وصل نشده است.
- UI prototype و تعامل‌های mock در main هستند؛ PR #12 نیز مستندات و ADR-001 پیش‌نویس را ادغام کرد. Pages workflow پس از merge PR #12 به‌طور خودکار build/deploy شد (run `42004917176` موفق)، اما محتوای URL در مرورگر بررسی نشده. کاربر خواسته Pages deploy دیگری تا مجوز جداگانه انجام نشود؛ workflow CI نیز به‌تنهایی check را اجباری نمی‌کند.
- پیش از اتصال helper به POS، تراکنش/ابطال/refund، ledger، persistence/backend، licensing، migration یا release، WP-0 و gateهای domain/security مربوط باید جداگانه بسته شوند؛ `KarenYar` هنوز import یا ویرایش نشده است.
