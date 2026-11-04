# شواهد منبع، مخزن و اجرای ممیزی

**تاریخ جمع‌آوری:** 2026-11-04 UTC
**مخزن متصل این نشست:** `https://github.com/rahmaniho/Hesabyar2`
**سورس برنامهٔ شناسایی‌شده:** `https://github.com/rahmaniho/KarenYar`
**مخزن وب‌سایت شرکت:** `https://github.com/rahmaniho/karen-soft`

## `Hesabyar2` در نشست

- شاخه جاری: `arena/39118004-hesabyar2`; commit مبنا `38aedc6e1c1ea97fbe0b7b95ddf3fa8436955c05`، پیام `Initial commit`.
- `git ls-tree -r --name-only HEAD` و GitHub API درخت `main` فقط `README.md` را نشان دادند؛ محتوا `# Hesabyar2` است.
- مخزن عمومی است؛ در زمان بررسی فقط شاخهٔ `main`، بدون tag، PR یا release داشت.
- نتیجه: این مخزن منبع کد برنامه نیست، مگر اینکه مالک آن را عمداً بعداً خالی کرده باشد.

## شناسایی مخزن واقعی برنامه

- در `rahmaniho/karen-soft`, commit `24056725c5f27000160e7a631043d46672592618`, فایل `docs/hesabyar-release-update.md` منبع APK حساب‌یار را `rahmaniho/KarenYar` اعلام می‌کند.
- `rahmaniho/KarenYar` مخزن عمومی با default branch `main` است؛ commit بررسی‌شده `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`, تاریخ `2026-11-04T11:26:59Z`.
- `package.json`: `name=karenyar-hesabyar`, `version=1.4.2`؛ `capacitor.config.ts`: `appId=ir.karensoft.hesabyar`.
- tag `v1.4.2` در `e24906ee02b59d8a9250b1bfa7eaf07617a7d3d0` است؛ ممیزی روی `main` بعد از merge و همان نسخهٔ package انجام شد.
- snapshot دقیق commit از codeload به `/tmp` دریافت و read-only بررسی شد. فایل‌ها/branchهای هیچ مخزن upstream تغییر نکردند.

## آزمون‌هایی که واقعاً در این نشست اجرا شدند

روی snapshot دقیق `KarenYar/main`، پس از `npm ci --ignore-scripts --no-audit --no-fund`:

- `npm test`: 47 فایل و 369 تست موفق.
- `npm run typecheck`: موفق.
- `npm run lint`: موفق.
- `npm run build`: موفق، با هشدار chunk بزرگ PDF.
- `npm run test:android-release`: 35 تست موفق.
- `npm run release:check`: نسخه 1.4.2، code 10402، application ID `ir.karensoft.hesabyar`.
- `npm audit --omit=dev`: 3 advisory؛ `npm audit`: 30 advisory. هیچ fix اجرا نشد.
- E2E Playwright اجرا نشد: Chromium/Chrome نصب یا در cache نبود.

## شواهد deployment/release از GitHub

- `gh run list` نشان داد Pages deploy برای `main@d41ca291...` در runs `41820955584` و `41850909227` موفق بوده است؛ این build/deploy status است، نه آزمایش HTTP زنده.
- `gh api repos/rahmaniho/KarenYar/pages` در زمان بررسی `html_url=http://hesabyar.karen-soft.ir/`, `custom_domain=null`, `https_enforced=false` گزارش کرد؛ source هم‌زمان root و `public/CNAME` با `hesabyar.karen-soft.ir` دارد.
- آخرین Pages deployment `7549155928` از `main@d41ca291...` success بود؛ deployment status نیز `environment_url=http://hesabyar.karen-soft.ir/` داد. این GitHub metadata است، نه اثبات HTTP response زنده.
- Pages workflow branchهای `main` و `arena/7c7cf0f8-karenyar` را trigger می‌کند، اما deployment-branch-policy فقط `main` را می‌پذیرد. اجرای تاریخی `38646826391` روی branch آزمایشی build موفق/deploy ناموفق داشت؛ علت از metadata روشن نیست.
- `gh run view 41809043536` نشان داد tag `v1.4.2` در گام تأیید/بازکردن release signing key fail شد و signed APK/AAB build نشد. بازیابی log با خطای `EOF` ناموفق بود؛ بنابراین علت دقیق (secret غایب/نامعتبر یا keystore format) تأیید نشده است.
- run `41813070224` روی `arena/74812266-karenyar` با build آزمایشی موفق شد؛ `gh release list` آن را pre-release NOT FOR STORES می‌خواند؛ آخرین stable release ثبت‌شده `v1.2.5` است.
- در commit دقیق، `.github/workflows/` فقط `admin-android.yml`, `android.yml`, `pages.yml` دارد؛ هیچ workflowای با `pull_request` trigger دیده نشد. Android/Admin `contents:write` را workflow-wide می‌دهند؛ Pages نیز `pages:write` و `id-token:write` را workflow-wide دارد.
- `pages.yml` build/deploy می‌کند، Android workflow `test:android-release` را اجرا می‌کند، اما در سه workflow مشاهده‌شده `npm test`, typecheck و lint gate نیستند. `admin-android.yml` debug APK و prerelease را تولید می‌کند.
- `gh api repos/rahmaniho/KarenYar/rulesets` و branch-protection endpoint پاسخ 403 `Resource not accessible by integration` دادند؛ تنظیمات protection قابل تأیید/رد نبودند.
- `.github/` در commit فقط directory `workflows/` دارد؛ `.github/dependabot.yml` مشاهده نشد. این فقط یافتهٔ مخزن است و تنظیمات بیرونی/سازمانی را رد نمی‌کند.

## حدود شواهد

سایت/اپ زنده، production database، logs، configuration secrets، license server واقعی، backup مشتری، دستگاه Android واقعی و چاپگر فیزیکی بررسی نشدند. hostهای `karen-soft.ir` و `hesabyar.karen-soft.ir` در allowlist این sandbox نیستند. بررسی کد `KarenYar` نمی‌تواند وضعیت deployment یا دادهٔ مشتری را ثابت کند.
