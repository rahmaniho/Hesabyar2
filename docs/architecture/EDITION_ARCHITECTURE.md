# معماری editionهای Personal و Business

**وضعیت:** پیشنهاد محصول/معماری برای approval؛ نسخه‌های مستقل در سورس فعلی وجود ندارند.

## 1. وضعیت امروز

برنامهٔ واحد `KarenYar` ویژگی‌های فروشگاه، Personal finance، payroll و calculator را در یک client و DB محلی دارد. license tiers موجود `free`, `pro`, `proplus` هستند و بعضی capabilityها را در client gate می‌کنند. این مدل، Personal/Business edition architecture یا authorization چندشرکتی نیست.

## 2. هدف

**یک domain/financial core؛ دو UX و مجموعهٔ capability.** Personal و Business نباید در money math، invoice posting، tax/rounding یا reversal implementation جدا شوند.

| قابلیت | Personal هدف | Business هدف | نیاز/ملاحظه |
|---|---|---|---|
| هستهٔ مبلغ/مالیات | مشترک | مشترک | policy versioned و آزموده‌شده |
| شخصی: بودجه/بدهی/درآمدهزینه | فعال در UX ساده | اختیاری/قابل پنهان‌سازی | source فعلی آن را دارد |
| POS/فروش | فروش ساده در صورت scope | فروش عملیاتی چندکاربره | source فعلی local POS دارد |
| خرید/تأمین‌کننده | حداقلی/غیرفعال بر اساس تصمیم | لازم | در source فعلی نیست |
| انبار | یک موجودی ساده | چندانبار/valuation/transfer | schema فعلی warehouse ندارد |
| دفترکل | خلاصه یا خودکار ساده، اما با ledger مشترک | double-entry و گردش حرفه‌ای | هیچ ledger فعلی وجود ندارد |
| شرکت/کاربر/role | single owner یا shared device به‌صورت آگاهانه | multi-company/roles/approval | backend لازم |
| آفلاین | قابلیت اصلی حفظ شود | offline command queue محدود و idempotent | هیچ last-write-wins روی posted ledger |
| License | entitlement و compatibility | entitlement + server enforcement | حفظ lifetime/current licenseها |
| گزارش | خلاصه‌های سادهٔ مشترک | statements از ledger | reports فعلی full financial statements نیستند |

## 3. پیاده‌سازی پیشنهادی مرحله‌ای

1. **Compatibility layer:** featureهای فعلی و licenseها را inventory کنید؛ هیچ plan فعلی به edition جدید خودکار map نشود.
2. **Shared domain:** money/calculation contracts را از UI/persistence جدا و tests را پایدار کنید.
3. **Ledger core:** journal posting/reversal و migration design با approval حسابداری.
4. **Business backend:** modular monolith/API با tenant/RBAC و transaction DB؛ technology choice جداگانه.
5. **Personal continuity:** نسخهٔ local-first را تا زمان آماده‌شدن import/sync حفظ کنید؛ data export همیشه در دسترس بماند.
6. **Edition entitlements:** capability matrix در client برای UX و server برای authorization؛ license error داده را قفل/پاک نکند.

## 4. تصمیم‌های باز

- آیا Business محصول subscription است یا license دائمی/شرکتی؟
- آیا Personal عمداً تک‌دستگاهی می‌ماند یا sync چنددستگاهی دارد؟
- هم‌زیستی مشتریان اندروید و وب چگونه مدیریت می‌شود؟
- licenseهای lifetime و KS1 چه مدت/چطور معتبر می‌مانند؟
- چه قابلیت‌هایی باید در Personal/Business و چه سطحی از حسابداری در هرکدام باشد؟

هیچ gate تجاری یا pricing از این سند نهایی نمی‌شود.
