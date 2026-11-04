# گزارش اجرایی ممیزی Hesabyar 2.0 — به‌روزرسانی پس از «ادامه بده»

**تاریخ:** 2026-11-05
**شاخهٔ کاری فعلی:** `arena/cd2e7fc5-hesabyar2` (`active`)
**مخزن متصل به نشست:** `rahmaniho/Hesabyar2`؛ شاخهٔ فعلی از merge commit PR #9، `efb08c1367179fd3025fe3abc85fd6263d703939`, شروع می‌شود. PRهای #1 تا #9 به `main` ادغام شده‌اند؛ PRهای #5 تا #9 greenfield UI prototype و تعامل‌های mock مشتری/داشبورد را افزودند. `main` اکنون shell/UI mock دارد، اما منطق کامل محصول را ندارد؛ `KarenYar` همچنان source candidate جداگانه و تأییدنشده است.
**مخزن برنامهٔ بازرسی‌شده:** `rahmaniho/KarenYar`، `main` در commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`، نسخهٔ برنامه 1.4.2.

## نکتهٔ اصلاحی دربارهٔ گزارش قبلی

در آغاز ممیزی، مخزن متصل‌شدهٔ `Hesabyar2` فقط README داشت و منبع برنامه پیدا نشده بود. بعداً مخزن شرکت `rahmaniho/karen-soft` و مستند `docs/hesabyar-release-update.md` بررسی شد؛ این سند `rahmaniho/KarenYar` را منبع برنامه معرفی می‌کند و package/app ID آن نیز همخوان است. ممیزی کد روی snapshot خواندنی `KarenYar/main` انجام شد. پس از آن، PR #1 فقط مستندات audit/architecture را به `Hesabyar2` ادغام کرد؛ app source به این مخزن منتقل نشده است.

## خلاصهٔ مدیریتی

سورس موجود، برنامه‌ای فارسی، RTL، PWA/Android و local-first است. معماری آن React/Vite/TypeScript + Capacitor و Dexie/IndexedDB محلی است؛ فروش، فاکتور، کالا و موجودی، مشتری/دریافت، بودجه و بدهی شخصی، حقوق و دستمزد، محاسبه‌گر، PDF و CSV در کد وجود دارند. نسخهٔ فعلی را نمی‌توان «Business double-entry accounting» یا multi-tenant معرفی کرد: chart of accounts، journal entries، دفترکل، دوره‌بندی، خرید/تأمین‌کننده، شعبه/شرکت/کاربر و sync مالی وجود ندارد.

**یافته‌های اولویت‌دار برای مالک:**

1. مسیر آفلاین مجوز از HMAC با secret موجود در کد/build استفاده می‌کند؛ secret سمت کلاینت قابل محرمانه‌ماندن نیست و مجوز قابل اعتماد نیست. مسیر Ed25519 سروری اختیاری است؛ config production تأیید نشده است.
2. `voidInvoice` درآمد فروش را از جدول `transactions` فیزیکی حذف می‌کند؛ تست فعلی نیز همین رفتار را انتظار دارد. event ابطال ثبت می‌شود، اما reversal درآمدی و trace کامل جای حذف را نمی‌گیرد.
3. GitHub Pages API و status آخرین deployment هر دو URL با `http` گزارش کردند؛ API نیز `https_enforced=false`, `custom_domain=null` داد، در حالی که سورس CNAME و workflow از HTTPS می‌گویند. Live host بررسی نشد، پس TLS/redirect باید روی host واقعی verify شود. علاوه بر این، workflow branch آزمایشی را trigger می‌کند ولی Pages environment فقط `main` را می‌پذیرد؛ run تاریخی آن branch build موفق/deploy ناموفق داشت و علت دقیق نامعلوم است. صفحهٔ محصول Android 1.4.2 را به Pre-release با برچسب NOT FOR STORES لینک می‌دهد؛ tag build در validation کلید امضا متوقف شد و علت دقیق به‌دلیل در دسترس نبودن log تأیید نشد.
4. در workflowهای Android/Admin `contents:write` کل job را پوشش می‌دهد و checkout credential پیش‌فرض را پایدار نگه می‌دارد، در حالی که build scripts/Gradle اجرا می‌شوند؛ علاوه بر آن، suite کامل unit/typecheck/lint در CIهای دیده‌شده gate نیست. این ریسک بالقوهٔ زنجیرهٔ تأمین و کیفیت release است؛ GitHub ruleset/required checks از API قابل تأیید نبود. public `github-test` release asset و signed-release APK verifier دارند، اما Actions debug artifact در `github-test` پیش از verifier upload می‌شود، artifact-only `test-apk` verifier ندارد، signed-release verifier AAB همراه را نمی‌سنجد، و Admin verifier پیش از upload signer identity/`application-debuggable` را assert نمی‌کند.
5. Admin Android کنترل‌های خوبی در host/path/TLS دارد، اما DOM storage و cookies فعال‌اند و cookieها روی pause flush می‌شوند؛ cleanup session و cookie flags سرور بررسی نشده‌اند، پس privacy/session retention روی device نیازمند verification است. APK موجود debug و staging-target است.
6. Admin PHP staging در source دارای CSRF/session cookie flags/rate limits و hash-pinned artifact است؛ deploy آن اما مستقیم روی پوشهٔ `app` extract می‌کند و atomic swap/rollback در کد مشاهده نشد. PHP lint/runtime و server config اجرا/دیده نشدند؛ این یافته staging code است، نه اثبات آسیب production.
7. Android source manifest permissionهای مستقیمی محدود و `allowBackup=false` دارد؛ FileProvider external root تعریف می‌کند، ولی call-site مشاهده‌شده فقط فایل `Directory.Cache` را share می‌کند. Backup JSON/CSV/PDF در همان cache ذخیره می‌شوند و حذف صریح ندارند؛ policy retention نیازمند بررسی است. Barcode scanner از WebView `getUserMedia` استفاده می‌کند و Capacitor 8.5.3 مسیر VIDEO_CAPTURE را به مجوز runtime دوربین bridge می‌کند؛ اما device support تست نشده، setup error ممکن است track را تا بستن دیالوگ فعال نگه دارد، و detectهای async هم‌پوشان ممکن است callback تکراری بسازند که در POS مقدار basket را افزایش دهد. Capacitor source mixed-content default=false و release Gradle debuggable=false است، اما workflow تست debug APK می‌سازد و WebView debugging آن به debuggable flag وابسته است؛ public test APK run `41813070224` از همان tree source در verifier CI قبول شد، ولی binary مستقل دانلود/parse یا روی device اجرا نشد و signed release نیز build نشد. merged manifest/permission/cleartext policy همچنان unresolved است؛ این‌ها source/CI evidence و device-review items هستند، نه رخداد live تأییدشده.

علاوه بر این، چند مسیر POS ریال را با `Math.round(rial/10)` به تومان تبدیل می‌کنند، و بعضی aggregateهای گزارش/مانده از جمع مستقیم `number` استفاده می‌کنند. این موارد نیازمند اصلاح/آزمون قبل از توسعهٔ وسیع Business هستند.

## نتیجهٔ آزمون مستقل این نشست

روی snapshot دقیق `KarenYar/main` در فضای موقت:

- `npm test`: **47 فایل، 369 تست موفق**.
- `npm run typecheck`: موفق.
- `npm run lint`: موفق.
- `npm run build`: موفق؛ هشدار chunk PDF برابر 1,007.39 kB خام / 507.89 kB gzip.
- `npm run test:android-release`: **35 تست موفق**.
- `npm run release:check`: نسخه 1.4.2، `versionCode=10402` و app ID درست.
- `npm audit --omit=dev`: 3 advisory؛ `npm audit` کامل: 30 advisory (از جمله 3 critical در dependencyهای dev/test). هیچ به‌روزرسانی dependency انجام نشد.
- Playwright E2E در این محیط اجرا نشد، چون browser executable نصب نبود و دانلود آن خارج از hostهای مجاز شبکه است. گزارش داخلی مخزن از 30 E2E موفق قبلی یاد می‌کند، ولی آن نتیجه در این نشست مستقل تأیید نشد.

فرمان‌ها روی snapshot موقت اجرا شدند؛ هیچ source code، branch، release، DB یا production تغییر نکرد.

## وضعیت حوزه‌ها

| حوزه | نتیجهٔ ممیزی کد |
|---|---|
| معماری و تکنولوژی | شناسایی شد؛ local-first، تک‌دستگاهی، بدون backend مالی |
| فروش و فاکتور | پیاده‌سازی جزئی/قابل استفاده در سطح برنامه؛ شکاف void/reversal و پول POS باقی است |
| هستهٔ دقیق مبلغ | BigInt/fixed-point برای invoice موجود و تست‌شده؛ بعضی گزارش‌ها و ابزارهای عمومی از number استفاده می‌کنند |
| حسابداری دوطرفه | در سورس فعلی موجود نیست |
| خرید، تأمین‌کننده، برگشت رسمی | در سورس فعلی موجود نیست |
| انبار | گردش سادهٔ یک موجودی محلی موجود؛ چندانبار/ارزش‌گذاری رسمی وجود ندارد |
| Personal و Business | دو edition مستقل وجود ندارد؛ feature tiers فعلی جای edition architecture نیستند |
| دیتابیس | IndexedDB/Dexie v4 محلی؛ backup JSON v3؛ هیچ DB مرکزی نیست |
| offline/sync | کارکرد محلی آفلاین موجود؛ همگام‌سازی مالی چنددستگاهی وجود ندارد |
| امنیت | HMAC سمت کلاینت، دادهٔ محلی/backup cleartext، CI write privileges؛ Admin WebView session/storage نیازمند verification؛ بدون RBAC/tenant backend |
| اسناد فارسی | Jalali/RTL/PDF برداری و CSV موجود؛ Excel و آزمون چاپ فیزیکی/مرورگر واقعی تأیید نشده |
| استقرار و production | `NEEDS_VERIFICATION / CPANEL DEFERRED`؛ GitHub Pages API HTTPS غیرفعال/custom domain خالی می‌دهد؛ Android 1.4.2 pre-release است؛ کاربر cPanel server را گزارش کرده اما اتصال/بررسی را فعلاً لازم ندانست؛ host و محیط نامعلوم و هیچ server command اجرا نشده |

## پیشنهاد Shared Core و editionها

جهت‌گیری یک هستهٔ مالی مشترک و دو edition همچنان مناسب است، اما نباید به‌عنوان وضعیت فعلی معرفی شود. معماری پیشنهادی در `docs/architecture/` با شواهد `KarenYar` تنظیم شده است: هستهٔ Money/Posting مشترک، ماژول‌های Sales/Inventory/Treasury و Reports، و entitlement جدا از RBAC. برای ساخت Business واقعی، ledger و سرویس سروری/مرز چندشرکتی لازم است؛ Modular Monolith گزینهٔ بررسی است، نه تصمیم deployment مصوب.

## به‌روزرسانی دربارهٔ cPanel (اطلاع کاربر، 2026-11-05)

کاربر گفته تیم سرور cPanel دارد و در صورت نیاز می‌تواند روی آن اجرا انجام دهد. این امکان ثبت شده؛ اما cPanel connector در Arena پشتیبانی نمی‌شود و host، محیط (staging/production)، access route و scope مجاز از این sandbox تأیید نشده‌اند. کاربر صریحاً گفت اتصال/بررسی cPanel فعلاً لازم نیست؛ بنابراین هیچ commandی روی server اجرا نمی‌شود و ممیزی static برنامه ادامه می‌یابد. [Runbook read-only staging](CPANEL_READ_ONLY_RUNBOOK.md) برای نیاز آینده نگه داشته شده است.

## گام اجرایی بعدی و Approval Gate

اکنون ممیزی source و معماری مفهومی موجود است. کاربر greenfield shell/UI prototype را در شاخهٔ فعال `arena/cd2e7fc5-hesabyar2` مجاز کرده؛ PRهای #5 تا #9 آن را به `main` افزودند و این شاخه تعامل‌های mock-only مشتری/داشبورد/فاکتور را ادامه می‌دهد. این مجوز شامل منطق حسابداری، تراکنش واقعی، persistence/DB، licensing، migration، import از `KarenYar` یا release نیست؛ آن موارد همچنان به تأیید جداگانه نیاز دارند.

تصمیم‌های باز پیش از توسعهٔ فراتر از UI:

1. آیا `rahmaniho/KarenYar` منبع رسمی برنامه‌ای است که باید Hesabyar 2.0 از آن تکامل یابد؟
2. آیا توسعهٔ کامل باید روی source فعلی `KarenYar` باشد یا greenfield در `Hesabyar2` ادامه یابد؟ prototype فعلی فقط shell/UI است و این تصمیم را پیشاپیش حل نمی‌کند.
3. قواعد مالی برای POS conversion، invoice reversal و مجوزدهی چه هستند و چه ownerهایی باید پیش از تغییرات اجرایی آن‌ها را تصویب کنند؟

هیچ تغییر production، migration، نشر یا ادعای تأیید live انجام نشده است. گزارش جزئی: [ممیزی کد برنامه](APP_CODE_AUDIT.md)، [deployment و release](DEPLOYMENT_AND_RELEASE_AUDIT.md)، [CI و زنجیرهٔ تأمین](CI_SUPPLY_CHAIN_AUDIT.md)، [ماتریس راستی‌آزمایی artifactهای Android/Admin](ANDROID_ARTIFACT_VERIFICATION_PLAN.md)، [Admin Android](ADMIN_ANDROID_AUDIT.md)، [Admin PHP staging](ADMIN_SERVER_AUDIT.md)، [cPanel read-only runbook](CPANEL_READ_ONLY_RUNBOOK.md)، [Android platform](ANDROID_PLATFORM_AUDIT.md)، [صفحهٔ محصول و SEO](PRODUCT_PAGE_AND_SEO_AUDIT.md)، [شواهد منبع](SOURCE_EVIDENCE.md)، [معماری فعلی](CURRENT_ARCHITECTURE.md)، [گیت آمادگی توسعه](../architecture/IMPLEMENTATION_GATE.md) و [گزارش ریسک](../../RISK_REGISTER.md).
