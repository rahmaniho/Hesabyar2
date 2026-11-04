# ممیزی دیتابیس و مهاجرت — سورس حساب‌یار 1.4.2

**مبنای کد:** `rahmaniho/KarenYar/main`، commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**نتیجه:** schema محلی قابل ممیزی است؛ live database یا دادهٔ مشتری در دسترس نبود.

## پایگاه دادهٔ واقعی فعلی

- Dexie 4/IndexedDB، DB نام‌گذاری‌شده `karenyar-hesabyar`؛ schemaهای version 1 تا 4 در `src/core/db/db.ts:260-328`.
- جداول اصلی: products، invoices، invoiceItems، transactions، budgets، debts، employees، payrolls، customers، customerPayments، settings، license، stockMovements، heldSales، financialEvents.
- نوع دادهٔ اصلی تراکنش مالی `income | expense` است؛ جدول حساب، journal header/lines یا ledger وجود ندارد.
- هیچ schema یا DB مرکزی برای چندکاربر/شرکت وجود ندارد؛ فایل PHP staging به لایسنس مربوط است.

## مهاجرت‌های مشاهده‌شده

- v2: مشتری و پرداخت مشتری.
- v3: وضعیت/checkout key فاکتور، unique sale transaction، stock movements و held sales؛ migration موجودی آغازین از product stock می‌سازد و درآمد قدیمی را حدس نمی‌زند.
- v4: `financialEvents` و indexهای payment؛ توضیح کد می‌گوید رکوردهای موجود بازنویسی نمی‌شوند.
- تست migration در اجرای فعلی موفق بود (از مجموعهٔ 369 تست).

## Backup و Restore

`src/core/db/backup.ts` خروجی JSON با format `karenyar-hesabyar-backup`, version 3 می‌سازد؛ جدول license در خروجی نیست. فایل پیش از import از نظر format/version، شناسه‌های یکتا و ارجاع فاکتور/قلم/پرداخت/رویداد validate می‌شود. import همهٔ جدول‌های برنامه را در تراکنش clear و با محتویات فایل جایگزین می‌کند؛ از نظر کاربردی عملیات restore مخرب و جایگزین‌کننده است، هرچند تراکنشی است. تست‌های backup در run فعلی موفق بودند.

## یافته‌ها/ریسک‌ها

1. IndexedDB و localStorage به‌صورت رمزنگاری‌شده ذخیره نمی‌شوند؛ backup JSON هم cleartext است. حفاظت به امنیت دستگاه/browser متکی است.
2. نسخهٔ پشتیبان برای بازگشت به کد قدیمی سازگار نیست؛ rollback به backup پیش از migration وابسته است. اگر پس از migration دادهٔ جدید ثبت شده باشد، restore قدیمی آن داده‌ها را از دست می‌دهد.
3. restore روی داده/دستگاه واقعی، نسخه‌های مختلف مرورگر/Android و file-size بزرگ در این اجرا تست نشد.
4. هیچ پایگاه دادهٔ مرکزی برای انتقال سنتی وجود ندارد. ساخت Business online مستلزم migration/import از هر device، هویت/tenant، deduplication و reconciliation است؛ schema نهایی هنوز طراحی نشده.
5. backup نه حسابرسی tamper-evident است و نه جایگزین audit log سروری.

## گیت مهاجرت

پیش از تغییر data model، مالک باید مخزن صحیح را تأیید کند؛ backup دستگاه واقعی با رضایت کاربر تهیه و restore آن روی copy ثابت شود؛ mapping و reconciliation تراکنش‌ها/موجودی تعریف شود؛ migration روی دادهٔ ناشناس و نسخهٔ قدیمی/جدید rehearsed شود؛ rollback و loss window مستند و تأیید شود. هیچ داده/DB در این ممیزی تغییر نکرده است.
