# گیت آمادگی برای اولین تغییر اجرایی

**وضعیت:** پیشنهاد/چک‌لیست؛ approval نشده و مجوز تغییر کد محسوب نمی‌شود.
**Baseline شواهد:** `KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`; مخزن فعال نشست همچنان `Hesabyar2`, branch `arena/39118004-hesabyar2` است.

## چرا این گیت لازم است؟

سورس برنامه در `KarenYar` شناسایی شده، اما branch فعال Arena روی repo جداگانه و تقریباً خالی `Hesabyar2` است. علاوه بر mismatch، production behavior، migration مشتری، Pages/TLS، branch/ruleset protection، CI signing secrets و تصمیم‌های حسابداری از دسترس ممیزی read-only خارج‌اند. بنابراین ادامهٔ طراحی مستندات ممکن است، ولی شروع source change، migration یا release نه.

## تصمیم‌ها/شواهد لازم پیش از اولین PR برنامه

| Gate | مالک/نقش لازم | تصمیم یا evidence موردنیاز | وضعیت |
|---|---|---|---|
| G-01 — Canonical source | product/repository owner | آیا `KarenYar` منبع رسمی Hesabyar 2.0 است؟ مسیر کار چگونه با branch ثابت Arena `arena/39118004-hesabyar2` سازگار می‌شود؟ | `NEEDS_OWNER_CONFIRMATION` |
| G-02 — Scope و baseline پشتیبانی | product/release owner | کدام release و کدام editionها باید حفظ شوند؟ آیا Android 1.4.2 صرفاً beta است یا انتشار عمومی مدنظر است؟ | `NEEDS_VERIFICATION` |
| G-03 — پول و قواعد ثبت | accounting/domain owner | سیاست تومان/ریال، remainder ورودی، rounding، تاریخ مؤثر، اصلاح/ابطال فاکتور، refund و بستن دوره چیست؟ | `NEEDS_DOMAIN_APPROVAL` |
| G-04 — سازگاری و داده | database/product owner | fixture ناشناس از backup/versionهای پشتیبانی‌شده، سناریوی restore و plan rollback کجاست؟ آیا برای legacy voidها source record قابل اتکا هست؟ | `NEEDS_VERIFICATION` |
| G-05 — مجوز/حریم خصوصی | licensing/security owner | حفظ lifetime/KS1، سرور مجوز، crypto keys، retention و رفتار هنگام license failure چگونه باید باشد؟ | `NEEDS_SECURITY_APPROVAL` |
| G-06 — CI/release authority | repository/security owner | branch/tag rules، required checks، Environment reviewers و secret scopes چیست؟ Pages branch preview عمدی است؟ | `NEEDS_ADMIN_VERIFICATION` |
| G-07 — Deployment/TLS | Pages/DNS owner | چرا Pages API/deployment URL با HTTP گزارش می‌شود و custom domain خالی است؟ live TLS/redirect/headers چگونه تأیید می‌شوند؟ | `NEEDS_LIVE_VERIFICATION` |

مقادیر secret، backup واقعی مشتری یا دادهٔ production را به Git/chat منتقل نکنید؛ verification باید از مسیر امن مالک و با دادهٔ ناشناس انجام شود.

## ترتیب پیشنهادی work packages — همه غیرمجاز تا تصویب gateها

### WP-0 — منبع و CI قابل تکرار

- تثبیت repo/ref مجاز و baseline commit.
- پیش از feature work، اجرای CI کم‌دسترسی برای `npm test`, typecheck, lint, build و release guards؛ تست‌ها در CI فعلی همه gate نیستند.
- جداکردن build/test از publish/sign؛ protected environment و tag/source policy را فقط پس از تصمیم owner تنظیم کنید.
- **خروجی پذیرش:** دست‌کم یک PR آزمایشی بدون release و بدون production write که تمام required checks را reproducibly سبز کند؛ permissions ثبت/بازبینی شوند.

### WP-1 — مرز ورودی پول POS

- اول سیاست مقدارهای ریالی غیرمضرب ۱۰ و نمایش/ذخیرهٔ تومان تصویب شود؛ خطای فعلی `Math.round(rial/10)` نباید با رفتار دیگری خاموش جایگزین شود.
- آزمون لبه: 0، 1..9، 10، 11، مقادیر منفی/حدی و parse فارسی/انگلیسی؛ رفتارهای نامعتبر باید صریح باشند.
- **خروجی پذیرش:** هیچ ورودی مالی بی‌صدا گرد/حذف نشود؛ UI و قرارداد سرویس واحد پول را یکسان اعلام کنند؛ تمام regression tests سبز.
- هیچ schema/data migration برای این تغییر از پیش فرض نشده است.

### WP-2 — ابطال/اصلاح فروش

- ابتدا mapping موجودی invoice، `transactions`, payments/refunds، گزارش و `financialEvents` به مدل reversal تصویب شود.
- original posted evidence immutable بماند؛ reversal به original reference داشته باشد؛ درخواست تکراری idempotent باشد؛ مجموع postingها متوازن باشد.
- مشخص شود آیا draft/void/posted/returned states جدا می‌مانند و گزارش تاریخی چگونه رفتار می‌کند؛ برای legacy voidها دادهٔ حذف‌شده را حدس نزنید.
- **خروجی پذیرش:** fixture قدیمی و جدید، migration/rollback rehearsal، audit trail و account reconciliation با owner sign-off.

### WP-3 — Shared Core/Business ledger

- تنها پس از WP-0..2 و domain approval؛ accounting product mappings، fiscal periods، currencies, tax/legal rules و tenant model باید جدا تصویب شوند.
- backend/DB/host در این سند انتخاب نشده‌اند؛ Supabase یا provider دیگر بدون requirements و operational approval انتخاب نشود.
- هیچ migration از IndexedDB کاربر به cloud بدون consent, reconciliation, restore و rollback rehearsal اجرا نشود.

## Definition of Done برای هر تغییر مالی

1. تغییر روی canonical repo/ref مصوب، با diff کوچک و قابل review باشد.
2. baseline test پیش از تغییر و tests پس از تغییر ثبت شود؛ هر آزمونی که اجرا نشد صریحاً `NOT RUN` بماند.
3. محاسبه پول در واحد/precision مصوب و overflow-safe باشد؛ rounding یا conversion خاموش ممنوع.
4. posting/reversal اتمیک، idempotent و متوازن باشد؛ posted source فیزیکی پاک/overwrite نشود.
5. migration و rollback روی fixture ناشناس تمرین شوند؛ هیچ Customer DB یا production write بدون approval جدا.
6. CI least-privilege باشد؛ secret/token/keystore در log یا artifact ناخواسته ظاهر نشود.
7. accounting, security, QA و owner acceptance بر اساس نقش لازم ثبت شود؛ اجرای یک agent، review مستقل انسانی محسوب نمی‌شود.

## وضعیت فعلی

- WP-0 تا WP-3: `NOT STARTED`؛ فقط proposal/criteria آماده شد.
- هیچ source code، workflow، DB، license, production یا release در این مرحله تغییر نکرد.
- گام مجاز بعدی تا روشن‌شدن G-01، G-06 و G-07: دریافت owner/admin evidence و ادامهٔ طراحی مستندات؛ نه تغییر upstream.
