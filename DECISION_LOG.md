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
| D-020 | 2026-11-05 | GitHub Actions API metadata برای test APKهای runs `41813070224`, `41645205606` و Admin run `41274386135` نام/اندازه/expiry را گزارش می‌کند؛ این metadata محتوا یا access policy را اثبات نمی‌کند و run `41645205606` پیش از source baseline فعلی است | read-only API/workflow/job metadata؛ archiveها دانلود/parse نشدند |
| D-021 | 2026-11-05 | کاربر ساخت greenfield app در `Hesabyar2` را برای shell/UI prototype با mock data مجاز کرد؛ این مجوز شامل حسابداری/تراکنش، persistence/DB، backend/auth، licensing، migration، import از `KarenYar` یا release نیست | انتخاب صریح کاربر هنگام شروع UI؛ branch آن مرحله `arena/973fe290-hesabyar2` |
| D-022 | 2026-11-05 | PR #5 greenfield UI shell را در `main` ادغام کرد؛ شاخهٔ فعال آن نشست `arena/49664ebd-hesabyar2` بر merge commit `a8e55e1e4cc8f17ba6f8b1a9b3452f7b12d28d06` بنا شده بود | `gh pr merge 5 --merge` موفق؛ source اصلی `KarenYar` منتقل نشد |
| D-023 | 2026-11-05 | PR #6 فرم افزودن مشتری نمونه را با state موقت React ادغام کرد؛ branch آن مرحله `arena/b19a8f51-hesabyar2` و جزئیات مشتری در PR #7 فقط‌خواندنی بود | `gh pr merge 6 --merge` موفق؛ هیچ persistence یا منطق مالی اضافه نشد |
| D-024 | 2026-11-05 | PR #7 جزئیات مشتری نمونه را به `main` افزود؛ شاخهٔ فعال آن مرحله `arena/622c2021-hesabyar2` فیلتر وضعیت را فقط روی ردیف‌های نمایشی اعمال کرد | `gh pr merge 7 --merge` موفق؛ source اصلی `KarenYar`، persistence و منطق مالی تغییر نکردند |
| D-025 | 2026-11-05 | PR #8 فیلتر مشتری نمونه را در `main` ادغام کرد؛ شاخهٔ فعال آن مرحله `arena/e38db981-hesabyar2` سری‌های ثابت و mock نمودار را بر اساس بازهٔ انتخابی نمایش داد | `gh pr merge 8 --merge` موفق؛ هیچ دادهٔ واقعی یا محاسبهٔ مالی اضافه نشد |
| D-026 | 2026-11-05 | PR #9 تعامل mock نمودار را به `main` افزود؛ شاخهٔ فعال آن مرحله `arena/cd2e7fc5-hesabyar2` جزئیات فاکتور نمونه را به‌صورت فقط‌خواندنی نمایش می‌داد | `gh pr merge 9 --merge` موفق؛ فاکتور فقط از static mock row خوانده می‌شود و هیچ پرداخت/محاسبه/تغییری انجام نمی‌شود |
| D-027 | 2026-11-05 | PR #10 جزئیات فاکتور و اقلام ثابت آن را به `main` افزود؛ شاخهٔ فعال فعلی `arena/a1600dfc-hesabyar2` ادامهٔ مجاز UI prototype را با جزئیات فقط‌خواندنی کالای نمونه در جدول انبار و داشبورد انجام می‌دهد | merge commit PR #10 برابر `88f3fe6456b80c5e1f584112573fbb17744a37aa`; همهٔ کالاها/قیمت‌ها/موجودی‌ها mock هستند و هیچ محاسبه، تغییر، خرید، فروش یا persistence اضافه نشده است |
| D-028 | 2026-11-05 | در ادامهٔ mock-only، فیلترهای وضعیت فهرست فاکتور، گردش، مشتری و کالا در PR #11 تعمیم داده شدند؛ منطق فقط ردیف‌های همان نمونه را موقتاً پنهان/نمایان می‌کند | ۱۵ تست UI پوشش فیلترها و بازگرداندن فهرست را دارند؛ هیچ داده، مبلغ، موجودی یا تراکنشی تغییر نمی‌کند |
| D-029 | 2026-11-05 | کاربر `Hesabyar2` را source greenfield و Shared Core را هدف سطح‌بالا انتخاب کرد؛ WP‑1 ورودی پول به‌عنوان اولین بسته انتخاب شد، با واحد صریح ریال/تومان، عدد صحیح مثبت، حفظ remainder بدون rounding، رد صفر/منفی و رقم فارسی/لاتین | انتخاب‌های صریح کاربر در همین نشست؛ refund flow، transaction posting، limit، backend، architecture details و production هنوز خارج از تصمیم‌اند |
| D-030 | 2026-11-05 | helper مستقل `src/domain/money.ts` برای WP‑1 با BigInt و نمایش دقیق `۱۱ ریال → ۱ تومان و ۱ ریال` افزوده شد؛ به POS، ledger یا persistence وصل نیست | ۸ unit tests جدید؛ قرارداد helper فقط input parsing/formatting است، نه accounting engine یا transaction flow |
| D-031 | 2026-11-05 | برای WP‑0، `.github/workflows/ci.yml` با `contents: read` و actionsهای pin‌شده به SHA، `npm ci`, tests, typecheck, build و `npm audit --audit-level=low` افزوده شد؛ فقط PR و push به `main`/`arena/**` را می‌سنجد و هیچ deploy/sign/release ندارد | اجرای GitHub روی PR #11 هنوز pending؛ lint script/config ندارد و branch protection/required checks تغییر نکرده‌اند |

## تصمیم‌های باز برای مالک

- `Hesabyar2` برای توسعهٔ greenfield انتخاب شده؛ آیا/چه زمانی باید با legacy data یا رفتارهای `KarenYar` سازگار شود یا migration داشته باشد؟
- Shared Core هدف سطح‌بالاست؛ مرز دقیق Personal/Business، local-first/server-authoritative و backend هنوز باید با ADR مشخص شود.
- WP‑1 helper مستقل شروع شده؛ پیش از اتصال به POS به WP-0 CI/QA و تعیین maximum transaction amount/validation contract برای application flow نیاز است.
- برای WP‑2 reversal، ledger/posting و WP‑3 Business Accounting چه مدل‌ها و قواعد domain مصوب شوند؟
- آیا Pages branch آزمایشی باید build-only بماند یا preview deploy داشته باشد؛ و چه TLS/redirect policy روی host واقعی اعمال می‌شود؟
- چه branch/tag rules، required CI checks و Environment reviewers برای Android signing و release مصوب‌اند؟
- آیا Admin debug APK باید عمومی pre-release بماند؟ session/cookie cleanup و server-side protection در staging چه policyای دارند؟
- آیا پنل deploy staging نیازمند atomic directory switch و rollback retention است، و چه test rehearsal برای آن مصوب است؟
- در APK release نهایی چه merged permissions, cleartext policy و FileProvider URI grants وجود دارند؟
- خروجی backup/PDF/CSV پس از Share در Android cache چه retention/cleanup policyای باید داشته باشد؟
- cPanel connection/server verification فعلاً به درخواست کاربر deferred است؛ اگر در آینده لازم شد، ابتدا staging/production و مجوز read-only مشخص شود.
