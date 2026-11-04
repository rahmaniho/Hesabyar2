# گزارش نقش‌محور — Security Architect

**مرجع:** `security/security-architect.md` به‌علاوهٔ Privacy/Identity personas؛ این گزارش توسط همان ایجنت نشست نوشته شده، نه reviewer مستقل.

## یافته‌ها

1. HMAC secret در `src/core/license/license-core.ts` از `VITE_LICENSE_SECRET` یا fallback داخل کد می‌آید؛ secret سمت client قابل حفاظت نیست. Offline KS1 مسیر default در صورت نبود API config است؛ production config را ندیدیم.
2. PIN با SHA-256 و salt ثابت؛ تلاش ناموفق rate-limited نیست. PIN فقط UI gate است و local IndexedDB/JSON backup رمزنگاری نشده‌اند.
3. Backend مالی، authenticated user, RBAC و tenant isolation در app source وجود ندارد؛ به همین دلیل app فعلی single-device است و برای Business multi-user آماده نیست.
4. `npm audit`: 3 advisory با `--omit=dev`; 30 کل در lockfile (از جمله 3 critical در test/dev tools). exploitability باید triage شود.
5. PHP staging licensing endpoints موجودند؛ live configuration، headers، secrets و production protection آزمون نشدند.

## توصیه

- لایسنس: private signing key فقط server; client public-key verification؛ مهاجرت lifetime/KS1 با compatibility window.
- داده: threat model جدا برای device theft/XSS; encryption-at-rest و backup encryption به‌صورت migration طرح شوند.
- Business: backend authorization/tenant tests پیش از شرکت/دادهٔ چندکاربره.
- npm fixes با برنامهٔ version/compatibility و regression tests؛ `npm audit fix --force` اجرا نشود.

مقدار secret در این سند عمداً افشا نشده است.
