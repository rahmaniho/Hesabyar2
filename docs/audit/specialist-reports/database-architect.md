# گزارش نقش‌محور — Database Architect

**مرجع Agency Agents:** `engineering/engineering-database-optimizer.md` و `engineering/engineering-database-reliability-engineer.md`; نقش‌ها در یک نشست توسط یک ایجنت اجرا شده‌اند.

## یافته‌ها

- برنامهٔ source از Dexie/IndexedDB و schema versionهای 1–4 استفاده می‌کند؛ DB local per browser/WebView است.
- جدول‌های عملیاتی شامل products/invoices/transactions/customers/payments/stock movements/events و داده‌های شخصی/payroll هستند؛ accounts/journals/companies/users/warehouses نیستند.
- backup JSON v3؛ قبل از import relation validation و import در transaction؛ import کل DB محلی را جایگزین می‌کند.
- migration source افزایشی است، ولی rollback به code قدیمی backup پیش از migration می‌خواهد؛ restore واقعی دستگاه آزمون نشده.
- هیچ دیتابیس مرکزی یا دادهٔ مشتری در این نشست دسترسی‌پذیر نبود.

## توصیه

Business multiuser نیازمند DB/service جدید است؛ آن را migration عادی Dexie فرض نکنید. هر import per-device باید idempotent، قابل resume، transactional و با reconciliation ledger/stock/invoice انجام شود. هیچ DB provider انتخاب یا migration production انجام نشده.
