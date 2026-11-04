# ممیزی اسناد فارسی، چاپ و خروجی — سورس حساب‌یار 1.4.2

**مبنای کد:** `rahmaniho/KarenYar/main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`. Live browser/پرینتر بررسی نشد.

## قابلیت‌های موجود

- RTL، فونت‌های محلی Vazirmatn و ورودی/نمایش تاریخ Jalali در source وجود دارد.
- فاکتور در print document و PDF vector ساخته می‌شود؛ `pdf-lib` و fontkit برای shaping/embed فونت استفاده شده‌اند.
- `invoice-pdf.vector.test.ts` شامل ۶ تست واقعی فایل خروجی است: embed font، A4، متن Persian searchable/logical، چندصفحه‌ای و حروف راست‌پیوندی.
- payroll PDF نیز پیاده‌سازی و دو تست دارد.
- فهرست فاکتور خروجی CSV دارد؛ `core/utils/csv.ts` و تست‌ها formula injection را پوشش می‌دهند.

## حدود

- هیچ XLSX/Excel implementation یا dependency مربوطه در source بازرسی‌شده یافت نشد.
- Playwright E2E در این نشست اجرا نشد (browser executable موجود نبود)؛ گزارش داخلی منبع از آزمون E2E چندصفحه‌ای می‌گوید، اما در این اجرا مستقلاً تکرار نشد.
- چاپ فیزیکی، A4 در browserهای واقعی، چاپگر حرارتی، Android WebView واقعی، font fallback، مقایسهٔ preview/PDF و Excel/CSV در محیط مشتری آزمون نشده‌اند.
- تست واحد PDF صحت rendering در همهٔ PDF viewerها را تضمین نمی‌کند؛ فقط خروجی آزمون‌شده و استخراج متن/فونت را پوشش می‌دهد.

## ماتریس پذیرش برای milestone بعدی

| سناریو | معیار |
|---|---|
| فارسی/لاتین و حروف جدا/پیوسته | ترتیب bidi، shaping و copy/search متن صحیح |
| مبلغ بزرگ/اعشاری/تخفیف/مالیات | مقدار PDF با invoice/ledger یکسان؛ بدون محاسبه مستقل در template |
| چندصفحه‌ای | تکرار header، page number و عدم جدایی جمع‌ها |
| مرورگر و Android WebView | preview/PDF/print سازگار؛ font fallback ناموفق نباشد |
| CSV | encoding، header فارسی، جلوگیری از formula injection |
| Excel | تا زمان پیاده‌سازی و آزمون به‌عنوان قابلیت اعلام نشود |
| Thermal | فقط اگر محصول رسماً پشتیبانی کند؛ آزمون دستگاه واقعی لازم |

Build موفق بود، اما chunk `vendor-pdf-vector` بزرگ است؛ اندازه دقیق در `PERFORMANCE_AUDIT.md` ثبت شده است.
