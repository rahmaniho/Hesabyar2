# پیشرفت Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05
**وضعیت کلی:** ممیزی source و طراحی مفهومی انجام شده؛ implementation متوقف تا تأیید مخزن/معماری.

| محدوده | وضعیت | شواهد |
|---|---|---|
| مخزن متصل به نشست | `AUDITED` | `rahmaniho/Hesabyar2` در ابتدا فقط README داشت؛ PR #1 مستندات را merge کرد؛ branch فعال فعلی `arena/147f6490-hesabyar2` است و app code همچنان غایب |
| شناسایی app source | `FOUND / OWNER CONFIRMATION PENDING` | `rahmaniho/karen-soft` به `rahmaniho/KarenYar` ارجاع می‌دهد؛ app ID/name همخوان |
| ممیزی کد app | `COMPLETED_FOR_SNAPSHOT` | source `KarenYar/main@d41ca291...` و فایل‌های کلیدی بررسی شدند |
| تست unit | `PASS` | 47 فایل / 369 تست |
| typecheck/lint/build | `PASS` | هر سه فرمان موفق؛ build warning PDF chunk |
| Android release tests | `PASS` | 35 node tests؛ `release:check` version 1.4.2/code 10402/id را تأیید کرد |
| dependency audit | `ACTION_REQUIRED` | 3 runtime advisory؛ 30 total incl. dev/test |
| E2E | `BLOCKED` | browser نصب نبود؛ rerun نشد |
| production/staging audit | `DEFERRED_BY_USER / NEEDS_ENVIRONMENT_SCOPE` | کاربر وجود سرور cPanel را گزارش و صریحاً گفت فعلاً اتصال/بررسی لازم نیست؛ host و staging/production نامعلوم، هیچ server command اجرا نشده؛ ممیزی static بدون cPanel ادامه می‌یابد |
| GitHub Pages/Android release | `NEEDS_OWNER_VERIFICATION` | Pages API `https_enforced=false` و `custom_domain=null`; Android 1.4.2 فقط test pre-release است و tag build در signing-key validation fail شد |
| CI/CD security | `ACTION_REQUIRED / NEEDS_OWNER_VERIFICATION` | Android/Admin workflow-wide `contents:write` و build code در همان job؛ test/typecheck/lint کامل CI gate نیست؛ branch/tag protection API پاسخ 403 داد |
| Android/Admin security | `NEEDS_ARTIFACT_AND_DEVICE_VERIFICATION` | manifest permissions محدود و allowBackup=false؛ FileProvider root hardening؛ exportها در cache می‌مانند؛ scanner از getUserMedia استفاده می‌کند و Capacitor 8.5.3 permission را bridge می‌کند؛ setup catch ممکن است stream را روشن نگه دارد و detectهای async بالقوه callback تکراری/POS qty اضافه بسازند؛ device test نشده؛ Admin session و PHP runtime نامعلوم |
| architecture docs | `PROPOSED` | `docs/architecture/` ایجاد؛ owner approval pending |
| source code change | `NOT_STARTED` | هیچ فایل برنامه تغییر نکرد |
| migration/deploy | `NOT_STARTED` | هیچ DB، customer data یا production touch نشد |

## گام بعدی

ادامهٔ static audit روی source دقیق، از جمله camera permission/stream cleanup، one-shot barcode callback و merged-manifest/export evidence؛ cPanel connection/server checks به درخواست کاربر فعلاً deferred هستند و در صورت نیاز بعداً scope می‌گیرند. پیش از هر source change، مالک باید `rahmaniho/KarenYar` را به‌عنوان source رسمی و مخزن/branch توسعه را تأیید کند؛ سپس milestone باید scoped و reviewable باشد. پیشنهاد اولیه همچنان اصلاح conversion POS و design/fix `voidInvoice` است؛ HMAC/licensing و ledger changes به approval/spec جدا نیاز دارند.
