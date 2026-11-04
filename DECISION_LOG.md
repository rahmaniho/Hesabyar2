# دفتر تصمیم‌های Hesabyar 2.0

| ID | تاریخ | تصمیم/وضعیت | مبنا |
|---|---|---|---|
| D-001 | 2026-11-04 | در ممیزی اولیه source, DB و production تغییر نکند | gate اولیه و مخزن placeholder |
| D-002 | 2026-11-04 | نبود source در `Hesabyar2` به معنی نبود محصول نیست | فقط README در این repo |
| D-003 | 2026-11-04 | از ادعای اجرای مستقل Agency Agents خودداری شود | Arena delegation tool نداشت |
| D-004 | 2026-11-04 | architecture نهایی بدون source/DB ثابت نشود | اطلاعات checkout اولیه ناکافی بود |
| D-005 | 2026-11-04 | GitHub فقط read access تأیید شد؛ write آزمایش نشد | `gh repo view`/API موفق |
| D-006 | 2026-11-04 | M0 روی repo placeholder کامل نیست | source app غایب در مخزن نشست |
| D-007 | 2026-11-04 | `rahmaniho/KarenYar` به‌عنوان source برنامهٔ محتمل برای ممیزی پذیرفته شد، نه هنوز مخزن توسعهٔ مصوب | شرکت در `rahmaniho/karen-soft/docs/hesabyar-release-update.md` آن را source معرفی می‌کند؛ package/app ID همخوان است |
| D-008 | 2026-11-04 | snapshot `KarenYar/main@d41ca291...` read-only در `/tmp` آزمون شد | source suite/build را در isolated copy اجرا کردیم |
| D-009 | 2026-11-04 | Shared Core/edition architecture به‌صورت proposal تهیه شد؛ approval pending | سورس فعلی local-first و فاقد ledger/tenant است |
| D-010 | 2026-11-04 | هیچ source, branch, release, DB یا production در هیچ repo تغییر نکرد | ممیزی/معماری فقط |
| D-011 | 2026-11-04 | CI least-privilege، protected signing و test gates پیشنهادند؛ workflow تغییر نمی‌کند تا owner approval برسد | ممیزی `CI_SUPPLY_CHAIN_AUDIT.md`; branch/ruleset API access=403 |
| D-012 | 2026-11-04 | WP-0..WP-3 و acceptance criteria در `IMPLEMENTATION_GATE.md` پیشنهاد شده‌اند، نه authorization برای source change | repo/branch mismatch و approval gates unresolved |

## تصمیم‌های باز برای مالک

- آیا `KarenYar` source رسمی Hesabyar 2.0 است؟
- چگونه توسعه باید با قاعدهٔ شاخهٔ فعال این نشست روی `arena/39118004-hesabyar2` انجام شود، در حالی که source برنامه در repo جداست؟
- آیا HMAC/void/POS money fixes بعد از تصویب TDR به‌عنوان اولین milestone اجرا شوند؟
- آیا Business multi-user حتماً server-authoritative است و Personal همچنان local-first می‌ماند؟
- آیا Pages branch آزمایشی باید build-only بماند یا preview deploy داشته باشد؛ و چه TLS/redirect policy روی host واقعی اعمال می‌شود؟
- چه branch/tag rules، required CI checks و Environment reviewers برای Android signing و release مصوب‌اند؟
