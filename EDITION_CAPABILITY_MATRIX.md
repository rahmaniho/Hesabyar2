# ماتریس Personal/Business — وضعیت فعلی در برابر هدف

**مبنای source:** `rahmaniho/KarenYar/main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
ماتریس هدف از مسترپرامپ گرفته شده است؛ ستون فعلی بر اساس سورس است و live verification نشده.

| حوزه | Personal هدف | Business هدف | source فعلی | live |
|---|---|---|---|---|
| Shared Money Core | سرویس/قواعد مشترک | همان قواعد و posting مشترک | محاسبهٔ دقیق invoice تا حدی موجود؛ ledger مشترک نیست | `NEEDS_VERIFICATION` |
| فروش/POS | workflow ساده و آفلاین | فروش چندکاربره با کنترل/approval | POS/invoice محلی موجود، برخی ریسک‌ها باز | `NEEDS_VERIFICATION` |
| مشتری | دفتر پایه/مانده | مشتری چندشرکتی و گزارش | مشتری/نسیه/پرداخت محلی موجود | `NEEDS_VERIFICATION` |
| خرید و تأمین‌کننده | scope ساده/اختیاری | خرید، AP، برگشت و پرداخت | در source موجود نیست | `NEEDS_VERIFICATION` |
| موجودی | تک‌موجودی ساده | چندانبار/انتقال/valuation | movement و restock دستی؛ warehouse entity نیست | `NEEDS_VERIFICATION` |
| حسابداری | summary/simple automation | double-entry، ledger، period close | income/expense ساده؛ journal/account وجود ندارد | `NEEDS_VERIFICATION` |
| خزانه‌داری | دریافت/پرداخت ساده | چند صندوق/بانک/چک/reconciliation | payment method field و customer payments، بدون bank accounts | `NEEDS_VERIFICATION` |
| گزارش | بودجه/فروش شخصی و خلاصه | trial balance، balance sheet، P&L از ledger | گزارش‌های عملیاتی/خلاصه | `NEEDS_VERIFICATION` |
| Payroll | پایه و ساده | چندکاربره/approval و ledger posting | محاسبه و ثبت payroll محلی؛ بدون ledger posting | `NEEDS_VERIFICATION` |
| Identity/roles | single owner یا shared device به‌صورت آگاهانه | multi-user/RBAC/tenant | PIN lock محلی؛ backend RBAC نیست | `NEEDS_VERIFICATION` |
| License | حفظ license و قابلیت‌های ساده | entitlement حرفه‌ای | free/pro/proplus؛ client HMAC و server path اختیاری | `NEEDS_VERIFICATION` |
| Offline/sync | local-first | queue امن با conflict resolution | local offline؛ financial sync ندارد | `NEEDS_VERIFICATION` |
| Documents | PDF/CSV فارسی | خروجی‌های حرفه‌ای/چندصفحه‌ای | vector PDF/CSV؛ XLSX نیست؛ hardware print unverified | `NEEDS_VERIFICATION` |

## مرزهای پیشنهادی

- Personal و Business نباید قواعد پولی یا posting جداگانه داشته باشند.
- edition entitlement با role/authorization یکی نیست؛ business capabilities در backend enforce شوند.
- حفظ داده و قابلیت export برای مشتری موجود، حتی در خطای license.
- source فعلی را با دو نام تجاری معرفی نکنیم تا edition matrix، pricing، support و migration مصوب شوند.
