# Technical Decision Records — پیش‌نویس

TDRهای این سند **پیشنهاد/فرضیه** هستند و تا تأیید مالک/تیم فنی تصمیم مصوب محسوب نمی‌شوند.

## TDR-001 — تکامل تدریجی، نه بازنویسی یک‌باره

- **وضعیت:** Proposed.
- **زمینه:** برنامهٔ جاری local-first، داده‌های کاربران روی IndexedDB دستگاه‌هاست و migration مرکزی وجود ندارد.
- **پیشنهاد:** قابلیت‌های سالم حفظ شوند؛ ابتدا baseline/test/backup و سپس تغییرهای کوچک، سازگار و قابل بازگشت.
- **پیامد:** rollout کندتر از rewrite است، اما ریسک از دست‌رفتن داده و شکستن مشتریان کمتر می‌شود.

## TDR-002 — Modular monolith برای backend Business

- **وضعیت:** Proposed; نیازمند بررسی hosting/team/load.
- **زمینه:** Business چندکاربره/ledger در source فعلی نیست.
- **پیشنهاد:** در صورت افزودن backend، ابتدا یک deployable modular monolith با boundaries مشخص؛ microservices فقط با دلیل عملیاتی.
- **باز:** runtime، framework و database.

## TDR-003 — یک Shared Financial Core

- **وضعیت:** هدف سطح‌بالا توسط کاربر انتخاب شده؛ مرز و جزئیات `OPEN / NOT APPROVED`.
- **جهت پیشنهادی:** Money/Calculation/Posting/Period/Reversal می‌توانند در یک core مشترک باشند؛ این فهرست هنوز دامنهٔ مصوب نیست و انتخابش به approval دامنه‌ای نیاز دارد.
- **مرجع تصمیم:** [ADR-001 — مرز و دامنهٔ Shared Core](ADR-001-SHARED-CORE.md) گزینه‌ها و پرسش‌های باز را ثبت می‌کند.
- **گیت:** مالک محصول/معمار و Accounting Domain Owner باید scope، invariants و runtime را تأیید کنند؛ این TDR مجوز implementation نیست.

## TDR-004 — Personal local-first، Business server-authoritative

- **وضعیت:** Proposed.
- **پیشنهاد:** حفظ offline path موجود برای Personal؛ Business multi-user از backend authoritative استفاده کند. Offline Business فقط command queue/replay/conflict policy صریح.
- **رد صریح:** last-write-wins برای posted financial data.

## TDR-005 — انتخاب DB مرکزی باز می‌ماند

- **وضعیت:** Open.
- **زمینه:** DB فعلی Dexie/IndexedDB محلی است و Supabase connector جداشده است؛ استفادهٔ واقعی Supabase اثبات نشده.
- **تصمیم:** تا requirements، hosting، backup/restore، tenant isolation و operational owner روشن نشوند DB یا provider انتخاب نمی‌شود.

## TDR-006 — Licensing از RBAC جدا

- **وضعیت:** Proposed; high risk.
- **پیشنهاد:** private signing فقط سرور؛ client فقط public-key verify؛ backend entitlement enforcement. license و role جدا باشند.
- **Compatibility:** KS1/lifetime حفظ و مهاجرتش جدا approval می‌خواهد؛ خطای لایسنس نباید دادهٔ مشتری را پاک/قفل کند.

## TDR-007 — حذف درآمد در void باید به reversal قابل‌ردیابی تبدیل شود

- **وضعیت:** Proposed change, not implemented.
- **شواهد:** `invoice.service.ts:605-609` ردیف sale transaction را delete می‌کند؛ تست فعلی این رفتار را assert می‌کند.
- **گیت:** mapping گزارش‌ها/دادهٔ legacy، tests و rollback؛ هیچ تغییر در این مرحله اعمال نشده است.

## TDR-008 — Editions با capability/entitlement تعریف شوند

- **وضعیت:** Proposed.
- **پیشنهاد:** Personal/Business در product config/entitlement و UX فرق کنند؛ implementation مالی مشترک. Free/Pro/ProPlus فعلی بدون migration plan به edition تبدیل نشوند.

## TDR-009 — Build/test از publish/sign جدا و کم‌دسترسی باشد

- **وضعیت:** Proposed; نیازمند owner/repository-security approval.
- **زمینه:** ممیزی CI نشان داد Android/Admin buildها در workflow دارای `contents:write` اجرا می‌شوند؛ checkout credential پیش‌فرض را پایدار می‌کند؛ Android signed route از tag/manual dispatch است و keystore پیش از `npm ci` decode می‌شود. تنظیمات واقعی branch/ruleset/Environment از API قابل بررسی نبود.
- **پیشنهاد:** build/test با permission read-only و checkout بدون persisted credential؛ artifact را validate و به publish/sign job جدا بدهید؛ signing فقط از ref محافظت‌شده و Environment با approval؛ actionها full-SHA pin و testها required checks باشند.
- **گیت:** تصمیم owner در مورد tag policy و secret/environment scope؛ هیچ workflow در این ممیزی تغییر نکرد.
