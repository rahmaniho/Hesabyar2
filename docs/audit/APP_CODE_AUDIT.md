# ممیزی کد برنامهٔ حساب‌یار — `rahmaniho/KarenYar`

**وضعیت:** ممیزی خواندنی کد انجام شد؛ production و دستگاه واقعی بررسی نشدند.
**مبنای ممیزی:** شاخهٔ `main`، commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`، تاریخ commit `2026-11-04T11:26:59Z`.
**نسخهٔ اعلام‌شده:** `1.4.2`؛ `applicationId=ir.karensoft.hesabyar`.
**دامنهٔ اجرای آزمون:** snapshot دقیق commit در مسیر موقت `/tmp`؛ هیچ فایل یا شاخه‌ای در مخزن برنامه تغییر نکرد.

## 1. شناسایی مخزن منبع

مخزن متصل‌شده به نشست، `rahmaniho/Hesabyar2`، همچنان فقط `README.md` دارد. در ادامهٔ درخواست «ادامه بده»، مخزن عمومی شرکت `rahmaniho/karen-soft` به‌صورت read-only بررسی شد. مستند `docs/hesabyar-release-update.md` در آن، مخزن `rahmaniho/KarenYar` را منبع برنامه معرفی می‌کند؛ `package.json` آن نیز نام `karenyar-hesabyar`، نسخهٔ 1.4.2 را دارد و `capacitor.config.ts` شناسهٔ `ir.karensoft.hesabyar` را ثبت کرده است. بنابراین `KarenYar` منبع کدِ بسیار محتمل و مستندشدهٔ برنامه است؛ تأیید مالک برای استفاده از آن به‌عنوان مخزن توسعهٔ Hesabyar 2.0 همچنان لازم است.

## 2. معماری مشاهده‌شده

- رابط وب/PWA: React 18، TypeScript، Vite 5، React Router 6، Zustand و Tailwind.
- برنامهٔ Android: Capacitor 8؛ همان برنامهٔ وب داخل WebView اجرا می‌شود.
- دادهٔ مالی: Dexie 4 روی IndexedDB محلی؛ مدل فعلی آفلاین‌فرست و تک‌دستگاهی است.
- PWA: Workbox، precache و cache-first برای assetها؛ این معماری به‌معنی همگام‌سازی دادهٔ مالی نیست.
- هسته‌ها: `src/core/db`، `currency`، `calc`، `jalali`، `pdf`، `license`؛ قابلیت‌های `src/features/store`، `personal`، `payroll` و `calculator`.
- مسیر لایسنس سروری و PHPهای staging وجود دارند، اما **API مالی/دفترکل مرکزی وجود ندارد**. endpointهای لایسنس را نباید به‌عنوان backend تراکنش یا multi-tenant تلقی کرد.

## 3. قابلیت‌های موجود در سورس

| حوزه | شواهد و وضعیت در سورس | حد/ملاحظه |
|---|---|---|
| صندوق، فروش و فاکتور | `PARTIALLY_IMPLEMENTED`؛ POS، فاکتور، پیش‌نویس/صدور/کپی/ابطال، تخفیف/مالیات و روش‌های پرداخت در کد هستند | فروش ساده، نه accounting double-entry یا workflowهای کامل تجاری |
| کالا و موجودی | `PARTIALLY_IMPLEMENTED`؛ کالا، دسته‌بندی، بارکد، موجودی، stock movement، restock و adjustment | یک موجودی محلی؛ انبارهای متعدد، خرید و valuation رسمی وجود ندارد |
| مشتری و دریافت | `PARTIALLY_IMPLEMENTED`؛ فروش نسیه، مانده مشتری، دریافت، برگشت وجه و رویدادها | تأمین‌کننده، حساب دریافتنی چندشرکتی و اتصال بانکی وجود ندارد |
| مالی شخصی | `IMPLEMENTED` به‌صورت قابلیت‌های محدود محلی؛ تراکنش، بودجه، بدهی/قسط و محاسبه | هم‌ارز یک سیستم مالی چندکاربره/ابری نیست |
| حقوق و دستمزد | `PARTIALLY_IMPLEMENTED`؛ محاسبه، ثبت دوره‌ای و PDF وجود دارد | نرخ‌های پیش‌فرض ۱۴۰۵ قابل ویرایش‌اند؛ انطباق قانونی باید با مرجع رسمی/متخصص تأیید شود |
| گزارش | `PARTIALLY_IMPLEMENTED`؛ خلاصهٔ فروش، سود، مطالبات و موجودی | Trial Balance، Balance Sheet، دفترکل و P&L مبتنی بر journal وجود ندارد |
| Personal/Business edition | `MISSING` به‌عنوان مرز محصولی مستقل | tierهای مجوز `free/pro/proplus` هستند، نه دو edition مصوب Personal و Business |
| حسابداری دوطرفه | `MISSING` در schema/سرویس‌های بازرسی‌شده | حساب، سند دوطرفه، journal line، دوره و بستن حساب وجود ندارد |
| خرید/تأمین‌کننده/برگشت خرید | `MISSING` | `restock` یک گردش ورود دستی است، نه فاکتور خرید و حساب پرداختنی |
| شعبه/شرکت/نقش کاربر | `MISSING` | لاگین، RBAC و tenant isolation سمت سرور وجود ندارد |
| همگام‌سازی مالی | `MISSING` | عملیات مالی در IndexedDB همان دستگاه می‌مانند؛ hook آنلاین موجود برای لایسنس است |
| فارسی/تقویم/چاپ | `PARTIALLY_IMPLEMENTED` | RTL، Jalali و PDF برداری وجود دارند؛ چاپ فیزیکی/browserهای واقعی آزمون نشدند |
| خروجی | `PARTIALLY_IMPLEMENTED` | PDF و CSV وجود دارند؛ Excel/XLSX در سورس بازرسی‌شده یافت نشد |
| backup/restore | `PARTIALLY_IMPLEMENTED` | JSON v3، اعتبارسنجی ارجاع‌ها و import تراکنشی وجود دارد؛ فایل رمزنگاری نشده و restore واقعی روی دستگاه/کاربر آزمون نشد |

«موجود در سورس» به معنی فعال‌بودن یا تأیید در production نیست؛ deployment configuration و محیط زنده در دسترس نبودند.

## 4. هستهٔ مالی و گردش‌ها

### نقاط قوت اثبات‌شده

- `src/core/currency/money.ts` از BigInt و مقیاس ثابت ۶ رقم برای تعداد/درصد، گردکردن نیم‌به‌بالا و کنترل `Number.MAX_SAFE_INTEGER` استفاده می‌کند.
- `src/features/store/invoice-calc.ts` محاسبهٔ مستقل از UI برای مبلغ ردیف، تخفیف، مالیات و جمع فاکتور دارد.
- `createInvoice` در `src/features/store/invoice.service.ts` فروش را در یک تراکنش Dexie با فاکتور، اقلام، موجودی، حرکت انبار، income transaction و event ثبت می‌کند؛ checkout key و امضا، درخواست تکراری را کنترل می‌کنند.
- دریافت نسیه، برگشت وجه و اصلاح پرداخت در `invoice-payment.service.ts` شناسه و امضای درخواست دارند؛ تست‌ها idempotency و حفظ رکورد پرداخت را پوشش می‌دهند.
- آزمون‌های PDF برداری، shaping و استخراج متن فارسی، embed شدن فونت و فاکتور چندصفحه‌ای را بررسی می‌کنند.

### یافتهٔ پرخطر

`voidInvoice` در `src/features/store/invoice.service.ts:605-609` ردیف `transactions` با `source === 'sale'` را **فیزیکی حذف** می‌کند. سپس وضعیت فاکتور و یک `financialEvent` با action `voided` را ثبت می‌کند. تست `src/features/store/invoice.service.test.ts:230-246` انتظار دارد بعد از ابطال تعداد transactionها صفر باشد. بنابراین اثر درآمدی به‌صورت سند معکوس قابل گزارش باقی نمی‌ماند؛ این رفتار با الزام حفظ تاریخچهٔ posted و reversal traceable ناسازگار است. برای فروش نقدی نیز receipt/refund مستقل در همان مدل وجود ندارد. اصلاح این رفتار نیازمند تحلیل سازگاری گزارش‌ها و دادهٔ قدیمی است؛ در این ممیزی تغییری انجام نشده است.

### شکاف precision در مرزها

فرم فاکتور از `fromDisplayAmountExact` استفاده می‌کند، اما POS هنوز در `src/features/store/PosPage.tsx` برای تخفیف مبلغی، قلم دستی و وجه نقد از `fromDisplayAmount` استفاده می‌کند؛ تابع `src/core/currency/currency.ts:39-42` مبلغ ریالی را با `Math.round(displayValue / 10)` به تومان تبدیل می‌کند. بنابراین ورودی ریالی که مضرب ۱۰ نیست می‌تواند بی‌صدا گرد شود. سرویس نهایی عدد تومان را validate می‌کند، اما مقدار اولیهٔ ریال را دیگر نمی‌بیند.

همچنین چند aggregate در گزارش/مانده مشتری از جمع مستقیم JavaScript `number` استفاده می‌کنند (`store-calc.ts` daily/monthly/today و `customers-calc.ts`). جمع فاکتورهای بسیار بزرگ/پرتعداد ممکن است از safe-integer عبور کند؛ این سناریو در مجموعهٔ تست حاضر اثبات/آزمون نشده است. این یک ریسک مرزی و نیازمند تست است، نه ادعای وقوع در دادهٔ فعلی.

## 5. پایگاه داده و مهاجرت

`HesabyarDB` در `src/core/db/db.ts` نسخه‌های Dexie 1 تا 4 دارد. جدول‌ها شامل `products`, `invoices`, `invoiceItems`, `transactions`, `customers`, `customerPayments`, `stockMovements`, `financialEvents`, `budgets`, `debts`, `employees`, `payrolls`, `settings`, `license` و `heldSales` هستند. جداول `accounts`, `journalEntries`, suppliers, purchases, warehouses, companies, users یا branches وجود ندارند.

ارتقای DB محلی v3→v4 جدول event و index پرداخت را افزایشی می‌سازد. `backup.ts` پشتیبان JSON نسخهٔ 3 می‌گیرد و پیش از جایگزینی، شناسه‌ها و روابط اصلی را بررسی می‌کند؛ import همهٔ دادهٔ موجود را در یک تراکنش با محتوای فایل جایگزین می‌کند. تست‌های backup/migration در اجرای فعلی سبز بودند. downgrade خودکار وجود ندارد؛ rollback نسخهٔ قدیمی به backup قبل از migration وابسته است. این معماری **مهاجرت پایگاه‌دادهٔ مرکزی نیست**: برای Business چندکاربره، انتقال باید device-by-device و با mapping/reconciliation طراحی شود.

## 6. امنیت و حریم خصوصی

1. **ریسک بحرانی یکپارچگی مجوز:** `src/core/license/license-core.ts:108-112` کلید HMAC را از `VITE_LICENSE_SECRET` می‌خواند و در غیر این صورت از مقدار fallback موجود در کد استفاده می‌کند؛ اسکریپت صدور کلید هم fallback مشابه دارد. هر `VITE_*` در build وب عمومی است و مقدار fallback نیز در مخزن عمومی است. اگر مسیر آفلاین KS1 فعال باشد، ساخت/دستکاری مجوز قابل اتکا نیست. مسیر سروری Ed25519 وجود دارد اما با `VITE_LICENSE_API_BASE` اختیاری فعال می‌شود؛ config واقعی production بررسی نشد.
2. **حفاظت دادهٔ محلی ناکافی برای تهدید سرقت/دسترسی مستقیم:** PIN چهار تا دوازده رقم است و با SHA-256 و salt ثابت ذخیره می‌شود (`pin.ts`); در LockScreen قفل‌گذاری تلاش ناموفق enforce نمی‌شود. IndexedDB/localStorage و فایل backup JSON در کد بازرسی‌شده رمزنگاری نشده‌اند. PIN قفل رابط است، نه رمزنگاری داده.
3. **مرز امنیتی تک‌دستگاهی:** backend مالی، حساب کاربری، RBAC و tenant isolation وجود ندارد. برای استفادهٔ چندکاربره/شرکتی، کنترل client-side یا license کافی نیست.
4. **Dependency audit:** روی lockfile همین commit، `npm audit --omit=dev`، ۳ advisory (۲ moderate و ۱ high) گزارش کرد؛ مورد high در Zod و moderateها در React Router هستند. `npm audit` کامل ۳۰ مورد (۳ low، ۲۲ moderate، ۲ high، ۳ critical) گزارش کرد؛ از جمله موارد بحرانی در test toolchain `tinypool` و موارد dev در Vite/esbuild. exploitability هر advisory در این برنامه نیازمند triage است؛ هیچ fix اعمال نشد.
5. مسیر PHP لایسنس و admin زیر `deploy/cpanel-staging` و مستندات برای staging هستند؛ سرور زنده، headerها، secrets و دسترسی production بررسی نشدند.
6. GitHub Pages API در زمان بررسی `https_enforced=false`, `custom_domain=null` و `html_url` با scheme `http` گزارش داد، ولی source دارای CNAME برای همان دامنه و workflow docs مدعی HTTPS است. چون live host قابل دسترسی نبود، این یک اختلاف deployment نیازمند verification است، نه اثبات serve شدن live با HTTP. tag Android `v1.4.2` نیز در گام signing-key validation متوقف شد؛ جزئیات در [ممیزی deployment/release](DEPLOYMENT_AND_RELEASE_AUDIT.md).
7. CI workflow review نشان داد Android/Admin jobها `contents:write` دارند و workflowهای مشاهده‌شده test/typecheck/lint کامل را gate نمی‌کنند؛ tag/manual signed release و Pages permissions نیازمند hardening/تأیید policy است. گزارش مستقل: [ممیزی CI و زنجیرهٔ تأمین](CI_SUPPLY_CHAIN_AUDIT.md).

## 7. آزمون‌های اجراشده در این ممیزی

تمام فرمان‌ها روی snapshot دقیق `d41ca291...` و در پوشهٔ موقت اجرا شدند؛ `npm ci --ignore-scripts` به‌کار رفت تا lifecycle scriptهای dependency اجرا نشوند.

| فرمان | نتیجهٔ واقعی این اجرا |
|---|---|
| `npm test` | موفق: 47 فایل، 369 تست |
| `npm run typecheck` | موفق |
| `npm run lint` | موفق، بدون warning ESLint |
| `npm run build` | موفق؛ 3,181 ماژول تبدیل شد؛ هشدار chunk بزرگ PDF: 1,007.39 kB خام / 507.89 kB gzip |
| `npm run test:android-release` | موفق: 35 تست Node |
| `npm run release:check` | موفق: نسخه 1.4.2، versionCode 10402، app ID `ir.karensoft.hesabyar` |
| `npm audit --omit=dev` | با advisoryهای production dependency پایان غیرصفر داد |
| `npm audit` | با 30 advisory پایان غیرصفر داد |
| Playwright E2E | اجرا نشد: Chromium/Chrome نصب یا در cache موجود نبود؛ نصب browser به host خارج از allowlist نیاز دارد |

فایل `docs/invoices/delivery-report.md` در مخزن منبع ادعا می‌کند 30 تست E2E در اجرای قبلی موفق بوده‌اند؛ این نتیجه در نشست فعلی مستقل تکرار نشد. Android device، چاپگر، Safari/Firefox، live site، production DB و restore واقعی نیز آزموده نشدند.

## 8. جمع‌بندی برای معماری 2.0

حساب‌یار فعلی یک برنامهٔ local-first آفلاین‌فرست با ماژول مالی روزمره و فروشگاهی است؛ هستهٔ محاسبات فاکتور و تعدادی invariant به‌خوبی جدا/آزموده شده‌اند، اما دفترکل دوطرفه و backend چندشرکتی ندارد. دو edition Personal و Business نیز به‌عنوان مرز محصول/داده در سورس موجود نیستند. بنابراین:

- وضعیت فعلی نباید به‌عنوان Business accounting یا multi-tenant accounting تبلیغ شود.
- Shared Core 2.0 باید ابتدا از هستهٔ پول/فاکتور فعلی و شکاف ledger استخراج شود؛ نه با دو موتور جدا و نه با بازنویسی یک‌باره.
- تبدیل به Business چندکاربره، مهاجرت از IndexedDB هر دستگاه به سرور و سیاست offline/sync یک تصمیم معماری بزرگ است و به برنامهٔ مهاجرت و approval جدا نیاز دارد.
- هیچ source code، دیتابیس یا محیط production در این ممیزی تغییر نکرده است.
