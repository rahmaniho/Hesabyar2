# چک‌لیست مهاجرت — Dexie محلی به Shared Core/Business

**وضعیت:** طرح/چک‌لیست آماده؛ migration اجرا نشده.
**Source baseline:** `KarenYar/main` commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`؛ Dexie schema v4 و backup JSON v3.

## واقعیت فعلی

- دادهٔ هر کاربر در IndexedDB همان browser/Android WebView است؛ DB مرکزی برای فروش/مالی وجود ندارد.
- migrationهای برنامه تا Dexie v4 و backup format v3 دیده شدند.
- دادهٔ production یا backup مشتری در دسترس نیست؛ تست‌های fake-indexeddb جای restore دستگاه واقعی را نمی‌گیرند.
- انتقال Business، migration سرور واحد نیست؛ احتمالا واردسازی per-device/per-company با رضایت کاربر، identity و reconciliation می‌خواهد.

## پیش‌نیازهای طراحی

- [ ] مالک تأیید کند `KarenYar` منبع رسمی برنامه است و نسخهٔ production چیست.
- [ ] schema/version هر release پشتیبانی‌شده، backupهای legacy و قابلیت‌های واقعی کاربران ثبت شوند.
- [ ] تعریف شود Personal local-only می‌ماند یا دادهٔ آن به cloud منتقل می‌شود.
- [ ] owner consent، data minimization، retention و حذف/بازیابی روشن شود.
- [ ] mapping سندهای فاکتور/پرداخت/stock movement به ledger با accountant/domain owner تصویب شود.
- [ ] روش شناسایی user/company و duplicate merge تعیین شود؛ client ID به‌تنهایی trust boundary نیست.

## rehearsal اجباری

- [ ] backup JSON قبل از تغییر گرفته شود؛ فایل cleartext با دسترسی محدود نگهداری شود.
- [ ] restore کامل backup روی copy واقعی Android/Web و نسخه‌های قدیمی/جدید آزمایش شود.
- [ ] migration/import روی fixture ناشناس از نسخه‌های قدیمی و v3 اجرا شود.
- [ ] record counts، products/stock، invoices/items، payment/refund balances، income transaction totals و opening ledger balances تطبیق داده شوند.
- [ ] invoiceهای voided و حذف income transaction در source به mapping reversal مشخص تبدیل شوند؛ هیچ داده‌ای حدس زده نشود.
- [ ] import idempotent، قابل resume و دارای duplicate detection باشد.
- [ ] خطای میانه، quota/فضای ذخیره‌سازی، browser close و rollback تمرین شود.
- [ ] اطمینان حاصل شود restore فقط با تأیید کاربر، بعد از backup تازه و هشدار clear/replace انجام می‌شود.

## Cutover/rollback gates

- [ ] Owner و accounting/security/DB/QA results را تأیید کنند.
- [ ] برنامهٔ برگشت و loss window مشخص شود؛ دادهٔ بعد از cutover با restore قدیمی بی‌صدا از دست نرود.
- [ ] هیچ legacy DB/backup پیش از reconciliation و retention approval پاک نشود.
- [ ] production execution نیازمند approval جداگانه است.

هیچ migration، database write یا production operation در این نشست انجام نشده است.
