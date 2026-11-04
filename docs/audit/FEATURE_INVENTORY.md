# موجودی قابلیت‌ها — سورس حساب‌یار 1.4.2

**مخزن منبع بررسی‌شده:** `rahmaniho/KarenYar`, `main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**تفکیک وضعیت:** «در سورس» با «در production تأییدشده» یکی نیست. دسترسی live نداشتیم.

| حوزه | وضعیت در سورس | وضعیت live | شواهد/حدود |
|---|---|---|---|
| PWA و Android | `IMPLEMENTED` | `NEEDS_VERIFICATION` | Vite/PWA/Capacitor؛ آزمون Android واقعی انجام نشد |
| فروش/POS/فاکتور | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | invoice create/draft/issue/copy/void، جست‌وجو و پرداخت؛ فروش ساده و local |
| محصولات/دسته‌بندی/بارکد | `IMPLEMENTED` در دامنهٔ محلی | `NEEDS_VERIFICATION` | `ProductsPage`, `ProductCategories`, `BarcodeScannerDialog` |
| موجودی | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | stock movements/restock/adjustment؛ یک موجودی محلی، بدون warehouse entity |
| مشتری/فروش نسیه | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | customer ledger و پرداخت/برگشت؛ supplier و accounts payable نداریم |
| Personal finance | `IMPLEMENTED` در سطح پایه | `NEEDS_VERIFICATION` | تراکنش، بودجه، بدهی/قسط؛ local-only |
| Payroll | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | payroll calculator/records/PDF؛ نرخ قانونی ۱۴۰۵ باید مستقل تأیید شود |
| گزارش فروش/سود/مطالبات | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | summaries و نمودارها؛ نه صورت‌های مالی استاندارد مبتنی بر دفترکل |
| General ledger / double-entry | `MISSING` در schema و source | `NEEDS_VERIFICATION` در live | chart of accounts/journal/period/close/trial balance وجود ندارد |
| خرید/تأمین‌کننده/برگشت خرید | `MISSING` در source | `NEEDS_VERIFICATION` در live | `restock` دستی جای خرید و بدهی تأمین‌کننده نیست |
| برگشت کالا به‌صورت line-level | `MISSING` به‌عنوان workflow مستقل | `NEEDS_VERIFICATION` | void کل فاکتور کل موجودی را برمی‌گرداند؛ return جزئی/مستقل وجود ندارد |
| خزانه‌داری/بانک/چک/مغایرت‌گیری | `MISSING` به‌عنوان حساب‌های رسمی | `NEEDS_VERIFICATION` | روش پرداخت ثبت می‌شود؛ اتصال/حساب بانک واقعی نیست |
| چندکاربره/شرکت/شعبه/نقش | `MISSING` در source | `NEEDS_VERIFICATION` در live | backend مالی، RBAC و tenant isolation وجود ندارد |
| offline مالی | `IMPLEMENTED` برای همان دستگاه | `NEEDS_VERIFICATION` | IndexedDB/PWA؛ بدون sync چنددستگاهی |
| License/entitlement | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | free/pro/proplus؛ server Ed25519 اختیاری، HMAC محلی نیز فعال/در کد موجود |
| PIN و حفاظت داده | `PARTIALLY_IMPLEMENTED` برای قفل UI | `NEEDS_VERIFICATION` | PIN، اما بدون رمزنگاری DB یا backup |
| Persian/Jalali/RTL | `IMPLEMENTED` در UI/core | `NEEDS_VERIFICATION` | Vazirmatn، Jalali controls و bidi؛ live/browserها تست نشدند |
| PDF | `IMPLEMENTED` در source و unit tests | `NEEDS_VERIFICATION` | PDF برداری و Persian shaping؛ E2E مرورگر فعلی اجرا نشد |
| چاپ مرورگر/فیزیکی | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | print document/CSS موجود؛ چاپگر و مرورگر واقعی تست نشدند |
| CSV | `IMPLEMENTED` | `NEEDS_VERIFICATION` | فاکتور/CSV و دفاع formula injection |
| Excel/XLSX | `MISSING` در source بازرسی‌شده | `NEEDS_VERIFICATION` | dependency/implementation XLSX پیدا نشد |
| Backup/restore | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | JSON v3، validation و import transactional؛ رمزنگاری/restore مشتری آزمون نشده |
| Automated unit/build/Android release tests | `IMPLEMENTED` در repo | `NEEDS_VERIFICATION` در CI جاری | 369 unit، typecheck/lint/build و 35 release test در این نشست موفق |
| Browser E2E | `NEEDS_VERIFICATION` | `NEEDS_VERIFICATION` | docs داخلی 30 تست قبلی را ثبت می‌کند؛ این نشست browser نداشت |

## Edition status

این سورس Personal/Business edition مستقل ندارد. تفاوت‌های `free`, `pro`, `proplus` با capabilityهای license، برابر مرزبندی دو محصول و policy نسخهٔ تجاری نیستند. ماتریس هدف در [`EDITION_CAPABILITY_MATRIX.md`](../../EDITION_CAPABILITY_MATRIX.md) است.
