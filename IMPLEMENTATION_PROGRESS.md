# پیشرفت Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05
**شاخهٔ فعال:** `arena/4085f085-hesabyar2` روی merge commit PR #12، `621136567b69fe895e985e76cf94fa691596ef3b`.
**وضعیت کلی:** `Hesabyar2` به انتخاب کاربر source سبزِ توسعه با هدف Shared Core است؛ UI همچنان mock-only است و فقط helper مستقل WP‑1 برای ورود دقیق مبلغ اضافه شده، بدون ثبت تراکنش، ledger یا persistence.

| محدوده | وضعیت | شواهد |
|---|---|---|
| مخزن توسعهٔ محصول | `GREENFIELD PROTOTYPE` | PR #11 در main ادغام شد (merge `f13e3d9`) و PR #12 مستندات/ADR-001 را افزود (merge `6211365`); main شامل جزئیات کالا، فیلترهای mock، helper خالص WP‑1 و CI/lint است، اما محصول مالی کامل نیست |
| source توسعهٔ Hesabyar 2.0 | `HESABYAR2 SELECTED / DETAILS PENDING` | کاربر `Hesabyar2` را برای توسعهٔ greenfield با هدف Shared Core انتخاب کرد؛ `KarenYar` جدا مانده و import/ویرایش نشده؛ جزئیات هنوز نیازمند تأیید مالک است |
| Shared Core architecture | `ADR-001 DRAFT / OPEN` | گزینه‌ها و پرسش‌های scope، runtime، Personal/Business و data authority در `docs/architecture/ADR-001-SHARED-CORE.md` ثبت شدند؛ هیچ تصمیم دامنه‌ای یا مجوز implementation ایجاد نشده است |
| UI prototype | `IN_PROGRESS / MOCK ONLY` | RTL dashboard و صفحه‌های نمونه؛ افزودن مشتری در حافظهٔ موقت، فیلتر وضعیت mock برای فاکتور/گردش/مشتری/کالا، سری‌های chart ساختگی، و جزئیات فقط‌خواندنی مشتری/فاکتور/کالا؛ هیچ مبلغ یا موجودی در app محاسبه/تغییر نمی‌شود |
| WP-1 مبلغ | `IN_PROGRESS / PURE HELPER ONLY` | helper مستقل و بدون اتصال به فروش: واحد صریح ریال/تومان، عدد صحیح مثبت، حفظ remainder بدون گردکردن، رقم فارسی/لاتین، خروجی BigInt ریالی؛ صفر/منفی/اعشار رد می‌شود؛ ledger، معامله یا persistence ندارد |
| داده و حریم خصوصی prototype | `NO PERSISTENCE / NO API` | کد اجرایی app از localStorage/sessionStorage/IndexedDB/fetch/backend استفاده نمی‌کند؛ تست فقط نبودن write به localStorage را assert می‌کند؛ لطفاً اطلاعات واقعی مشتری یا فاکتور وارد نکنید |
| تست prototype و WP-1 | `PASS` | ۲۴ تست: ۱۶ تست UI و ۸ تست helper مبلغ برای واحد ریال/تومان، ورودی‌های ۱..۱۱، رقم فارسی/لاتین، remainder دقیق، ورودی نامعتبر/منفی/صفر، BigInt بزرگ و بازنشانی فیلتر هنگام تعویض فهرست |
| typecheck/build prototype | `PASS` | `npm run typecheck` و `npm run build` موفق؛ `dist/` در Git نادیده گرفته می‌شود |
| dependency audit prototype | `PASS` | `npm audit`: صفر vulnerability |
| CI کیفیت | `PASS / REQUIRED-CHECK POLICY PENDING` | main CI روی merge PR #11 (`41939981854`) و PR #12 (`42004918329`) موفق؛ workflow با `contents: read`، Actionsهای SHA-pinned، Node 22، `npm ci`, lint/test/typecheck/build و audit؛ branch protection/required-check در این مرحله تغییر یا مستقل تأیید نشده و مالک باید آن را روشن کند |
| GitHub Pages | `AUTO-DEPLOY WORKFLOW SUCCEEDED / CONTENT UNVERIFIED` | mergeهای PR #11/#12 خودکاراً runs `41939981195` (`f13e3d9`) و `42004917176` (`6211365`) را اجرا کردند؛ build/deploy هر دو موفق. تنظیم Pages مسیر `main:/` و HTTPS را گزارش می‌کند؛ URL در مرورگر بررسی نشده و موفقیت workflow اثبات نمی‌کند Vite prototype درست اجرا می‌شود. این deployها دستی نبودند؛ کاربر خواسته Pages deploy دیگری بدون اجازهٔ جداگانه رخ ندهد |
| ممیزی source قدیمی `KarenYar` | `COMPLETED_FOR_SNAPSHOT` | snapshot read-only `KarenYar/main@d41ca291...`؛ 369 unit tests، typecheck/lint/build و 35 release tests مربوط به prototype فعلی نیستند |
| E2E مرورگر | `NOT RUN` | مرورگر واقعی/device در این مرحله تست نشده؛ صفحه و app module در Vite preview با HTTP 200 پاسخ دادند |
| production/staging و cPanel | `DEFERRED_BY_USER` | کاربر بررسی cPanel را فعلاً نخواست؛ هیچ server command/credential/environment استفاده نشد |
| Android/release برای prototype | `NOT STARTED` | APK/AAB، Capacitor، signer و release ساخته/تغییر داده نشده‌اند؛ workflow فعلی فقط CI کیفیت وب است |
| DB/migration/backend و cPanel | `NOT STARTED / DEFERRED` | هیچ DB، دادهٔ مشتری، licensing، migration، backend یا server/cPanel اجرا/تغییر نشده؛ GitHub Pages auto-deploy جداگانه در ردیف بالا ثبت شده است |

## گام بعدی

PR #12 با merge commit `6211365` ادغام شد؛ CI روی main (`42004918329`) موفق است. merge، Pages build/deploy را خودکار اجرا کرد (`42004917176` موفق؛ اجرای دستی نبود) و URL بررسی نشده است. کاربر دستور داده Pages deploy دیگری بدون اجازهٔ جداگانه انجام نشود. WP‑0 سبز است، اما branch protection/required-check policy نیازمند تأیید مالک است. ADR-001 در main به‌صورت پیش‌نویس باقی می‌ماند؛ تا تصویب دامنه، هیچ معامله/ledger/refund/persistence/API/DB/licensing/migration یا release اضافه نمی‌شود. cPanel همچنان deferred است.
