# مشخصات پیشنهادی Shared Financial Core

**وضعیت:** طرح دامنه‌ای؛ هنوز پیاده‌سازی یا approval نشده است.

## 1. هدف

یک مرجع واحد برای عملیات مالی Personal و Business، به‌گونه‌ای که UI، POS، PDF، report یا edition هیچ‌کدام قواعد مالی را دوباره تعریف نکنند. هستهٔ فعلی `money.ts` و `invoice-calc.ts` بخشی از مسیرند؛ ledger double-entry باید افزوده شود.

## 2. ماژول‌های هسته

| ماژول | مسئولیت | خارج از مسئولیت |
|---|---|---|
| Money & Units | ارز، واحد، precision، parse/format boundary، safe amount | قالب‌بندی صرفاً UI |
| Pricing & Tax Policy | line/discount/tax/rounding policy نسخه‌دار | انتخاب نرخ قانونی بدون تأیید |
| Journal & Ledger | accounts، entries/lines، debit/credit، posting/reversal، period | نمایش جدول UI |
| Financial Commands | command ID، idempotency، atomicity، retry | network retry به‌تنهایی |
| Operational Posting | template/mapping برای sale, purchase, payment, inventory | نوشتن مستقیم balance از feature UI |
| Audit & References | origin, actor, timestamp, reason, link to source | حذف رکورد posted |
| Reconciliation | تطبیق ledger با source documents/reports | جمع‌های disconnected |

## 3. Invariants برای قرارداد پذیرش

1. هر journal posted تراز باشد؛ entry نامتوازن reject شود.
2. هر مبلغ currency/unit و scale مشخص داشته باشد؛ currency mix بی‌قاعده reject شود.
3. محاسبهٔ پولی با representation دقیق و rounding policy صریح انجام شود.
4. retry/duplicate command فقط نتیجهٔ قبلی را برگرداند، posting دوم نسازد.
5. sale → invoice/stock/ledger در مرز transaction واحد یا الگوی جبرانی قابل‌آزمون اجرا شود.
6. correction posted با reversal/adjustment و reason انجام شود؛ اصل سند حذف/overwrite نشود.
7. دورهٔ بسته posting را reject کند مگر عملیات adjustment مصوب.
8. ledger و statements با گزارش‌های summary reconcile شوند.
9. import/backup دارای version، schema validation، integrity checks و recoverable flow باشد.
10. offline replay idempotent باشد و conflict مالی را بی‌صدا حل نکند.

## 4. API/قرارداد پیشنهادی (غیر اجرایی)

- `calculateInvoice(input, policyVersion) -> calculation snapshot`
- `issueInvoice(commandId, expectedRevision, invoiceSnapshot) -> invoiceId + postingRef`
- `recordPayment(commandId, invoiceId, amount, method, sourceRef) -> paymentId + postingRef`
- `reverseTransaction(commandId, sourceRef, reason, amount?) -> reversalRef`
- `postJournal(commandId, periodId, lines, sourceRef) -> journalId`

این امضاها مثال دامنه‌اند، نه endpointهای فعلی. نام/نوع نهایی باید با backend/runtime و مدل دسترسی تصویب‌شده منطبق شود.

## 5. دادهٔ legacy و سازگاری

- transactionهای فعلی `income/expense` و فاکتورها نباید به‌طور خودکار به ledger کامل تلقی شوند.
- mapping افتتاحیه باید براساس سوابق، پرداخت‌ها و دورهٔ cutover تأیید شود.
- `FinancialEvent` فعلی برای trace مفید است، اما journal line یا audit log سروری نیست.
- backward compatibility در Dexie و backup v1-v3 حفظ شود؛ migration تدریجی با fixtureهای واقعیِ ناشناس.
- رشتهٔ HMAC و licenses فعلی خارج از Shared Core مالی قرار گیرند؛ entitlement فقط اجازهٔ قابلیت را تعیین کند.

## 6. تست قرارداد

- unit tests برای money/tax/rounding/debit-credit.
- property tests: sum debits == sum credits؛ conversion roundtrip؛ idempotency.
- integration tests: sale/purchase/payment/refund/void + inventory + ledger.
- cross-runtime conformance tests اگر client/server دو implementation دارند.
- regression fixtures از backupهای سازگار، بدون دادهٔ شخصی.
