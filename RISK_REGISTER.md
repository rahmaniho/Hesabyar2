# ثبت ریسک Hesabyar 2.0

**تاریخ:** 2026-11-04
**Source baseline:** `rahmaniho/KarenYar/main` commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`. شدت، ریسک بالقوه است؛ هر مورد با وضعیت `NEEDS_VERIFICATION` لزوماً رخداد live نیست.

| ID | ریسک | شدت | شواهد | اقدام کاهشی / گیت |
|---|---|---|---|---|
| R-01 | مخزن نشست `Hesabyar2` فقط README است؛ سورس برنامه در `KarenYar` است | بحرانی | درخت/commit GitHub؛ source candidate از سایت شرکت مستند شده | مالک مخزن رسمی را تأیید کند؛ تغییر کد تا هماهنگی با branch ثابت ممنوع |
| R-02 | live app، production DB و config قابل ممیزی نبودند | بالا | hostهای رسمی خارج allowlist؛ staging access نداریم | staging/read-only evidence؛ بدون secrets یا داده واقعی |
| R-03 | دفترکل دوطرفه/Business accounting در source موجود نیست | بحرانی برای هدف Business | schema فاقد account/journal/period؛ فقط income/expense | طراحی و approval حسابداری پیش از Business UI |
| R-04 | void فروش ردیف income transaction را delete می‌کند | بالا | `invoice.service.ts:605-609`; تست آن را assert می‌کند | تبدیل به reversal قابل ردیابی با migration/rollback/tests |
| R-05 | HMAC license secret در کد/کلاینت و fallback public است | بحرانی برای integrity مجوز | `license-core.ts:108-112`; server path optional | توقف اتکا به KS1 برای صدور جدید؛ Ed25519/server-only؛ compatibility plan |
| R-06 | دیتای local و backup رمزنگاری نشده؛ PIN ثابت/بدون throttling است | بالا برای حریم خصوصی دستگاه | `pin.ts`, `backup.ts`, LockScreen | threat model، backup encryption، PIN migration؛ هیچ کدام بدون approval |
| R-07 | POS تبدیل ریال به تومان را بی‌صدا round می‌کند | بالا/متوسط | `PosPage.tsx` uses `fromDisplayAmount`; `currency.ts:39-42` | استفاده از conversion exact و تست 1..9 rial remainder |
| R-08 | report/customer aggregates با number جمع می‌شوند | متوسط | `store-calc.ts`, `customers-calc.ts` | امن‌سازی جمع‌ها با BigInt/sumMoney و overflow tests |
| R-09 | multi-user/tenant/auth و financial sync وجود ندارد | بحرانی برای Business | source local-only، no financial backend/RBAC | backend/tenant threat model؛ no production data migration before design |
| R-10 | purchase/supplier/AP, multiwarehouse, bank/check workflows missing | بالا | source schema/routes | scope/ledger mappings و incrementally add after core |
| R-11 | npm audit advisory count بالا | بالا | 3 prod advisory; full 30 incl. 3 critical dev/test | advisory triage, pinned safe versions, controlled upgrades; no force fix |
| R-12 | E2E/browser/device behavior در این نشست مستقلاً تأیید نشد | متوسط | browser binaries absent; live site inaccessible | E2E in CI/staging and real-device test evidence |
| R-13 | restore backup کل دیتابیس محلی را جایگزین می‌کند؛ backup cleartext | بالا | `backup.ts:211+`; docs rollback | pre-restore backup/confirmation, encrypted export, restore rehearsal |
| R-14 | PDF build chunk بزرگ است | متوسط | 1,007.39 kB raw / 507.89 kB gzip | code splitting and perf regression test |
| R-15 | XSLX، چاپ واقعی و قواعد payroll/tax رسمی تأیید نشده‌اند | متوسط | XLSX missing; legal values code-only; devices unavailable | scope/official source approval and test matrix |
| R-16 | Agency specialist reports independent نیستند | متوسط | no delegation/subagents in Arena | transparency; external accounting/security review before release |
| R-17 | صفحهٔ محصول لینک Android 1.4.2 را به Pre-release با برچسب NOT FOR STORES می‌دهد | بالا/نیازمند تصمیم owner | product data در `rahmaniho/karen-soft`؛ GitHub release tag آزمایشی است | Release/Owner سطح انتشار و متن عمومی را پیش از ادعای stable تأیید کند |
| R-18 | ادعاهای payroll/دفتر مالی در بازاریابی ممکن است فراتر از دامنهٔ حسابداری فعلی برداشت شوند | متوسط | source payroll دارد، اما نرخ‌ها مستقل قانونی تأیید نشده و ledger دوطرفه نیست | copy با scope واقعی align شود؛ double-entry/قانون کار ادعا نشود بدون شواهد |
| R-19 | GitHub Pages settings/deployment metadata، URL را با `http` و HTTPS enforcement را خاموش گزارش می‌کند، برخلاف CNAME/workflow docs | بحرانی بالقوه تا verification | Pages API: `html_url=http://hesabyar.karen-soft.ir/`, `https_enforced=false`, `custom_domain=null`; آخرین deployment status نیز `environment_url=http://hesabyar.karen-soft.ir/`; live host بررسی نشده | owner Pages/DNS/TLS را reconcile کند؛ live HTTPS, redirect, headers را verify کند؛ تا آن زمان deployment security را تأییدشده ندانیم |
| R-20 | Android tag `v1.4.2` در signing-key validation متوقف شد؛ signed release artifact ساخته نشد | بالا | run `41809043536`؛ آخرین stable release فهرست‌شده `v1.2.5`; 1.4.2 موجود فقط pre-release است | protected signing secrets/config را در CI بررسی و build signed را از نو verify کند؛ کلید خصوصی را افشا نکند |
| R-21 | Pages workflow branch آزمایشی را trigger می‌کند ولی environment policy فقط `main` را مجاز می‌کند | متوسط / نیازمند تأیید انتظار | workflow triggers: `main` و `arena/7c7cf0f8-karenyar`; policy: `main`; run `38646826391` build موفق/deploy ناموفق | owner روشن کند branch آزمایشی باید build-only بماند یا preview deploy داشته باشد؛ policy را بدون تصمیم امنیتی باز نکنند |
| R-22 | Android/admin CI build code را با `contents:write` و credential پایدار checkout اجرا می‌کند | بالا بالقوه | workflow-wide write permissions؛ checkout default `persist-credentials=true`; npm/Gradle اجرا می‌شوند | build کم‌دسترسی، checkout بدون persistence، publish job جدا و token حداقلی |
| R-23 | tag/manual dispatch مسیر signed release دارد ولی approval/ref gate در YAML دیده نشد؛ keystore قبل از npm/build decode می‌شود | بالا تا verification | tag `v*`, dispatch `signed-release`; JKS در GITHUB_ENV به stepهای بعدی می‌رسد؛ ruleset/protection API با 403 قابل بررسی نبود | protected tag/source policy و Environment با reviewer approval را owner تأیید کند؛ keystore را در signing job محدود و در زمان ممکن دیرتر decode کند |
| R-24 | unit/typecheck/lint در workflowهای مشاهده‌شده CI gate نیستند | بالا برای کیفیت مالی | Pages فقط build؛ Android guard tests و build؛ `npm test`/typecheck/lint در workflow دیده نشد | PR CI و required checks برای suite کامل قبل از merge/release |
| R-25 | workflow actions با major tags mutable ارجاع می‌شوند؛ SHA pin مشاهده نشد | متوسط | checkout/setup-node/setup-java/deploy-pages/softprops action tagها | full-SHA pin، review-controlled automation برای update و audit periodical |
| R-26 | Pages build job، pages write و OIDC permission دریافت می‌کند | متوسط | `pages:write` و `id-token:write` در سطح workflow؛ build `npm ci` و rate updater اجرا می‌کند | permissionها per-job؛ build حداقلی، deploy فقط permission لازم |

## اولویت اجرایی پیشنهادی

1. تأیید مخزن/شاخهٔ رسمی و baseline release.
2. اصلاح/طراحی license signing و void/reversal با سازگاری داده.
3. تصویب target ledger و Shared Core.
4. سپس Business backend, tenant/RBAC, purchase/treasury و migration.
5. performance/UX polish پس از correctness/data/security.
