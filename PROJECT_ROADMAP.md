# نقشهٔ راه Hesabyar 2.0

**وضعیت:** بر پایهٔ ممیزی read-only `KarenYar` به‌روزرسانی شد. معماری پیشنهادی در `docs/architecture/` هنوز نیازمند approval مالک است.
**تاریخ:** 2026-11-05

| مرحله | هدف | وضعیت فعلی | گیت/معیار خروج |
|---|---|---|---|
| M0 — Environment/source audit | تأیید مخزن واقعی، framework، اجرای baseline و حدود live | `PARTIALLY_COMPLETED`؛ `KarenYar` شناسایی و کد/build بررسی شد؛ GitHub Pages/CI هم read-only دیده شد؛ API `https_enforced=false`/`custom_domain=null` و آخرین deployment URL با `http` دارد؛ کاربر cPanel server را گزارش کرده اما اتصال/بررسی را فعلاً deferred دانست؛ محیط/host/access scope همچنان نامعلوم | تأیید مخزن source، reconcile دامنه/TLS و evidence مجاز؛ cPanel را فقط اگر بعداً نیاز شد با staging/read-only scope بررسی کنید |
| M1 — Product/accounting gap | مقایسهٔ source با نیاز Personal/Business و invariants | `COMPLETED_FOR_SOURCE / NEEDS_OWNER_REVIEW`؛ ledger double-entry و multi-user در source نیست | domain owner تأیید قواعد و scope محصول |
| M2 — Shared Core architecture | boundaries، editions، migration، ADR | `PROPOSED`؛ اسناد `docs/architecture/` آماده‌اند، هنوز approval نشده | تأیید صریح مالک/معمار/حسابداری |
| M3 — Financial engine stabilization | exact money، immutable postings، reversals، ledger | `PLANNED`; پیش‌نیاز M2 | tests invariants و schema compatibility plan |
| M4 — Sales/procurement/inventory/treasury integration | فروش/خرید/موجودی/پرداخت به ledger | `PLANNED`; خرید و treasury رسمی در سورس نیست | M3 و domain mappings مصوب |
| M5 — Personal edition completion | حفظ تجربهٔ local-first و قابلیت‌های روزمره | `PLANNED`; پایه‌ای از قابلیت‌ها اکنون در یک app مشترک وجود دارد | entitlement/UX boundary و backup migration |
| M6 — Business accounting | ledger، خرید/AP، چندشرکتی/کاربری، statements | `PLANNED`; پیاده‌سازی Business در source وجود ندارد | M3/M4 و backend authorization |
| M7 — Licensing/entitlements | مهاجرت امن بدون از دست‌دادن lifetime license | `PLANNED`; HMAC سمت client یک ریسک جاری است | سازگاری مشتریان و سرور/کلیدها تأیید شود |
| M8 — Offline/synchronization | sync queue، idempotency و conflict strategy | `PLANNED`; فعلاً فقط offline single-device، نه مالی sync | معماری و آزمون conflict؛ بدون last-write-wins |
| M9 — Persian documents/export | RTL، تقویم، PDF/print/CSV، در صورت نیاز XLSX | `PARTIALLY_COMPLETED`; PDF/CSV code موجود، XLSX/چاپ واقعی نامعلوم | browser/device matrix و پذیرش مالک |
| M10 — UX modernization | تجربهٔ مستقل Personal/Business | `PLANNED`; interface فعلی یک app است | مطالعهٔ کاربر و حفظ قابلیت‌های سالم |
| M11 — Security/privacy hardening | local data, licensing, RBAC/tenant، HTTPS delivery، CI supply chain، Android FileProvider/Admin session/camera stream lifecycle | `PLANNED`; HMAC/data-at-rest و privilegeهای CI ریسک‌اند، Pages metadata با CNAME/HTTPS ناسازگار است و app/admin artifact/session زنده verify نشده | threat model، merged manifest/URI grant and host/session verification، CI permission/release gates، remediation plan و tests |
| M12 — QA/performance | unit/integration/E2E/security/performance regression | `IN_PROGRESS`; unit/typecheck/lint/build/release tests در ممیزی محلی اجرا شدند، اما workflowهای دیده‌شده suite کامل را gate نمی‌کنند؛ E2E/browser، native export/cache cleanup، camera permission/setup-error/one-shot callback lifecycle، merged-manifest و production QA باز است | PR CI/required checks، device/artifact review، مستقل review و تمام acceptance evidence |
| M13 — Controlled release | staging, rollback, production release | `NOT_STARTED`; latest stable GitHub release `v1.2.5`; 1.4.2 فعلاً test pre-release و tag build در signing-key validation متوقف شد؛ deployment واقعی بررسی نشده | signing/build verification، HTTPS/host check، rollback evidence و approval جداگانهٔ production |

## گیت‌های تغییر

- Source code تغییر نمی‌کند تا مالک مخزن `KarenYar` و روش کار منطبق با شاخهٔ فعال نشست را تأیید کند.
- اصلاح `voidInvoice`, HMAC/licensing، schema migration، تغییر entitlement و production deployment approval جدا می‌خواهند.
- هر مرحله باید بر source دقیق، diff و آزمون واقعی استوار باشد؛ تست‌های داخلی source repo صرفاً شواهد کمکی‌اند، نه جایگزین اجرای جاری.
