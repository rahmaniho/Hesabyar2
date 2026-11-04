# ممیزی گردش مالی در سورس فعلی

**مبنای کد:** `rahmaniho/KarenYar/main`، commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**نتیجه:** بخشی از گردش‌های فروش local-first پیاده‌اند؛ ledger دوطرفه وجود ندارد. Live data و دستگاه واقعی بررسی نشد.

## گردش‌های موجود

| گردش | وضعیت کد | شواهد و حدود |
|---|---|---|
| POS/فاکتور → موجودی → درآمد ساده | `IMPLEMENTED` با حدود | `createInvoice` در تراکنش Dexie، stock movement، invoice item و یک `transactions` income ثبت می‌کند؛ نه journal debit/credit |
| پیش‌نویس → صدور | `IMPLEMENTED` | draft بدون اثر موجودی/درآمد؛ صدور با revision check و یک تراکنش |
| فروش نسیه → مانده مشتری → دریافت | `PARTIALLY_IMPLEMENTED` | invoice و customerPayments؛ دریافت بعدی درآمد جدید نمی‌شود |
| دریافت و برگشت وجه | `IMPLEMENTED` در مدل محلی | رکورد payment/refund و event؛ key/signature برای retry و حد پرداخت |
| ورود/اصلاح موجودی | `PARTIALLY_IMPLEMENTED` | `changeStock` تراکنشی و stock movement؛ به سند خرید/AP متصل نیست |
| ابطال فاکتور | `PARTIALLY_IMPLEMENTED`؛ یافته پرخطر در پایین | موجودی برمی‌گردد و event می‌نشیند؛ درآمد خام حذف می‌شود |
| خرید → موجودی → payable | `MISSING` | purchase invoice، supplier و AP در schema/source نیست |
| بانک/چک/مغایرت‌گیری | `MISSING` | payment method فقط یک field است؛ اتصال واقعی بانکی در docs هم صریحاً نفی شده |
| گزارش‌های دوطرفه و بستن دوره | `MISSING` | کدینگ، دفترکل، دوره و صورت مالی استاندارد وجود ندارد |

## قوت‌های قابل تأیید

- invoice calculations در `src/features/store/invoice-calc.ts` از `money.ts` و BigInt/مقیاس ثابت استفاده می‌کنند.
- `createInvoice` در `src/features/store/invoice.service.ts:204-360` و `recordInvoicePayment` در `src/features/store/invoice-payment.service.ts:71-126` در Dexie transactions اجرا می‌شوند.
- checkout key و unique index فروش و payment key، duplicate submission/retry را برای همان دیتابیس محلی کنترل می‌کنند.
- `deleteInvoicePayment` حذف فیزیکی را به سند refund/reversal تبدیل می‌کند؛ تست‌ها آن را پوشش می‌دهند.
- واحد داخلی تومان صحیح است و سرویس فاکتور ورودی‌ها را مستقلاً validate می‌کند.

## یافتهٔ مهم: حذف درآمد در void

`src/features/store/invoice.service.ts:605-609` در ابطال، ردیف فروش (`transactions` با `source='sale'`) را delete می‌کند. سپس invoice به `voided` می‌رود و event ابطال در خطوط 617-623 افزوده می‌شود. تست `invoice.service.test.ts:230-246` انتظار صفر transaction دارد. اصل فاکتور/اقلام می‌ماند، اما ثبت درآمد خام حذف می‌شود و سند معکوس حسابداری ایجاد نمی‌شود. این رفتار با قاعدهٔ حفظ history و اصلاح با reversal سازگار نیست. تغییر آن می‌تواند totals قدیمی و گزارش‌ها را تحت تأثیر بگذارد؛ نیازمند مهاجرت/تست و approval است.

## یافتهٔ ورودی مبلغ در POS

`PosPage.tsx` برای تخفیف مبلغی، قلم دستی و وجه نقد از `fromDisplayAmount` استفاده می‌کند؛ این تابع در `currency.ts:39-42` ریال را با `Math.round(rial/10)` به تومان می‌گرداند. ورودی فاکتورهای غیر-POS از conversion دقیق‌تری استفاده می‌کند. تست end-to-end این تفاوت در محیط حاضر اجرا نشد.

## دقت aggregateها

محاسبهٔ هر فاکتور در محدودهٔ safe integer کنترل می‌شود، اما بعضی جمع‌های روزانه/ماهانه/ماندهٔ مشتری و top-product از JavaScript number addition استفاده می‌کنند. با حجم/مبالغی که مجموع از `Number.MAX_SAFE_INTEGER` بگذرد، تضمین fixed-point دیگر برقرار نیست. این edge case هنوز در tests دیده نشد؛ پیشنهاد می‌شود aggregationها به `sumMoney`/BigInt منتقل و مرز overflow آزموده شود.

## نتیجهٔ حسابداری

این برنامه ثبت‌های عملیاتی و گزارش‌های ساده دارد، نه double-entry accounting. برای Business، ابتدا journal/ledger، mapping فروش/خرید/موجودی/پرداخت و رفتار reversal باید طراحی شود؛ UI و گزارش جدید روی `transactions` ساده، جایگزین دفترکل نیست.
