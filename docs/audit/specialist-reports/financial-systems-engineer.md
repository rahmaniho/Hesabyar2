# گزارش نقش‌محور — Financial Systems Engineer

**مرجع Agency Agents:** persona مستقیم ledger engine یافت نشد؛ `engineering/engineering-payments-billing-engineer.md` فقط برای idempotency/retry تطبیق داده شد. اجرای مستقل نیست.

## یافته‌های مثبت

- `src/core/currency/money.ts` از BigInt fixed-point، safe integer bounds و half-up rounding استفاده می‌کند.
- فاکتور در `invoice-calc.ts` pure calculation دارد؛ `createInvoice` در Dexie transaction فاکتور، stock و income را هم‌زمان ثبت می‌کند.
- `recordInvoicePayment` و refunds دارای payment key/request signature هستند؛ unit tests برای duplicate/retry، payment و PDF وجود دارند.

## یافته‌های مهم

- invoice calculations به ledger متصل نیستند؛ no balanced debit/credit invariant چون journal model وجود ندارد.
- `voidInvoice` فروش-income record را delete می‌کند؛ test فعلی `transactions.count()===0` را انتظار دارد.
- POS برای Rial از conversion قدیمی `Math.round(rial/10)` استفاده می‌کند؛ ردیف‌های ورودی غیرمضرب ۱۰ بی‌صدا گرد می‌شوند.
- بعضی aggregates گزارش/مانده مشتری از number addition استفاده می‌کنند؛ overflow/precision edge-case آزمون ندارد.

## Acceptance criteria قبل از توسعهٔ گسترده

Balanced journal, atomic posting, idempotency, append-only reversal, exact conversion در تمام UIهای پولی و aggregation overflow tests. هیچ تغییر مالی در این ممیزی اعمال نشد.
