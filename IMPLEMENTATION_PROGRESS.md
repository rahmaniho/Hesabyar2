# پیشرفت Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05
**شاخهٔ فعال:** `arena/e38db981-hesabyar2` بر پایهٔ merge commit PR #8، `5d58f36bd2e3cee266a28c93f8abbb6aebcd354d`.
**وضعیت کلی:** greenfield UI prototype با mock data در حال توسعه است؛ منطق مالی و persistence/backend مجاز یا پیاده‌سازی نشده‌اند.

| محدوده | وضعیت | شواهد |
|---|---|---|
| مخزن توسعهٔ محصول | `GREENFIELD PROTOTYPE` | PRهای #5 تا #8، UI prototype را به `Hesabyar2/main` افزودند؛ branch فعال فعلی `arena/e38db981-hesabyar2` است |
| source رسمی Hesabyar 2.0 | `OWNER CONFIRMATION PENDING` | `KarenYar` source فعلی محتمل است، اما مالک آن را برای ادامهٔ Hesabyar 2.0 تأیید نکرده؛ source آن import/ویرایش نشده |
| UI prototype | `IN_PROGRESS / MOCK ONLY` | RTL dashboard و صفحه‌های نمونه؛ افزودن مشتری فقط در حافظهٔ صفحه تا refresh؛ جزئیات فقط‌خواندنی و فیلتر وضعیت مشتری؛ انتخاب بازه، سری‌های chart ساختگی را برای نمایش عوض می‌کند |
| داده و حریم خصوصی prototype | `NO PERSISTENCE / NO API` | کد اجرایی app از localStorage/sessionStorage/IndexedDB/fetch/backend استفاده نمی‌کند؛ تست فقط نبودن write به localStorage را assert می‌کند؛ لطفاً اطلاعات واقعی مشتری وارد نکنید |
| تست prototype | `PASS` | ۹ تست UI، شامل تغییر سری نمودار نمونه با بازه، فیلتر مشتری، جزئیات فقط‌خواندنی و افزودن مشتری موقت |
| typecheck/build prototype | `PASS` | `npm run typecheck` و `npm run build` موفق؛ `dist/` در Git نادیده گرفته می‌شود |
| dependency audit prototype | `PASS` | `npm audit`: صفر vulnerability |
| ممیزی source قدیمی `KarenYar` | `COMPLETED_FOR_SNAPSHOT` | snapshot read-only `KarenYar/main@d41ca291...`؛ 369 unit tests، typecheck/lint/build و 35 release tests مربوط به prototype فعلی نیستند |
| E2E مرورگر | `NOT RUN` | مرورگر واقعی/device در این مرحله تست نشده؛ صفحه و app module در Vite preview با HTTP 200 پاسخ دادند |
| production/staging و cPanel | `DEFERRED_BY_USER` | کاربر بررسی cPanel را فعلاً نخواست؛ هیچ server command/credential/environment استفاده نشد |
| Android/release/CI برای prototype | `NOT STARTED` | APK/AAB، Capacitor، signer، workflow یا release ساخته/تغییر داده نشده‌اند |
| DB، migration و deploy | `NOT STARTED` | هیچ DB، دادهٔ مشتری، licensing، migration، production یا deployment لمس نشده است |

## گام بعدی

ادامهٔ مجاز فعلی، توسعه و بازبینی تعامل‌های UI با mock data و حافظهٔ موقت است. پیش از ذخیرهٔ پایدار داده، منطق پول/گردکردن، ثبت یا ابطال تراکنش، inventory posting، API/auth، licensing، import از `KarenYar`، Android یا release، ابتدا به تأیید source/معماری و تصمیم‌های دامنه‌ای نیاز دارم؛ در آن نقطه موارد لازم را مرحله‌به‌مرحله از شما می‌پرسم.
