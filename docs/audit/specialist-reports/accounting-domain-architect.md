# گزارش نقش‌محور — Accounting Domain Architect

**مرجع:** persona دقیق Accounting Domain Architect در upstream نیست؛ از `finance/finance-bookkeeper-controller.md` تطبیق داده شد. این نقش یا اجرای آن جای متخصص حسابداری انسانی نیست.

## یافته‌ها از source

- مدل جاری `transactions` فقط `income/expense` دارد؛ account، journal entry/lines، period یا chart of accounts مشاهده نشد (`src/core/db/db.ts`).
- فروش فاکتور به‌صورت income transaction ساده ثبت می‌شود؛ این double-entry نیست.
- purchase/AP، supplier، bank/cash accounts، trial balance، balance sheet و period close در source نیست.
- `voidInvoice` ردیف income فروش را delete می‌کند و event ابطال می‌نویسد؛ این reversal مالی traceable نیست.
- payroll و tax rate code وجود دارند، ولی انطباق قانونی با مرجع رسمی در این ممیزی بررسی نشده است.

## نتیجه و gate

سورس فعلی برای فروشگاه محلی و گزارش‌های ساده است، نه Business double-entry. پیش از هر Business accounting، owner دامنه باید قواعد حساب‌ها، posting، rounding/tax، دوره، reversal و opening/migration mapping را تأیید کند. هیچ claim حسابداری رسمی یا compliance صادر نشده است.

جزئیات و criteria در [`ACCOUNTING_GAP_ANALYSIS.md`](../ACCOUNTING_GAP_ANALYSIS.md) و [`FINANCIAL_WORKFLOW_AUDIT.md`](../FINANCIAL_WORKFLOW_AUDIT.md) آمده‌اند.
