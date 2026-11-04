# مرزهای ماژول پیشنهادی

**وضعیت:** logical boundaries برای هدف 2.0؛ تطبیق با source `KarenYar` انجام شده، اما ساختار فیزیکی تا approval ثابت نمی‌شود.

| ماژول | دادهٔ تحت مالکیت | ورودی/خروجی مجاز | مسئولیت/محدودیت |
|---|---|---|---|
| Identity & Tenant | user, organization/company, membership, role | actor context به application services | در source فعلی وجود ندارد؛ قبل از multi-user ضروری |
| Licensing & Entitlements | license, plan, capability, device activation | entitlement snapshot به client و backend | از user role و accounting جدا؛ private signing key server-only |
| Shared Money Core | Money, currency, scale, rounding/tax policy | pure functions/value objects | UI و document حق محاسبهٔ مستقل ندارند |
| Accounting Ledger | account, period, journal entry/line, posting, reversal | domain events/source refs | جدید؛ مالک اصلی reporting مالی |
| Sales & POS | invoice, items, draft/issue/void/refund intent | commands به inventory و ledger | نوشتن مستقیم balance/ledger ممنوع |
| Procurement | supplier, purchase invoice, payable, returns | commands به inventory و ledger | در source فعلی وجود ندارد |
| Inventory | product, unit, warehouse, movement, valuation | stock commands و valuation posting | source فعلی یک موجودی بدون warehouse entity دارد |
| Treasury | cash/bank/check/payment movements | payment commands و reconciliation | پرداخت method نباید معادل bank integration تلقی شود |
| Personal Finance | personal income/expense, budget, debt | Shared Money services | قابلیت فعلی local-first؛ Personal UX ساده |
| Payroll | employees, rules, payroll runs, payslips | calculation + approved posting adapter | قوانین ۱۴۰۵ نیازمند تایید؛ در source standalone calculation است |
| Reporting | query/read models | ledger + operational sources | صورت‌های مالی فقط از ledger معتبر مشتق شوند |
| Documents | print/PDF/CSV and templates | validated immutable snapshot | calculation ندارد؛ اعداد از source مالی |
| Offline/Sync | local outbox, sync cursor, conflict records | signed/authorized commands | current app financial sync ندارد؛ بعد از threat model اضافه شود |

## قواعد وابستگی

- UI → Application Services → Domain → Ports/Adapters.
- Sales/Procurement/Inventory/Treasury یکدیگر را با application command/event فراخوانی کنند، نه با دستکاری مستقیم جدول‌های همدیگر.
- هر write مالی actor/tenant context و idempotency key داشته باشد.
- Licensing entitlement و RBAC در نقطهٔ backend با هم ترکیب می‌شوند اما یکی نیستند.
- گزارش و PDF فقط read model/snapshot معتبر مصرف کنند.

## Mapping از source فعلی

- `src/core/currency/money.ts` و `src/features/store/invoice-calc.ts`: بخشی از Money/Pricing.
- `src/features/store/invoice.service.ts`: Sales + persistence orchestration؛ candidate برای جداسازی application/domain.
- `src/features/store/inventory.service.ts`: Inventory service محلی.
- `src/core/db/db.ts`: همهٔ local entities در یک Dexie؛ جایگزین ownership boundary نیست.
- `src/core/license/*`: License؛ مسیر offline HMAC نیازمند اصلاح security.
- `src/features/personal/*`, `payroll/*`: حوزه‌های موجود اما به Shared Ledger متصل نیستند.
