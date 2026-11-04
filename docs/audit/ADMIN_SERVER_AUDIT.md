# ممیزی static پنل Admin و deployment staging

**مبنای بررسی:** `rahmaniho/KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** static review از `deploy/cpanel-staging/admin/{index,issue-license,deploy-app}.php` و `app.htaccess`. سرور staging/production، config خصوصی یا دیتابیس اجرا نشدند.
**اطلاع کاربر (2026-11-05):** یک سرور cPanel در اختیار تیم است و در صورت نیاز می‌توان روی آن اجرا کرد. این سرور هنوز از این sandbox متصل/شناسایی نشده؛ معلوم نیست همان staging این repo است یا production، و هیچ فرمانی روی آن اجرا نشده است. کاربر بعداً تصریح کرد اتصال/بررسی سرور فعلاً لازم نیست؛ این ممیزی static بدون cPanel ادامه دارد.

- [پنل و عملیات دستگاه](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/deploy/cpanel-staging/admin/index.php)
- [صدور مجوز](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/deploy/cpanel-staging/admin/issue-license.php)
- [deploy staging](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/deploy/cpanel-staging/admin/deploy-app.php)
- [Runbook read-only cPanel (staging)](CPANEL_READ_ONLY_RUNBOOK.md)

## کنترل‌های مثبت مشاهده‌شده در source

- هر سه admin endpoint فایل خصوصی `bootstrap.php` را از بیرون repo می‌خوانند، `KAREN_ENV !== 'staging'` را reject می‌کنند و در نبود web-server identity (`REMOTE_USER`/معادل) پاسخ 401 می‌دهند. خود `bootstrap.php` در repo نیست؛ مسیر حقیقی/محتوایش بررسی نشد.
- responseها `Cache-Control: no-store`, `nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY` می‌گذارند؛ admin pages برای inline style از nonce و CSP محدودکننده استفاده می‌کنند.
- session cookie در source با `Secure`, `HttpOnly`, `SameSite=Strict` و lifetime صفر تعریف می‌شود. POSTها CSRF token تصادفی session را با `hash_equals` validate می‌کنند.
- rate limiting برای revoke/reactivate، صدور license و deploy وجود دارد؛ عددهای مسیرهای source به‌ترتیب 60، 20 و 5 درخواست در 300 ثانیه‌اند. کارکرد واقعی limiter به bootstrap/config وابسته است و live اثبات نشد.
- `index.php` و `issue-license.php` در queryهای قابل مشاهده prepared statement و در تغییر مالی/مجوز transaction دارند؛ صفحات مقدارهای HTML را escape می‌کنند. ایجاد license ورودی‌ها را محدود و activation code را فقط به‌صورت hash در DB ثبت می‌کند؛ نمایش اولیه از session flash است.
- deploy script فقط در staging مجاز است، artifact از URL ثابت GitHub می‌گیرد، SHA-256 pin را قبل از extract می‌سنجد، در cURL مسیر TLS peer/host verification روشن است، نام‌های entryهای ZIP با traversal patterns ابتدایی چک می‌شوند و فایل موقت در `finally` حذف می‌شود.
- کنترل hash این نشست روی artifact منبع موفق بود: branch `arena/1bdeff0a-karenyar` در API به commit `1d54bf4ee9cbd7b0939e9d3c88ff3232e7383800` اشاره داشت؛ Git blob artifact `deeb93a863c4d9bdcede0b9dc5a50fd77dd88682`, size `1,416,414` bytes بود و محاسبهٔ SHA-256 با مقدار ثابت داخل deploy script مطابق شد. GitHub branch API `protected=false` گزارش کرد؛ این flag به‌تنهایی وجود ruleset جایگزین را رد نمی‌کند.

## یافته‌ها / موارد نیازمند verification

### ADM-SRV-01 — deploy به‌صورت in-place انجام می‌شود، نه atomic release (متوسط برای staging)

`deploy-app.php` پس از hash verification، `ZipArchive::extractTo($targetDir)` را مستقیماً روی پوشهٔ `app` اجرا می‌کند؛ UI نیز می‌گوید فایل‌ها روی نسخهٔ قبلی نوشته می‌شوند. در source، directory swap اتمیک، snapshot/rollback خودکار یا پاک‌سازی کنترل‌شدهٔ artifactهای قدیمی مشاهده نشد. اگر استخراج/نوشتن وسط کار fail شود، staging ممکن است ترکیبی از دو نسخه را ارائه کند؛ اثر واقعی به filesystem و traffic وابسته و اجرا نشده است.

**پیشنهاد:** ابتدا extract به release directory جدید، validate کامل، سپس atomic pointer/symlink swap و حفظ نسخهٔ قبلی برای rollback؛ یا تا تصویب چنین روشی، deploy staging فقط در maintenance window و با snapshot قبلی. این endpoint در source به `staging` محدود است؛ هیچ‌کدام را به production تعمیم ندهید.

### ADM-SRV-02 — ZIP validation حداقلی است (کم/متوسط؛ hash-pinned artifact ریسک را کم می‌کند)

قبل از extract، source نام خالی، هر path حاوی `..` و pathهای absolute با `/` یا `\` را رد می‌کند و وجود `index.html` را می‌سنجد؛ سپس `extractTo` را به‌کار می‌برد. محدودیت صریح تعداد entry، مجموع uncompressed size، symlink/special-file policy یا content allowlist در قطعهٔ مشاهده‌شده نبود. چون artifact و hash در PHP ثابت‌اند، حمله از ZIP دلخواه user در این path مشاهده نشد؛ سخت‌سازی دفاعی و review artifact provenance همچنان مناسب است.

### ADM-SRV-03 — session id rotation در endpointها مشاهده نشد (نیازمند verification)

فایل‌های admin پس از بررسی web-server identity session را شروع و CSRF state می‌سازند، اما در فایل‌های بررسی‌شده `session_regenerate_id()` دیده نشد. `bootstrap.php`، تنظیم `session.use_strict_mode`، رفتار cPanel Directory Privacy و cookie/sessionهای زنده در دسترس نبودند؛ بنابراین session fixation را آسیب‌پذیری اثبات‌شده نمی‌نامیم. Owner/security باید login/session lifecycle و rotate/revoke behavior را در staging بررسی کند.

### ADM-SRV-04 — fallback دانلود به `file_get_contents` explicit TLS policy ندارد (کم؛ environment-dependent)

مسیر cURL، `CURLOPT_SSL_VERIFYPEER=true` و `CURLOPT_SSL_VERIFYHOST=2` دارد. در fallback `allow_url_fopen`, context، scheme HTTPS ثابت است ولی گزینه‌های `ssl.verify_peer`/`verify_peer_name` صریحاً در همان context تنظیم نشده‌اند؛ پیش‌فرض PHP معمولاً verification را روشن می‌کند، اما config سرور در دسترس نیست. بهتر است peer/host verification در fallback هم صریح و fail-closed باشد.

## حدود

- PHP CLI در sandbox موجود نبود؛ PHP syntax lint، unit/integration tests و runtime checks اجرا نشدند.
- `bootstrap.php`, cPanel `.htaccess` واقعی/admin credentials، TLS/headers، storage, DB permissions, logs و endpointهای staging/production بررسی نشدند.
- این repo فقط staging deployment code را نشان می‌دهد؛ وجود/رفتار production deployment از آن نتیجه‌گیری نمی‌شود.
- هیچ artifact، config، staging, production یا DB تغییر نکرد.
