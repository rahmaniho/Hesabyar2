# دفتر تصمیم‌های Hesabyar 2.0

| ID | تاریخ | تصمیم/وضعیت | مبنا |
|---|---|---|---|
| D-001 | 2026-11-04 | در ممیزی اولیه source, DB و production تغییر نکند | gate اولیه و مخزن placeholder |
| D-002 | 2026-11-04 | نبود source در `Hesabyar2` به معنی نبود محصول نیست | فقط README در این repo |
| D-003 | 2026-11-04 | از ادعای اجرای مستقل Agency Agents خودداری شود | Arena delegation tool نداشت |
| D-004 | 2026-11-04 | architecture نهایی بدون source/DB ثابت نشود | اطلاعات checkout اولیه ناکافی بود |
| D-005 | 2026-11-04 | GitHub read/write access برای مستندات در branch نشست استفاده شد: push، PR #1 و merge موفق؛ app source/production نوشته نشد | `git push`, `gh pr create`, `gh pr merge` موفق |
| D-006 | 2026-11-04 | M0 روی repo placeholder کامل نیست | source app غایب در مخزن نشست |
| D-007 | 2026-11-04 | `rahmaniho/KarenYar` به‌عنوان source برنامهٔ محتمل برای ممیزی پذیرفته شد، نه هنوز مخزن توسعهٔ مصوب | شرکت در `rahmaniho/karen-soft/docs/hesabyar-release-update.md` آن را source معرفی می‌کند؛ package/app ID همخوان است |
| D-008 | 2026-11-04 | snapshot `KarenYar/main@d41ca291...` read-only در `/tmp` آزمون شد | source suite/build را در isolated copy اجرا کردیم |
| D-009 | 2026-11-04 | Shared Core/edition architecture به‌صورت proposal تهیه شد؛ approval pending | سورس فعلی local-first و فاقد ledger/tenant است |
| D-010 | 2026-11-04 | app source، release artifact، DB و production تغییر نکرد؛ فقط مستندات به branch نشست اضافه و PR #1 merge شد | audit/architecture docs only; code-free PR |
| D-011 | 2026-11-04 | CI least-privilege، protected signing و test gates پیشنهادند؛ workflow تغییر نمی‌کند تا owner approval برسد | ممیزی `CI_SUPPLY_CHAIN_AUDIT.md`; branch/ruleset API access=403 |
| D-012 | 2026-11-04 | WP-0..WP-3 و acceptance criteria در `IMPLEMENTATION_GATE.md` پیشنهاد شده‌اند، نه authorization برای source change | repo/branch mismatch و approval gates unresolved |
| D-013 | 2026-11-04 | پس از merge مستنداتی PR #1، branch فعال آن مرحله `arena/147f6490-hesabyar2` روی `cf086493...` بود؛ app source همچنان در repo نبود | PR #1 merged؛ historical branch state |
| D-014 | 2026-11-04 | Admin Android static review فقط audit finding است؛ persistent session behavior و server enforcement باید staging verification شوند | code evidence in `admin-android/`; live host inaccessible |
| D-015 | 2026-11-05 | کاربر گزارش کرد تیم cPanel server دارد و می‌تواند در صورت نیاز اجرا کند؛ سرور هنوز متصل/شناسایی یا استفاده نشده | `cpanel` connector lookup=`unsupported`; runbook read-only آماده شد |
| D-016 | 2026-11-05 | کاربر گفت cPanel را به خاطر داشته باشیم اما فعلاً اتصال/بررسی server لازم نیست؛ ممیزی read-only برنامه ادامه یابد | ادامهٔ static audit منوط به اتصال cPanel نیست؛ هیچ اتصال یا فرمانی انجام نشود تا scope بعداً خواسته شود |
| D-017 | 2026-11-05 | PR #2 شامل مستندات follow-up در `main` ادغام شد؛ شاخهٔ active آن مرحله `arena/0b07fc58-hesabyar2` بر merge commit `68588c0e...` بنا شده بود | `gh pr merge 2 --merge` موفق؛ PR state=`MERGED` |
| D-018 | 2026-11-05 | PR #3، شامل follow-up ممیزی Android/CI و artifact gates، در `main` ادغام شد؛ شاخهٔ active فعلی نشست `arena/72006e53-hesabyar2` بر merge commit `64cafd61f803f641fabe13d032256a822159859f` بنا شده است | `gh pr merge 3 --merge` موفق؛ PR state=`MERGED` |
| D-019 | 2026-11-05 | معیار پذیرش CI برای Android debug، signed APK/AAB و Admin debug در `ANDROID_ARTIFACT_VERIFICATION_PLAN.md` تهیه شد؛ صرفاً proposal است و هیچ workflow/artifact/signing setting تغییر نکرد | static source/CI findings در CI-06..08 و ADM-04؛ نیازمند approval owner/security پیش از اجرا |

## تصمیم‌های باز برای مالک

- آیا `KarenYar` source رسمی Hesabyar 2.0 است؟
- چگونه توسعه باید با قاعدهٔ شاخهٔ فعال این نشست روی `arena/72006e53-hesabyar2` انجام شود، در حالی که source برنامه در repo جداست؟
- آیا HMAC/void/POS money fixes بعد از تصویب TDR به‌عنوان اولین milestone اجرا شوند؟
- آیا Business multi-user حتماً server-authoritative است و Personal همچنان local-first می‌ماند؟
- آیا Pages branch آزمایشی باید build-only بماند یا preview deploy داشته باشد؛ و چه TLS/redirect policy روی host واقعی اعمال می‌شود؟
- چه branch/tag rules، required CI checks و Environment reviewers برای Android signing و release مصوب‌اند؟
- آیا Admin debug APK باید عمومی pre-release بماند؟ session/cookie cleanup و server-side protection در staging چه policyای دارند؟
- آیا پنل deploy staging نیازمند atomic directory switch و rollback retention است، و چه test rehearsal برای آن مصوب است؟
- در APK release نهایی چه merged permissions, cleartext policy و FileProvider URI grants وجود دارند؟
- خروجی backup/PDF/CSV پس از Share در Android cache چه retention/cleanup policyای باید داشته باشد؟
- cPanel connection/server verification فعلاً به درخواست کاربر deferred است؛ اگر در آینده لازم شد، ابتدا staging/production و مجوز read-only مشخص شود.
