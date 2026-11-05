# ماتریس وضعیت قابلیت‌ها — کد منبع در برابر محصول زنده

**Source snapshot:** `rahmaniho/KarenYar/main`، commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**محدودیت:** live app/production بررسی نشده؛ ستون «Live» همواره تا مشاهدهٔ محیط `NEEDS_VERIFICATION` می‌ماند. کاربر `Hesabyar2` را برای توسعهٔ greenfield انتخاب کرده است؛ PR #11 در main ادغام شده (merge commit `f13e3d9`) و جزئیات کالا، فیلترهای mock و helper مستقل WP‑1 را دارد؛ شاخهٔ فعال نشست `arena/67897961-hesabyar2` از همین merge آغاز می‌شود. main هنوز UI prototype است، نه محصول کامل. helper فقط ورودی صحیح ریال/تومان را دقیق تبدیل/قالب‌بندی می‌کند؛ به POS، ledger یا persistence وصل نیست و قابلیت واقعی محصول محسوب نمی‌شود.

| حوزه | وضعیت در source | وضعیت live | توضیح |
|---|---|---|---|
| PWA و Android wrapper | `IMPLEMENTED` | `NEEDS_VERIFICATION` | Vite/Workbox/Capacitor؛ build موفق، دستگاه واقعی تست نشد |
| RTL/Jalali/Vazirmatn | `IMPLEMENTED` | `NEEDS_VERIFICATION` | کد و تست locale وجود دارد |
| POS/فاکتور | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | فروش/فاکتور/پیش‌نویس/ابطال؛ workflow کامل تجاری نیست |
| reversal درآمد در void | `BROKEN` نسبت به invariant حفظ posted record | `NEEDS_VERIFICATION` | void ردیف income را delete می‌کند؛ تست فعلی همین رفتار را می‌پذیرد |
| هستهٔ مبلغ فاکتور | `IMPLEMENTED` در مسیر فاکتور | `NEEDS_VERIFICATION` | BigInt fixed-point؛ POS هنوز بعضی conversionهای قدیمی دارد |
| ورودی ریالی POS غیرمضرب ۱۰ | `BROKEN` نسبت به تبدیل دقیق | `NEEDS_VERIFICATION` | مسیر فعلی `Math.round(rial/10)` می‌کند |
| محصولات/بارکد/دسته‌بندی | `IMPLEMENTED` در دامنهٔ محلی | `NEEDS_VERIFICATION` | CRUD و categoryها |
| موجودی | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | یک موجودی محلی و movement؛ بدون چندانبار/خرید |
| مشتری/نسیه/دریافت | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | customer payments/refunds؛ supplier/AP وجود ندارد |
| بودجه/بدهی/تراکنش شخصی | `IMPLEMENTED` در سطح پایه | `NEEDS_VERIFICATION` | داده محلی، بدون sync |
| حقوق و دستمزد | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | calculator و PDF؛ انطباق قانونی مستقل بررسی نشده |
| گزارش‌های فروش | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | summary/read-modelهای ساده؛ aggregate safe-integer نیازمند تست |
| double-entry/chart/ledger | `MISSING` در source | `NEEDS_VERIFICATION` | هیچ journal/account model وجود ندارد |
| خرید/supplier/return | `MISSING` در source | `NEEDS_VERIFICATION` | restock دستی معادل purchase document نیست |
| treasury/bank/check/reconciliation | `MISSING` | `NEEDS_VERIFICATION` | فقط methodهای پرداخت در فاکتور، بدون حساب بانکی رسمی |
| Personal/Business edition | `MISSING` به‌عنوان مرز مستقل | `NEEDS_VERIFICATION` | source یک app با tiers free/pro/proplus دارد |
| کاربران/نقش‌ها/شرکت‌ها | `MISSING` | `NEEDS_VERIFICATION` | backend auth/RBAC/tenant ندارد |
| offline single-device | `IMPLEMENTED` | `NEEDS_VERIFICATION` | IndexedDB/PWA محلی |
| financial multi-device sync | `MISSING` | `NEEDS_VERIFICATION` | online sync فقط در مسیر license |
| licensing | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | offline HMAC و optional server Ed25519؛ HMAC secret exposure |
| offline license integrity | `BROKEN` اگر KS1 آفلاین فعال باشد | `NEEDS_VERIFICATION` | secret در source/client است؛ وضعیت config production نامعلوم |
| local data encryption | `MISSING` در source بازرسی‌شده | `NEEDS_VERIFICATION` | PIN فقط UI lock؛ DB/backup cleartext |
| PDF فارسی | `IMPLEMENTED` در code/unit tests | `NEEDS_VERIFICATION` | vector PDF و Persian shaping؛ browser E2E فعلی اجرا نشد |
| چاپ و CSV | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | print/CSV code موجود؛ چاپ فیزیکی تست نشده |
| Excel/XLSX | `MISSING` در source بازرسی‌شده | `NEEDS_VERIFICATION` | implementation یافت نشد |
| Backup/restore | `PARTIALLY_IMPLEMENTED` | `NEEDS_VERIFICATION` | JSON v3، validation و transaction import؛ unencrypted، rollback دستی |
| Tests/build | `IMPLEMENTED` در repo | `NEEDS_VERIFICATION` برای CI/production | 369 unit، typecheck/lint/build، 35 release tests در snapshot موفق |
| Browser E2E | `NEEDS_VERIFICATION` | `NEEDS_VERIFICATION` | docs منبع E2E قبلی را ادعا می‌کند؛ این نشست browser نداشت |

جزئیات در [`docs/audit/FEATURE_INVENTORY.md`](docs/audit/FEATURE_INVENTORY.md) است. وضعیت‌های target edition در [`EDITION_CAPABILITY_MATRIX.md`](EDITION_CAPABILITY_MATRIX.md).
