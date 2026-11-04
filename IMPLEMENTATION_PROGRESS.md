# پیشرفت Hesabyar 2.0

**آخرین به‌روزرسانی:** 2026-11-05
**وضعیت کلی:** ممیزی source و طراحی مفهومی انجام شده؛ implementation متوقف تا تأیید مخزن/معماری.

| محدوده | وضعیت | شواهد |
|---|---|---|
| مخزن متصل به نشست | `AUDITED` | `rahmaniho/Hesabyar2` در ابتدا فقط README داشت؛ PRهای #1/#2/#3 اسناد را merge کردند؛ شاخهٔ active نشست `arena/72006e53-hesabyar2` از merge commit PR #3 آغاز شده و app code همچنان غایب است |
| شناسایی app source | `FOUND / OWNER CONFIRMATION PENDING` | `rahmaniho/karen-soft` به `rahmaniho/KarenYar` ارجاع می‌دهد؛ app ID/name همخوان |
| ممیزی کد app | `COMPLETED_FOR_SNAPSHOT` | source `KarenYar/main@d41ca291...` و فایل‌های کلیدی بررسی شدند |
| تست unit | `PASS` | 47 فایل / 369 تست |
| typecheck/lint/build | `PASS` | هر سه فرمان موفق؛ build warning PDF chunk |
| Android release tests | `PASS` | 35 node tests؛ `release:check` version 1.4.2/code 10402/id را تأیید کرد |
| dependency audit | `ACTION_REQUIRED` | 3 runtime advisory؛ 30 total incl. dev/test |
| E2E | `BLOCKED` | browser نصب نبود؛ rerun نشد |
| production/staging audit | `DEFERRED_BY_USER / NEEDS_ENVIRONMENT_SCOPE` | کاربر وجود سرور cPanel را گزارش و صریحاً گفت فعلاً اتصال/بررسی لازم نیست؛ host و staging/production نامعلوم، هیچ server command اجرا نشده؛ ممیزی static بدون cPanel ادامه می‌یابد |
| GitHub Pages/Android release | `NEEDS_OWNER_VERIFICATION` | Pages API `https_enforced=false` و `custom_domain=null`; Android 1.4.2 فقط test pre-release است و tag build در signing-key validation fail شد |
| CI/CD security | `ACTION_REQUIRED / NEEDS_OWNER_VERIFICATION` | Android/Admin workflow-wide `contents:write` و build code در همان job؛ test/typecheck/lint کامل CI gate نیست؛ public `github-test` pre-release verifier دارد ولی Actions artifact پیش از verifier upload می‌شود؛ artifact-only `test-apk` اصلاً verifier ندارد؛ signed-release verifier فقط APK را می‌سنجد، نه AAB؛ Admin APK verification قبل از upload است اما signer subject/debuggable را assert نمی‌کند؛ branch/tag protection API پاسخ 403 داد. [ماتریس پذیرش artifactها](docs/audit/ANDROID_ARTIFACT_VERIFICATION_PLAN.md) به‌عنوان proposal آماده است و approval/implementation نشده |
| Android/Admin security | `NEEDS_ARTIFACT_AND_DEVICE_VERIFICATION` | manifest permissions محدود و allowBackup=false؛ CLI/Android Capacitor 8.5.3 pin هستند؛ CLI مسیر عادی config خام را کپی می‌کند، پس WebView debugging override در config دیده نمی‌شود و `CapConfig` از app flag استفاده می‌کند؛ mixed-content default=false و config `server.cleartext` ندارد؛ public test APK از run `41813070224` با verifier CI روی همان tree قبول شد، اما مستقل دانلود/parse نشد؛ merged permissions و signed release بررسی نشده؛ scanner permission bridge دارد ولی setup catch ممکن است stream را روشن نگه دارد و detectهای async callback تکراری/POS qty بسازند؛ device test نشده؛ Admin session/PHP runtime نامعلوم |
| architecture docs | `PROPOSED` | `docs/architecture/` ایجاد؛ owner approval pending |
| source code change | `NOT_STARTED` | هیچ فایل برنامه تغییر نکرد |
| migration/deploy | `NOT_STARTED` | هیچ DB، customer data یا production touch نشد |

## گام بعدی

static source review برای Android camera permission/stream cleanup، one-shot barcode callback، Capacitor CLI config-copy و مسیر cleartext تکمیل و ثبت شده است. موارد باز، verification روی generated/merged manifest و APKهای مجاز، permission/export/FileProvider و debug/release flags، به‌علاوهٔ camera lifecycle روی device/emulator است؛ این‌ها در این نشست اجرا نشدند. cPanel connection/server checks به درخواست کاربر همچنان deferred است. پیش از هر source change، مالک باید `rahmaniho/KarenYar` را به‌عنوان source رسمی و مخزن/branch توسعه را تأیید کند؛ سپس milestone باید scoped و reviewable باشد. پیشنهاد اولیه همچنان اصلاح conversion POS و design/fix `voidInvoice` است؛ HMAC/licensing و ledger changes به approval/spec جدا نیاز دارند.
