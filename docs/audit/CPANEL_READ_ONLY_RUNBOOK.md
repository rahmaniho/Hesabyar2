# Runbook بررسی read-only در cPanel (فقط staging)

**وضعیت:** آمادهٔ اجرا توسط مدیر مجاز، اما اتصال/بررسی cPanel فعلاً به درخواست کاربر deferred است؛ هنوز روی هیچ سروری اجرا نشده است.
**اطلاع کاربر (2026-11-05):** تیم یک سرور cPanel دارد و در صورت نیاز می‌تواند روی آن اجرا کند. host، محیط و مسیرهای واقعی هنوز مشخص/تأیید نشده‌اند. cPanel connector در Arena پشتیبانی نمی‌شود؛ هیچ credentialی در chat درخواست/ذخیره نشود.

## پیش از اجرا

1. مدیر cPanel ابتدا تأیید کند این مقصد **staging غیر-production** و بدون customer data واقعی است؛ اگر production است، این runbook را اجرا نکنید و scope/approval جدا بگیرید.
2. مسیر واقعی `docroot`, `admin` و artifact را محلی داخل cPanel تعیین کنید؛ مقدارها را در گزارش عمومی/چت نفرستید.
3. این runbook هیچ deploy، POST، SQL، migration، file write یا secret inspection ندارد. فقط metadata، syntax، hashes و HTTP HEAD را می‌سنجد.

## 1) PHP version و extension presence

در cPanel Terminal، با همان PHP CLI که به نسخهٔ MultiPHP staging نزدیک است:

```sh
php -v | head -n 1
php -r 'foreach (["pdo_mysql", "curl", "zip", "openssl"] as $e) { echo $e, "=", extension_loaded($e) ? "on" : "off", PHP_EOL; }'
```

فقط version و `on/off` را ثبت کنید؛ `php -i`, `printenv`, `env`, `phpinfo()` یا محتوای config را اجرا/ارسال نکنید.

## 2) PHP syntax lint (فقط parse، فایل‌ها اجرا نمی‌شوند)

مسیر واقعی staging admin را در shell بگذارید؛ نمونهٔ زیر placeholder است:

```sh
STAGING_ADMIN_DIR='/actual/staging/docroot/admin'
for f in "$STAGING_ADMIN_DIR/index.php" "$STAGING_ADMIN_DIR/issue-license.php" "$STAGING_ADMIN_DIR/deploy-app.php"; do
  php -l "$f" || exit 1
done
```

`php -l` فایل PHP را اجرا نمی‌کند و include خصوصی `bootstrap.php` را evaluate نمی‌کند. خروجی syntax result کافی است؛ path خصوصی را در گزارش نفرستید.

## 3) Compare staging PHP files to audited source (اختیاری)

در صورتی که مدیر مجاز مسیرها را تأیید کرده، hash فایل‌های عمومی staging را با مقدار baseline این commit مقایسه کنید؛ این کار محتوا یا secret را چاپ نمی‌کند:

| فایل | SHA-256 در baseline `d41ca291...` |
|---|---|
| `admin/index.php` | `71eabb9e638e309096d96d59d7e04b2564e866dff30dc8e5db63deab32af5c3e` |
| `admin/issue-license.php` | `6536fe8ca530dda09445adb22e8294e67234660b954f2e6048726f0efe3a91c1` |
| `admin/deploy-app.php` | `eb7081f38c44fb611e01baa977b307f425dca47a3a69624070239b70ae578aaf` |
| `deploy/cpanel-staging/app.htaccess` source template | `0ea074c5df5f17b3afec73a2fc9f48a24e924d59d8ffdecf39f078c2aaaa8692` |

از مسیر تأییدشده:

```sh
sha256sum "$STAGING_ADMIN_DIR/index.php" "$STAGING_ADMIN_DIR/issue-license.php" "$STAGING_ADMIN_DIR/deploy-app.php"
```

اگر `sha256sum` ندارید، گزارش mismatch/ابزار موجود را ثبت کنید؛ فایل را برای چت upload نکنید. Hash mismatch لزوماً دستکاری نیست—ممکن است source/server revision فرق کند؛ اول owner آن را بررسی کند.

## 4) HTTPS response headers (بدون credential و بدون دنبال‌کردن redirect)

پس از تعیین staging host:

```sh
set -o pipefail
STAGING_HOST='approved-staging-host.example'
for path in / /admin/; do
  curl -sS -I --max-time 10 "https://$STAGING_HOST$path" |
    sed -En '
      /^HTTP\//Ip
      /^Strict-Transport-Security:/Ip
      /^Content-Security-Policy:/Ip
      /^X-Content-Type-Options:/Ip
      /^X-Frame-Options:/Ip
      /^Referrer-Policy:/Ip
      /^Location:/I { s/\?.*/?[REDACTED]/; s/#.*/#[REDACTED]/; p }
      /^Set-Cookie:/I { s/(:[[:space:]]*[^=]+=)[^;]*/\1[REDACTED]/; p }
    '
done
```

از `-L` استفاده نکنید تا redirect destination خودکار follow نشود؛ query/fragment در `Location` و value در `Set-Cookie` در نمایش بالا redacted می‌شوند. هیچ `Authorization`, cookie یا Basic-auth credential نفرستید. برای admin endpoint انتظار response بدون credential (مثلاً 401/challenge) را فقط ثبت کنید. Body، headerهای احراز هویت و error trace را منتشر نکنید؛ فقط status، scheme/redirect مقصدِ تأییدشده و cookie attributeها (`Secure`, `HttpOnly`, `SameSite`, `Path`, `Max-Age/Expires`) را به‌صورت value-redacted گزارش کنید.

## ممنوع تا approval جداگانه

- اجرای `deploy-app.php`/POST، upload ZIP، `ZipArchive::extractTo`, migration/DDL، SQL یا delete/overwrite.
- خواندن/چاپ `bootstrap.php`, database credentials, private key, license secret, environment variables, logs حاوی data مشتری، full `phpinfo()` یا admin account.
- هرگونه production login, app deploy، cPanel config change یا customer data test.

## خروجی کم‌خطر برای بازبینی

مدیر می‌تواند فقط این موارد را گزارش کند: محیط `staging/production`, PHP version, extension `on/off`, نتیجهٔ `php -l`، `hash-match/mismatch` به‌ازای فایل، HTTPS status/redirect و cookie attributes پس از حذف valueها. هیچ credential/token/cookie/DB record یا body نفرستد.
