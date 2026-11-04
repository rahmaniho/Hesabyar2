# معماری فعلی حساب‌یار — بر اساس سورس `KarenYar/main`

**مبنای تحلیل:** commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`، نسخهٔ 1.4.2.
**نکته:** مخزن متصل به شاخهٔ جاری Hesabyar2 هنوز فقط README دارد؛ این سند معماری مخزن برنامهٔ مرتبطی را توصیف می‌کند که سایت شرکت به‌عنوان منبع APK معرفی کرده است.

## نمای فنی

| لایه | پیاده‌سازی مشاهده‌شده | شواهد |
|---|---|---|
| Presentation | React 18، TypeScript، React Router 6، Tailwind؛ routeها lazy-load می‌شوند | `package.json`, `src/app/router.tsx`, `src/layouts/AppLayout.tsx` |
| Application/feature | Zustand، سرویس‌های دامنهٔ فروش/فاکتور/مشتری/موجودی؛ featureهای personal/payroll/calculator | `src/features/*`, `src/store/*` |
| Domain/core | Money/currency، محاسبهٔ فاکتور، Jalali، payroll، license و PDF | `src/core/*` |
| Persistence | Dexie 4 روی IndexedDB همان browser/WebView؛ schema v1-v4 | `src/core/db/db.ts` |
| Web delivery | Vite 5، PWA Workbox، سرویس‌ورکر و asset cache | `vite.config.ts`, `src/main.tsx` |
| Android | Capacitor 8، WebView با app ID `ir.karensoft.hesabyar` | `capacitor.config.ts`, `android/` |
| Server-side | endpointهای اختیاری لایسنس در PHP staging؛ **نه API مالی** | `deploy/cpanel-staging/`, `docs/cpanel-setup.md` |

## مدل دامنه/دادهٔ فعلی

`HesabyarDB` جدول‌های product, invoice, invoiceItem, income/expense transaction, customer, customerPayment, stockMovement, financialEvent, budget, debt, employee, payroll, settings, license و held sale دارد. پول داخلی تومان صحیح است؛ فاکتور و بعضی گزارش‌ها از fixed-point BigInt استفاده می‌کنند. مدل مرکزی account/journal/ledger، suppliers/purchases، warehouse/branch/company/user ندارد.

## مرز اعتماد و استقرار

- اطلاعات عملیاتی عمدتاً محلی روی دستگاه است؛ حالت آفلاین برای **دادهٔ مالی روی همان دستگاه** پیاده شده است.
- هیچ همگام‌سازی مالی یا تعارض چنددستگاهی در سورس مشاهده نشد؛ sync موجود برای لایسنس است.
- قفل PIN رابط کاربری است؛ IndexedDB/localStorage/backup به‌صورت رمزنگاری‌شده ذخیره نمی‌شوند.
- PHPهای `deploy/cpanel-staging` برای staging و licensing هستند. وجود آن‌ها اثبات نمی‌کند production به آن‌ها متصل است.
- سایت/اپ زنده، Vercel/هاست، headerها و config production بررسی نشدند.

## معماری هدف و فاصله با امروز

یک هستهٔ فرانت‌اند محلی وجود دارد، اما Shared Core چندنسخه‌ای یا سروری وجود ندارد. برای Business multi-user باید مرزهای جدید identity/tenant، ledger و API اضافه شوند؛ تبدیل مستقیم Dexie محلی به DB ابری یک migration سراسریِ قابل فرض نیست. نمودار هدف و ADRهای مقدماتی در `docs/architecture/` هستند و هنوز نیازمند تأیید مالک/محصول‌اند.
