# ADR-001 — مرز و دامنهٔ Shared Core

**وضعیت:** `DRAFT / OPEN — تصمیم معماری یا مجوز پیاده‌سازی نیست`
**تاریخ:** 2026-11-05
**تصمیم‌گیرندگان لازم:** مالک محصول، معمار فنی، و مالک دامنهٔ مالی/حسابداری؛ برای داده و امنیت نیز تأیید نقش‌های مربوط لازم است.

## خلاصه

کاربر `Hesabyar2` را به‌عنوان source توسعهٔ greenfield و Shared Core را به‌عنوان هدف سطح‌بالا انتخاب کرده است. این جهت‌گیری به‌تنهایی مرز package/module، ساختار editionها، backend، data authority، قواعد حسابداری یا مجوز پیاده‌سازی را مشخص نمی‌کند. این ADR گزینه‌ها و پرسش‌ها را برای تصمیم بعدی ثبت می‌کند؛ هیچ گزینه‌ای در این سند تصویب نشده است.

## زمینه و وضعیت فعلی

- PR #11 در `main` ادغام شده است؛ `Hesabyar2` اکنون UI prototype و تعامل‌های mock دارد.
- `src/domain/money.ts` فقط helper خالص WP‑1 برای parsing/formatting دقیق ورودی Rial/Toman است؛ به فروش، transaction، ledger یا persistence متصل نیست.
- هنوز ledger، posting/reversal/refund، API، DB، backend، migration یا licensing در این مخزن پیاده نشده‌اند.
- `KarenYar` فقط مرجع legacy بررسی‌شده باقی می‌ماند؛ import یا تغییر آن مجاز نشده است.
- اسناد `TARGET_ARCHITECTURE.md`, `SHARED_CORE_SPECIFICATION.md` و `EDITION_ARCHITECTURE.md` پیشنهادند، نه تصمیم‌های مصوب.

## قیود پذیرفته‌شده و مرز این ADR

1. **جهت سطح‌بالا:** یک هدف Shared Core برای Personal و Business انتخاب شده است؛ دامنهٔ دقیق آن باز است.
2. **WP‑1:** تنها قرارداد پولیِ صریح فعلی، ورودی با واحد مشخص `rial` یا `toman`، عدد صحیح مثبت، بدون rounding، رقم فارسی/لاتین و نمایش دقیق remainder است. این قرارداد به سیاست مالیات، قیمت‌گذاری، ثبت معامله یا برگشت وجه تعمیم داده نمی‌شود.
3. **عدم گسترش ضمنی مجوز:** هیچ بخش این ADR اجازهٔ نوشتن transaction، ledger، refund/reversal، persistence/API/DB، licensing، migration، deployment یا release نمی‌دهد.
4. **عدم انتخاب زیرساخت:** زبان backend، provider، database، hosting، tenant model و sync mechanism انتخاب نشده‌اند.

## گزینه‌های مرزبندی برای تصمیم

| گزینه | دامنهٔ احتمالی | مزیت | پیامد/هزینه | وضعیت |
|---|---|---|---|---|
| A — هستهٔ محاسبات خالص | Money/Unit و محاسبات deterministic؛ بدون I/O، UI یا persistence | کوچک و قابل‌آزمون؛ کمترین coupling | rules مالی، ثبت و consistency خارج از این هسته می‌مانند | پیشنهاد برای بررسی؛ تصویب نشده |
| B — هستهٔ مالی کامل | گزینهٔ A به‌علاوهٔ tax/pricing policy، journal، posting، period و reversal | invariants مالی متمرکز می‌شوند | نیازمند تصمیم حسابداری، idempotency، سازگاری داده، transaction boundary و backend/runtime | نیازمند تصمیم و approval جدا |
| C — فعلاً مرز package تعیین نشود | WP‑1 در محل فعلی بماند تا requirements و runtime روشن شوند | از abstraction زودرس و migration معماری پرهیز می‌کند | Shared Core فعلاً هدف مفهومی می‌ماند و reuse محدود است | گزینهٔ کم‌تعهد برای اکنون؛ تصویب نشده |

این گزینه‌ها الزاماً mutually exclusive نیستند؛ مثلاً A می‌تواند مرحلهٔ نخست B باشد. این سند چنین ترتیبی را نیز تصمیم نهایی نمی‌داند.

## گزینه‌های reuse و runtime

| گزینه | توضیح | سؤال باز |
|---|---|---|
| TypeScript domain package در همین repository | یک implementation خالص می‌تواند بعداً توسط client و backend TypeScript مصرف شود | آیا backend آینده هم TypeScript خواهد بود؟ بسته‌بندی/نسخه‌بندی لازم است یا `src/domain` کافی است؟ |
| قرارداد و test vectors مستقل از زبان | هر runtime implementation خود را دارد ولی باید با vectors مشترک سازگار باشد | چه runtimeهایی واقعاً لازم‌اند و چه کسی conformance را نگه‌داری می‌کند؟ |
| defer کردن package boundary | helperها تا روشن‌شدن consumerها در app-local domain باقی می‌مانند | در چه milestoneای package یا conformance layer ارزش دارد؟ |

هیچ backend runtime یا package publication در این ADR انتخاب نمی‌شود.

## تصمیم‌های محصول/داده که هنوز لازم‌اند

- آیا Personal و Business دو UX در یک app هستند یا clientهای جدا با domain implementation مشترک؟
- Personal واقعاً باید local-first/offline بماند؟ Business نیاز به multi-user/server-authoritative دارد؟ حدود offline command queue و conflict resolution چیست؟
- Core دقیقاً شامل کدام موارد است: money/unit، قیمت‌گذاری، تخفیف/مالیات، rounding، journal/ledger، دوره، پرداخت، inventory valuation و reversal؟
- چه currency/unit، maximum amount، tax/rounding rule، effective-date و accounting-owner sign-off لازم است؟ فقط قرارداد محدود WP‑1 اکنون پذیرفته شده است.
- legacy data/behavior از `KarenYar` چه زمانی و با چه fixture/backup/rollback policy باید سازگار یا migrate شود؟
- edition entitlement، user/tenant/role، license compatibility و server enforcement چه مرزهایی دارند؟
- چه backup/restore، retention، privacy، threat model و operational ownerهایی برای هر storage/sync path لازم‌اند؟

## پیشنهاد موقت برای بازبینی (تصمیم نیست)

- Core دامنه‌ای را از UI، network، storage، auth و licensing جدا نگه دارید؛ وابستگی‌ها فقط از طریق قراردادهای صریح باشد.
- محاسبات مشترک را در دو edition جداگانه پیاده نکنید، مگر conformance tests تفاوت‌ها را آگاهانه پوشش دهند.
- WP‑1 را helper مستقل نگه دارید؛ tax, pricing, rounding, posting, ledger, refund یا persistence به آن اضافه نکنید تا قراردادهای مربوط تصویب شوند.
- پیش از انتخاب B، invariants حسابداری، correction/reversal، idempotency، migration و تست‌های domain را با مالک مالی مشخص کنید.
- تا مشخص‌شدن backend/runtime و hosting، DB/provider یا deployment strategy انتخاب نکنید.

## معیار عبور به تصمیم نهایی

این ADR فقط پس از ثبت پاسخ/تأیید صریح برای موارد زیر می‌تواند `Accepted` شود:

1. مرز Shared Core و موارد صریحاً خارج از آن؛
2. مدل Personal/Business و runtime/reuse strategy؛
3. مالک و نسخه‌بندی policyهای پول، tax، rounding، posting و reversal؛
4. نیازهای offline, tenant, data compatibility, backup/restore و security؛
5. مرحله‌بندی و آزمون‌پذیری هر پیاده‌سازی.

**گیت فعلی:** تا آن زمان، کار مجاز به مستندات تصمیم و UI mock-only محدود است؛ تغییرات اجرایی مالی، persistence/backend یا migration نیازمند scope و approval جداگانه‌اند.
