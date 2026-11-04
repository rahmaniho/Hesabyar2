# ممیزی صفحهٔ محصول و SEO حساب‌یار

**مبنای source سایت:** `rahmaniho/karen-soft/main`، commit `24056725c5f27000160e7a631043d46672592618`.
**مبنای app:** `rahmaniho/KarenYar/main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**محدودیت:** hostهای زنده از این sandbox قابل دسترسی نبودند؛ این بررسی source-side است، نه ارزیابی SERP، analytics یا live UX.

## شناسایی و تفکیک مخزن‌ها

`rahmaniho/karen-soft` سورس وب‌سایت شرکت است (Next.js); برنامهٔ حساب‌یار در `rahmaniho/KarenYar` است. `docs/karensoft-2-audit-and-plan.md` در مخزن سایت مربوط به ممیزی وب‌سایت KarenSoft است و نباید به‌عنوان ممیزی برنامهٔ حسابداری تلقی شود. فایل `docs/hesabyar-release-update.md` همان مخزن سایت، `KarenYar` را منبع APK معرفی می‌کند.

## SEO و metadata در source سایت

- route محصول: `app/(site)/products/hesabyar/page.tsx`.
- metadata متمرکز در `lib/hesabyar.ts` و `lib/seo.ts`؛ عنوان/توضیح فارسی، تصویر و release date موجود است.
- structured data: `SoftwareApplication`, `WebPage`, `BreadcrumbList` و FAQ؛ `sameAs` به URL نسخهٔ وب حساب‌یار متصل است.
- فهرست قابلیت‌ها و پیشنهادهای قیمت از data module مشترک ساخته می‌شوند؛ این، از تکرار دستی متن metadata کم می‌کند.
- کد صفحهٔ محصول و schema در repo وجود دارد، اما canonical/live response، indexing، Search Console، CWV واقعی، link status و structured-data validation روی دامنه اجرا نشدند.

## ادعاهای محصول در برابر شواهد source برنامه

| ادعای صفحهٔ محصول | شواهد در app source | نتیجهٔ ممیزی |
|---|---|---|
| اندروید و نسخهٔ وب «یک برنامه» هستند | Capacitor Android همان app web را بسته‌بندی می‌کند؛ PWA موجود است | با معماری source سازگار؛ live اجرا نشد |
| آفلاین و ذخیرهٔ داده روی همان دستگاه | Dexie/IndexedDB local، PWA cache؛ FAQ می‌گوید sync خودکار چنددستگاهی نیست | ادعا با source محلی سازگار؛ دادهٔ local رمزنگاری نشده است |
| POS، کالا، فاکتور و گردش موجودی | featureهای متناظر در app وجود دارند | موجود اما محدود؛ purchase/ledger/warehouse چندگانه را نتیجه نمی‌دهد |
| «دفتر مالی کسب‌وکار» | income/expense transactions و گزارش‌های فروش وجود دارند | می‌تواند به دفتر ثبت درآمد/هزینه اشاره کند؛ نباید به‌عنوان General Ledger/double-entry معرفی شود |
| حقوق و دستمزد «طبق قانون کار» | payroll defaults سال ۱۴۰۵ و محاسبات قابل ویرایش در source | نیازمند تأیید نرخ/قانون با منبع رسمی/متخصص؛ این ممیزی اعتبار قانونی را تأیید نکرد |
| قفل PIN و backup JSON | LockScreen و JSON v3 وجود دارند | وجود feature تأیید شد؛ PIN رمزنگاری داده نیست و backup cleartext است |
| PDF فارسی | vector PDF و testهای فونت/shaping وجود دارند | وجود code و unit evidence تأیید شد؛ چاپ واقعی/مرورگر مشتری آزموده نشد |
| دو نسخه | صفحه «دو نسخه، یک حساب» را برای Android و Web به‌کار می‌برد | این دو runtime هستند؛ نه Personal و Business editionهای مسترپرامپ |

## ریسک انتشار Android

`lib/hesabyar.ts` در source سایت لینک دانلود Android 1.4.2 را به release tag `android-test-v1.4.2-41813070224-1` می‌دهد. GitHub Releases آن را **Pre-release / آزمایشی / NOT FOR STORES** فهرست می‌کند؛ `v1.2.5` آخرین stable release فهرست‌شده در زمان بررسی بود. بنابراین خودِ لینک قابل مشاهده در source به artifact آزمایشی اشاره دارد. این ممکن است تصمیم عمدی beta باشد، اما پیش از هر ادعای «انتشار عمومی/نسخهٔ نهایی» باید owner/release engineer سطح دسترسی و متن هشدار را تأیید کنند.

## نتیجه و گام بعدی

- SEO پیاده‌سازی‌شده در source شامل metadata/JSON-LD/FAQ/breadcrumb است؛ کیفیت live یا رتبهٔ جست‌وجو قابل تأیید نیست.
- صفحهٔ محصول باید با سطح واقعی app هماهنگ بماند: local-first single-device، دفتر درآمد/هزینهٔ ساده، نبود double-entry و عدم sync چنددستگاهی صریح باشد.
- GitHub Pages API در زمان بررسی `https_enforced=false` و `custom_domain=null` برگرداند، در حالی که source CNAME و workflow به دامنهٔ HTTPS اشاره می‌کنند؛ live host را نتوانستیم بررسی کنیم. این اختلاف باید پیش از هر ادعای live/SEO توسط owner حل شود.
- نسخهٔ Android 1.4.2 از منظر release label نیازمند تأیید owner است؛ لینک عمومی به pre-release NOT FOR STORES می‌رود. هیچ release یا متن سایت در این نشست تغییر نکرد.

جزئیات deploy/release در [`DEPLOYMENT_AND_RELEASE_AUDIT.md`](DEPLOYMENT_AND_RELEASE_AUDIT.md) آمده است.
