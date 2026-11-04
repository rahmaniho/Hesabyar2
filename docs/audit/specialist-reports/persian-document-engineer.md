# گزارش نقش‌محور — Persian Document Engineer

**مرجع Agency Agents:** `engineering/engineering-i18n-engineer.md`, `engineering/engineering-pdf-engine-architect.md`; اجرا توسط یک ایجنت.

## یافته‌ها

- RTL، Jalali date controls و فونت‌های محلی در source وجود دارند.
- PDF فاکتور vector-based با embed فونت/ shaping فارسی و متن قابل جستجو تولید می‌شود؛ unit testها 6 سناریوی خروجی واقعی شامل چندصفحه‌ای را دارند و در اجرای این نشست موفق شدند.
- payroll PDF نیز وجود دارد.
- CSV برای فهرست فاکتور و helperهای CSV موجودند؛ XLSX/Excel در source بازرسی‌شده پیدا نشد.
- چاپگر واقعی، Android WebView واقعی، browser matrix و preview-vs-print در این نشست اجرا نشدند؛ E2E browser نداشت.

## ریسک/Acceptance

جمع PDF باید از همان invoice snapshot استفاده کند؛ template نباید totals را دوباره حساب کند. تست device/browser و فاکتور طولانی/اعشار/متن bidi قبل از claim چاپ کامل لازم است. فایل چاپگر حرارتی پشتیبانی‌شده مشخص نشده است.
