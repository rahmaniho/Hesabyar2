# تحلیل شکاف حسابداری — سورس فعلی در برابر هدف Business

**مبنای کد:** `rahmaniho/KarenYar/main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.

## وضعیت کنونی

سورس فعلی جریان‌های مالی روزمره را با invoice، income/expense transaction، ماندهٔ مشتری و stock movement ثبت می‌کند. این مدل برای کارکردهای فروشگاهی محلی است؛ دفترکل دوطرفه نیست. در schema `src/core/db/db.ts` جدول حساب، journal، journal line، دورهٔ مالی، سند حسابداری یا supplier/purchase وجود ندارد.

## شکاف‌ها نسبت به Business در مسترپرامپ

| نیاز Business | وضعیت source | دلیل |
|---|---|---|
| Chart of Accounts / گروه‌بندی | `MISSING` | هیچ entity/service حساب وجود ندارد |
| General ledger و journal voucher | `MISSING` | تراکنش فقط `income/expense` است؛ debit/credit نیست |
| سند خودکار و دستی | `MISSING` | income transaction فاکتور، journal voucher نیست |
| Trial balance / Balance sheet | `MISSING` | گزارش‌های فعلی از invoice/transaction summary‌اند |
| بستن دوره/قفل posting | `MISSING` | period boundary/close control وجود ندارد |
| خرید، supplier، AP و خرید برگشتی | `MISSING` | مدل/route جداگانه وجود ندارد |
| چند صندوق/بانک/چک/reconciliation | `MISSING` | روش پرداخت field فاکتور است؛ account/cashbook موجود نیست |
| ارزش‌گذاری چندانباره و انتقال | `MISSING` | فقط موجودی یکپارچه و movement محلی |
| چندشرکتی/شعبه/approval/role | `MISSING` | backend مالی و tenant auth وجود ندارد |
| traceable reversal | `PARTIALLY_IMPLEMENTED` | پرداخت correction به refund/reversal تبدیل می‌شود، ولی void فروش income transaction را delete می‌کند |
| tax policies محلی | `NEEDS_VERIFICATION` | نرخ فاکتور از تنظیم کاربر است؛ payroll rateهای پیش‌فرض در سورس، اما انطباق رسمی مستقل تأیید نشده |

## توصیهٔ معماری و ترتیب کار

1. Accounting owner قواعد سند، حساب‌ها، سیاست ارز/واحد/مالیات/گردکردن، دوره و reversal را تأیید کند.
2. قبل از Business UI، ledger domain و invariants را design/test کنید: balance، atomic posting، idempotency، immutable posted event و period checks.
3. sourceهای legacy (invoice, transaction, payment, inventory movement) به mapping صریح تبدیل شوند؛ totals قبل/بعد reconcile شوند.
4. اصلاح `voidInvoice` باید جداگانه و با سازگاری تاریخچه/گزارش بررسی شود.
5. shared domain service برای Personal و Business تعریف شود؛ Personal می‌تواند UI ساده‌تر داشته باشد، نه قواعد مالی متفاوت.

**نتیجه:** Business accounting در هدف محصول هنوز پیاده‌سازی نشده؛ این نتیجه از absence در source commit مبنا می‌آید، نه از آزمون live application.
