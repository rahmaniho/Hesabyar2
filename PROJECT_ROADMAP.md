# نقشهٔ راه Hesabyar 2.0

**وضعیت:** کاربر `Hesabyar2` را به‌عنوان source greenfield و Shared Core را به‌عنوان هدف سطح‌بالا انتخاب کرد؛ جزئیات معماری هنوز نیازمند ADR است. UI prototype پس از PRهای #5 تا #10 در `main` موجود است؛ PR #11 در شاخهٔ فعال `arena/a1600dfc-hesabyar2` جزئیات کالا، فیلترهای mock و helper خالص WP‑1 را ادامه می‌دهد.
**تاریخ:** 2026-11-05

| مرحله | هدف | وضعیت فعلی | گیت/معیار خروج |
|---|---|---|---|
| M0 — Environment/source audit | تأیید مخزن واقعی، framework، اجرای baseline و حدود live | `PARTIALLY_COMPLETED`؛ کاربر `Hesabyar2` را برای توسعهٔ greenfield انتخاب کرد؛ `KarenYar` و GitHub Pages/CI به‌صورت read-only بررسی شدند؛ main هنوز UI prototype دارد و source کامل محصول نیست؛ cPanel فعلاً به درخواست کاربر deferred است | مالک source را برای منطق/داده تأیید کند، TLS را با evidence مجاز reconcile کند؛ cPanel را فقط در صورت درخواست بعدی با staging/read-only scope بررسی کنید |
| M1 — Product/accounting gap | مقایسهٔ source با نیاز Personal/Business و invariants | `COMPLETED_FOR_SOURCE / NEEDS_OWNER_REVIEW`؛ ledger double-entry و multi-user در source نیست | domain owner تأیید قواعد و scope محصول |
| M2 — Shared Core architecture | boundaries، editions، migration، ADR | `HIGH-LEVEL TARGET SELECTED / DETAILS PENDING`؛ کاربر Shared Core را در سطح هدف انتخاب کرد؛ اسناد `docs/architecture/` هنوز ADR مصوب نیستند | تأیید مرز editions، tenant، backend، migration و تصمیم‌های مالک/معمار/حسابداری |
| M3 — Financial engine stabilization | exact money، immutable postings، reversals، ledger | `PLANNED`; helper خالص WP‑1 برای ورودی مبلغ، engine/ledger محسوب نمی‌شود؛ پیش‌نیاز معماری M2 | tests invariants، posting/reversal design و schema compatibility plan |
| M4 — Sales/procurement/inventory/treasury integration | فروش/خرید/موجودی/پرداخت به ledger | `PLANNED`; خرید و treasury رسمی در سورس نیست | M3 و domain mappings مصوب |
| M5 — Personal edition completion | حفظ تجربهٔ local-first و قابلیت‌های روزمره | `PLANNED`; پایه‌ای از قابلیت‌ها اکنون در یک app مشترک وجود دارد | entitlement/UX boundary و backup migration |
| M6 — Business accounting | ledger، خرید/AP، چندشرکتی/کاربری، statements | `PLANNED`; پیاده‌سازی Business در source وجود ندارد | M3/M4 و backend authorization |
| M7 — Licensing/entitlements | مهاجرت امن بدون از دست‌دادن lifetime license | `PLANNED`; HMAC سمت client یک ریسک جاری است | سازگاری مشتریان و سرور/کلیدها تأیید شود |
| M8 — Offline/synchronization | sync queue، idempotency و conflict strategy | `PLANNED`; فعلاً فقط offline single-device، نه مالی sync | معماری و آزمون conflict؛ بدون last-write-wins |
| M9 — Persian documents/export | RTL، تقویم، PDF/print/CSV، در صورت نیاز XLSX | `PARTIALLY_COMPLETED`; PDF/CSV code موجود، XLSX/چاپ واقعی نامعلوم | browser/device matrix و پذیرش مالک |
| M10 — UX modernization | تجربهٔ مستقل Personal/Business | `IN_PROGRESS / UI PROTOTYPE ONLY`؛ shell فارسی RTL، navigation و صفحه‌های mock در Hesabyar2 ساخته شده؛ افزودن مشتری در حافظهٔ موقت، فیلتر وضعیت mock در فهرست‌های فاکتور/گردش/مشتری/کالا، سری‌های نمودار ساختگی، و جزئیات فقط‌خواندنی مشتری/فاکتور/کالا با دادهٔ نمونه وجود دارند؛ موجودی و قیمت کالا محاسبه یا تغییر نمی‌شوند؛ مرز editionها و UX نهایی هنوز تصویب نشده | بازبینی UI و آزمون دسترس‌پذیری/اندازه‌ها؛ هیچ منطق مالی یا storage تا approval اضافه نشود |
| M11 — Security/privacy hardening | local data, licensing, RBAC/tenant، HTTPS delivery، CI supply chain، Android FileProvider/Admin session/camera lifecycle/WebView debug and mixed-content policy | `PLANNED`; HMAC/data-at-rest و privilegeهای CI ریسک‌اند، Pages metadata با CNAME/HTTPS ناسازگار است و app/admin artifact/session زنده verify نشده | threat model، merged manifest/URI grant and host/session verification، CI permission/release gates، remediation plan و tests |
| M12 — QA/performance | unit/integration/E2E/security/performance regression | `IN_PROGRESS`; unit/typecheck/lint/build/release tests در ممیزی محلی اجرا شدند، اما workflowهای دیده‌شده suite کامل را gate نمی‌کنند؛ E2E/browser، native export/cache cleanup، camera permission/setup-error/one-shot lifecycle، merged-manifest، debuggable/WebView-debug state، debug Actions artifactهای پیش از verifier، artifact-only `test-apk`، AAB verification، Admin signer/debuggable gate و production QA باز است؛ public test APK run `41813070224` از همان source tree verifier را گذراند | PR CI/required checks، device/artifact review، مستقل review و تمام acceptance evidence |
| M13 — Controlled release | staging, rollback, production release | `NOT_STARTED`; latest stable GitHub release `v1.2.5`; 1.4.2 فعلاً test pre-release و tag build در signing-key validation متوقف شد؛ deployment واقعی بررسی نشده | signing/build verification، HTTPS/host check، rollback evidence و approval جداگانهٔ production |

## گیت‌های تغییر

- ادامهٔ greenfield UI mock در شاخهٔ فعال `arena/a1600dfc-hesabyar2` مجاز است. کاربر جداگانه فقط helper خالص WP‑1 را با قرارداد مشخص ورودی صریح ریال/تومان، عدد صحیح مثبت، حفظ remainder بدون گردکردن و رقم فارسی/لاتین مجاز کرده؛ helper به فروش، ledger یا persistence وصل نیست.
- اصلاح `voidInvoice`، ثبت/ابطال/refund واقعی، ledger، سیاست‌های دیگر پول/rounding، HMAC/licensing، schema migration، persistence/backend، entitlement، import از `KarenYar` یا production deployment همچنان به approval/spec جداگانه نیاز دارند.
- هر مرحله باید بر source دقیق، diff و آزمون واقعی استوار باشد؛ تست‌های داخلی source repo صرفاً شواهد کمکی‌اند، نه جایگزین اجرای جاری.
