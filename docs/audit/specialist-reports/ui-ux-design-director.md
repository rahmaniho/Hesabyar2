# گزارش نقش‌محور — UI/UX Design Director

**مرجع:** `design/design-ux-architect.md` و UI designer در Agency Agents؛ اجرای مستقل نیست.

## یافته‌ها از source

- app React responsive و RTL، فونت Vazirmatn و Jalali controls دارد؛ routeهای POS، inventory، invoices، customers، personal finance، payroll، settings و calculator موجودند.
- در source یک تجربهٔ واحد دیده شد؛ مرز UX مجزای Personal/Business یا feature matrix edition وجود ندارد.
- فرم فاکتور از ورودی unit-aware جدید استفاده می‌کند؛ برخی فیلدهای POS هنوز conversion قدیمی ریال/تومان دارند.
- live app و browser/deviceهای مشتری بررسی نشدند؛ هیچ claim درباره کیفیت بصری production مطرح نمی‌شود.

## توصیه

ابتدا workflowهای فعلی را baseline کنید و قابلیت‌های سالم را حفظ کنید. Personal/Business را در navigation, density, defaults و role-specific workflow تفکیک کنید، ولی معنا/محاسبهٔ مالی مشترک باشد. UX برای void/reversal، export warning و PIN/data loss باید با رفتار واقعی هماهنگ شود. بازطراحی گسترده هنوز شروع نشده است.
