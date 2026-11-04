# ممیزی deployment و انتشار — سورس حساب‌یار 1.4.2

**Source:** `rahmaniho/KarenYar`، main commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** تنظیمات عمومی GitHub/Actions و release metadata؛ هیچ deploy یا production write انجام نشد.

## Web/PWA deployment

- `.github/workflows/pages.yml` روی push به `main` و schedule اجرا می‌شود؛ `npm ci`, `npm run build`, SPA fallback و `actions/deploy-pages` دارد.
- GitHub Actions runs برای `main@d41ca291...` در 2026-11-04 موفق گزارش شدند، از جمله [deploy run `41820955584`](https://github.com/rahmaniho/KarenYar/actions/runs/41820955584) و [scheduled run `41850909227`](https://github.com/rahmaniho/KarenYar/actions/runs/41850909227). این فقط موفقیت workflow است، نه HTTP/browser verification روی host.
- workflow comment می‌گوید برنامه روی `https://hesabyar.karen-soft.ir` منتشر می‌شود و `CNAME` از `public/CNAME` می‌آید؛ در source هم root و `public/CNAME` مقدار دامنه را دارند.
- اما [GitHub Pages settings API](https://api.github.com/repos/rahmaniho/KarenYar/pages) در زمان بررسی این مقادیر را برگرداند: `html_url=http://hesabyar.karen-soft.ir/`, `custom_domain=null`, `https_enforced=false`. status [آخرین deployment موفق (`7549155928`)](https://api.github.com/repos/rahmaniho/KarenYar/deployments/7549155928/statuses) هم `environment_url=http://hesabyar.karen-soft.ir/` داشت. این دو metadata با CNAME/workflow documentation ناسازگارند؛ live host خارج allowlist بود، بنابراین هنوز نتیجه نمی‌گیریم که مرورگر واقعاً از HTTP پاسخ می‌گیرد. Owner باید custom domain/TLS و هدایت HTTP→HTTPS را روی host واقعی بررسی کند.
- [Pages environment policy](https://api.github.com/repos/rahmaniho/KarenYar/environments/github-pages/deployment-branch-policies) فقط branch `main` را مجاز می‌داند، در حالی که `pages.yml` علاوه بر `main` روی `arena/7c7cf0f8-karenyar` نیز trigger می‌شود. [اجرای تاریخی `38646826391`](https://github.com/rahmaniho/KarenYar/actions/runs/38646826391) روی آن branch، build موفق و deploy job ناموفق داشت؛ job deploy step record نداشت، پس علت دقیق معلوم نیست. این می‌تواند عمدی (build-only برای branch آزمایشی) باشد؛ owner باید انتظار را تأیید کند، نه اینکه بی‌درنگ policy را باز کند.
- `vercel.json` هم در repo هست، اما Vercel connector جداشده است و هیچ مدرک فعلی از deploy به Vercel نداریم. وجود config به معنی استفادهٔ واقعی نیست.

## Android release

- GitHub release فهرست می‌کند: `v1.2.5` آخرین stable release؛ Android 1.4.2 در pre-release `android-test-v1.4.2-41813070224-1` با عنوان «آزمایشی / NOT FOR STORES» است.
- tag `v1.4.2` در `e24906ee02b59d8a9250b1bfa7eaf07617a7d3d0` workflow `Build Android APK` را اجرا کرد؛ [run `41809043536`](https://github.com/rahmaniho/KarenYar/actions/runs/41809043536) در گام `Validate and decode release signing key` متوقف شد. workflow در این گام حضور چهار secret لازم و Base64/non-empty بودن keystore را validate می‌کند، اما گرفتن log شکست خورد (`EOF`)، بنابراین علت دقیق مشخص نیست. در هر حالت signed APK/AAB build نشد و برای علت باید owner log/secrets settings را بررسی کند؛ خود secretها در این ممیزی دیده یا افشا نشدند.
- بعداً [run آزمایشی `41813070224`](https://github.com/rahmaniho/KarenYar/actions/runs/41813070224) روی branch `arena/74812266-karenyar`, commit `f724e847b7aa87f7facb8c04be5e27c7473d82a5`, با موفقیت منتشر شد. release برای test/pre-release است، نه store release.
- صفحهٔ محصول در `rahmaniho/karen-soft` به همان test prerelease لینک می‌دهد؛ این احتمالاً beta strategy است، اما owner/release manager باید تأیید کند که این download برای مخاطب عمومی intended است.
- Pipeline fail-closed است: release secrets غایب باشند، signed release build skip/fail می‌شود و debug fallback به‌عنوان release ساخته نمی‌شود. این رفتار مثبت است.

## PHP license staging

- `deploy/cpanel-staging/v1/*` برای `staging.karen-soft.ir` تنظیم شده، POST/OPTIONS، `Cache-Control: no-store`, `nosniff`, origin allowlist، rate limit و parameterized PDO queries در بخش‌های مشاهده‌شده دارد.
- `activations.php` device-count و activation را در DB transaction قفل/ثبت می‌کند؛ `refresh.php` nonce/replay checks دارد؛ `verify.php` Ed25519 token و status server را بررسی می‌کند.
- PHP CLI در sandbox نصب نبود؛ syntax/unit/runtime tests برای PHP اجرا نشدند. فایل `bootstrap.php` حاوی config حقیقی خارج از repo/در محیط خصوصی است و در دسترس نیست؛ سرور staging/production بررسی نشد.

## گیت‌های بعدی

1. Owner تأیید کند URL عمومی از GitHub Pages است یا Vercel/host دیگر.
2. Pages `custom_domain`/HTTPS enforcement را با CNAME source reconcile کنید و TLS/redirect/headers را روی host واقعی بررسی کنید.
3. تصمیم بگیرید Android 1.4.2 test APK باید عمومی لینک شود یا public page باید stable build را ارائه کند؛ در صورت stable release، signing keys صرفاً protected CI secrets.
4. PHP/license service را روی staging به‌صورت authorized security review و با PHP lint/tests واقعی اجرا کنید.

هیچ DNS، GitHub Pages setting، CI secret، release artifact یا server config در این ممیزی تغییر نکرد.
