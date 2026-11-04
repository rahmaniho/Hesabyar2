# پیشرفت Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05
**شاخهٔ فعال:** `arena/49664ebd-hesabyar2` بر پایهٔ merge commit PR #5، `a8e55e1e4cc8f17ba6f8b1a9b3452f7b12d28d06`.
**وضعیت کلی:** greenfield UI prototype با mock data در حال توسعه است؛ منطق مالی و persistence/backend مجاز یا پیاده‌سازی نشده‌اند.

| محدوده | وضعیت | شواهد |
|---|---|---|
| مخزن توسعهٔ محصول | `GREENFIELD PROTOTYPE` | PR #5 shell/UI را به `Hesabyar2/main` افزود؛ branch فعال فعلی `arena/49664ebd-hesabyar2` است |
| source رسمی Hesabyar 2.0 | `OWNER CONFIRMATION PENDING` | `KarenYar` source فعلی محتمل است، اما مالک آن را برای ادامهٔ Hesabyar 2.0 تأیید نکرده؛ source آن import/ویرایش نشده |
| UI prototype | `IN_PROGRESS / MOCK ONLY` | RTL dashboard و صفحه‌های فروش، گردش‌ها، مشتریان، کالا، گزارش و تنظیمات؛ جست‌وجو، اعلان و modal؛ افزودن مشتری فقط یک رکورد نمونه در حافظهٔ موقت همان صفحه می‌سازد و با refresh پاک می‌شود |
| داده و حریم خصوصی prototype | `NO PERSISTENCE / NO API` | هیچ localStorage/sessionStorage/IndexedDB/fetch یا backend در `src/` استفاده نمی‌شود؛ لطفاً اطلاعات واقعی مشتری وارد نکنید |
| تست prototype | `PASS` | ۶ تست UI: dashboard/mock notice، navigation، افزودن مشتری موقت بدون localStorage، sale preview، search و notifications |
| typecheck/build prototype | `PASS` | `npm run typecheck` و `npm run build` موفق؛ `dist/` در Git نادیده گرفته می‌شود |
| dependency audit prototype | `PASS` | `npm audit`: صفر vulnerability |
| ممیزی source قدیمی `KarenYar` | `COMPLETED_FOR_SNAPSHOT` | snapshot read-only `KarenYar/main@d41ca291...`؛ 369 unit tests، typecheck/lint/build و 35 release tests مربوط به همان snapshot است، نه این prototype |
| E2E مرورگر | `NOT RUN` | مرورگر واقعی/device در این مرحله تست نشده |
| production/staging و cPanel | `DEFERRED_BY_USER` | کاربر بررسی cPanel را فعلاً نخواست؛ هیچ server command/credential/environment استفاده نشد |
| Android/release/CI برای prototype | `NOT STARTED` | APK/AAB، Capacitor، signer، workflow یا release ساخته/تغییر داده نشده‌اند |
| DB، migration و deploy | `NOT STARTED` | هیچ DB، دادهٔ مشتری، licensing، migration، production یا deployment لمس نشده است |

## گام بعدی

ادامهٔ مجاز فعلی، توسعه و بازبینی تعامل‌های UI با mock data و حافظهٔ موقت است. پیش از ذخیرهٔ پایدار داده، منطق پول/گردکردن، ثبت یا ابطال تراکنش، inventory posting، API/auth، licensing، import از `KarenYar`، Android یا release، ابتدا به تأیید source/معماری و تصمیم‌های دامنه‌ای نیاز دارم؛ در آن نقطه موارد لازم را مرحله‌به‌مرحله از شما می‌پرسم.
