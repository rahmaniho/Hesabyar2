# پیشرفت Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05
**شاخهٔ فعال:** `arena/a1600dfc-hesabyar2` بر پایهٔ merge commit PR #10، `88f3fe6456b80c5e1f584112573fbb17744a37aa`.
**وضعیت کلی:** `Hesabyar2` به انتخاب کاربر source سبزِ توسعه با هدف Shared Core است؛ UI همچنان mock-only است و فقط helper مستقل WP‑1 برای ورود دقیق مبلغ اضافه شده، بدون ثبت تراکنش، ledger یا persistence.

| محدوده | وضعیت | شواهد |
|---|---|---|
| مخزن توسعهٔ محصول | `GREENFIELD PROTOTYPE` | PRهای #5 تا #10، UI prototype و تعامل‌های mock را به `Hesabyar2/main` افزودند؛ PR #11 شامل جزئیات کالا، فیلترها، helper WP‑1 و CI workflow در شاخهٔ فعال `arena/a1600dfc-hesabyar2` است |
| source توسعهٔ Hesabyar 2.0 | `HESABYAR2 SELECTED / DETAILS PENDING` | کاربر `Hesabyar2` را برای توسعهٔ greenfield با هدف Shared Core انتخاب کرد؛ `KarenYar` جدا مانده و import/ویرایش نشده؛ جزئیات معماری/edition هنوز نیازمند ADR است |
| UI prototype | `IN_PROGRESS / MOCK ONLY` | RTL dashboard و صفحه‌های نمونه؛ افزودن مشتری در حافظهٔ موقت، فیلتر وضعیت mock برای فاکتور/گردش/مشتری/کالا، سری‌های chart ساختگی، و جزئیات فقط‌خواندنی مشتری/فاکتور/کالا؛ هیچ مبلغ یا موجودی در app محاسبه/تغییر نمی‌شود |
| WP-1 مبلغ | `IN_PROGRESS / PURE HELPER ONLY` | helper مستقل و بدون اتصال به فروش: واحد صریح ریال/تومان، عدد صحیح مثبت، حفظ remainder بدون گردکردن، رقم فارسی/لاتین، خروجی BigInt ریالی؛ صفر/منفی/اعشار رد می‌شود؛ ledger، معامله یا persistence ندارد |
| داده و حریم خصوصی prototype | `NO PERSISTENCE / NO API` | کد اجرایی app از localStorage/sessionStorage/IndexedDB/fetch/backend استفاده نمی‌کند؛ تست فقط نبودن write به localStorage را assert می‌کند؛ لطفاً اطلاعات واقعی مشتری یا فاکتور وارد نکنید |
| تست prototype و WP-1 | `PASS` | ۲۳ تست: ۱۵ تست UI و ۸ تست helper مبلغ برای واحد ریال/تومان، ورودی‌های ۱..۱۱، رقم فارسی/لاتین، remainder دقیق، ورودی نامعتبر/منفی/صفر و BigInt بزرگ |
| typecheck/build prototype | `PASS` | `npm run typecheck` و `npm run build` موفق؛ `dist/` در Git نادیده گرفته می‌شود |
| dependency audit prototype | `PASS` | `npm audit`: صفر vulnerability |
| CI کیفیت | `IN PROGRESS / WORKFLOW ACTIVE` | `.github/workflows/ci.yml` با `contents: read`، Actionsهای SHA-pinned، Node 22، `npm ci`, tests/typecheck/build و `npm audit --audit-level=low`; بدون deploy/sign/release؛ نتیجهٔ جاری در PR #11 است؛ lint script/config و branch protection هنوز تنظیم نشده‌اند |
| ممیزی source قدیمی `KarenYar` | `COMPLETED_FOR_SNAPSHOT` | snapshot read-only `KarenYar/main@d41ca291...`؛ 369 unit tests، typecheck/lint/build و 35 release tests مربوط به prototype فعلی نیستند |
| E2E مرورگر | `NOT RUN` | مرورگر واقعی/device در این مرحله تست نشده؛ صفحه و app module در Vite preview با HTTP 200 پاسخ دادند |
| production/staging و cPanel | `DEFERRED_BY_USER` | کاربر بررسی cPanel را فعلاً نخواست؛ هیچ server command/credential/environment استفاده نشد |
| Android/release برای prototype | `NOT STARTED` | APK/AAB، Capacitor، signer و release ساخته/تغییر داده نشده‌اند؛ workflow فعلی فقط CI کیفیت وب است |
| DB، migration و deploy | `NOT STARTED` | هیچ DB، دادهٔ مشتری، licensing، migration، production یا deployment لمس نشده است |

## گام بعدی

WP-1 helper خالص پیاده و تست شده است. WP-0 اکنون workflow کیفیت کم‌دسترسی دارد؛ آخرین GitHub check در PR #11 باید سبز بماند و owner باید branch-protection/required-check policy را جداگانه تأیید کند؛ lint configuration هم وجود ندارد. پیش از اتصال helper به فرم فروش یا جریان ثبت واقعی، CI سبز و review مستقل لازم‌اند. ledger/posting، برگشت وجه، persistence، API/auth، licensing، migration از `KarenYar`، Android و release هنوز شروع نشده‌اند و به تصمیم‌های جداگانه نیاز دارند.
