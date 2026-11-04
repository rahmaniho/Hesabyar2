# ممیزی عملکرد — سورس حساب‌یار 1.4.2

**مبنای ممیزی:** snapshot `rahmaniho/KarenYar/main` در commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.

## شواهد build

`npm run build` در این نشست موفق شد؛ Vite **3,181 module** را تبدیل کرد. build به‌صورت lazy split شده و صفحات route-level تنبل هستند. PDF vector هنگام درخواست جدا بارگذاری می‌شود. یک هشدار Rollup باقی ماند:

- `vendor-pdf-vector`: **1,007.39 kB raw / 507.89 kB gzip**، بالاتر از آستانهٔ 900 kB.

این اندازه بر اساس build local همین snapshot است؛ اندازهٔ دانلود واقعی، رفتار cache و اثر دستگاه کاربر اندازه‌گیری نشد.

## نقاط قوت معماری

- route-based `React.lazy` در `src/app/router.tsx`.
- Workbox/PWA cache برای assetهای static.
- PDF به‌صورت lazy-load، نه در bundle اولیهٔ همهٔ مسیرها.
- گزارش فهرست/فیلتر محلی و IndexedDB بدون درخواست شبکهٔ مالی.

## مواردی که اندازه‌گیری نشدند

- cold start و navigation در Android دستگاه واقعی.
- startup PWA، memory/CPU و large IndexedDB، dataset بزرگ کالا/فاکتور/مشتری.
- گزارش‌های حجیم، جست‌وجو، backup/restore بزرگ و concurrency.
- E2E browser/performance و Core Web Vitals در production.

## ریسک‌های عملکرد/صحت داده

- PDF chunk بزرگ است؛ further code-splitting/فونت‌گذاری باید با regression PDF همراه باشد.
- بعضی aggregationهای گزارش و ماندهٔ مشتری از JS number addition استفاده می‌کنند؛ برای حجم زیاد هم precision و هم CPU/memory اندازه‌گیری شود.
- offline-first بودن latency شبکه را حذف می‌کند، اما اندازهٔ IndexedDB و import/export را محدود نمی‌کند.

هیچ عدد load test یا latency production جعل نشده است؛ milestone performance باید dataset و معیارهای مالک محصول را داشته باشد.
