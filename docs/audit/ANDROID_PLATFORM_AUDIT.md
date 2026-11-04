# ممیزی static پلتفرم Android برنامهٔ اصلی

**مبنای بررسی:** `rahmaniho/KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** Android manifest/configuration سورس و Capacitor؛ APK نهایی، merged manifest، دستگاه واقعی و plugin runtime بررسی نشدند.

## شواهد سورس

- `android/app/src/main/AndroidManifest.xml`، `android/app/build.gradle`, `android/variables.gradle`, `android/app/src/main/res/xml/file_paths.xml` و `capacitor.config.ts` بررسی شدند.
- `applicationId=ir.karensoft.hesabyar`, `minSdk=24`, `targetSdk=36`, `compileSdk=36`; version 1.4.2/code 10402.
- Manifest مستقیم فقط `INTERNET` و `CAMERA` درخواست می‌کند؛ camera feature با `required=false` است.
- `allowBackup=false`; launcher activity exported است و فقط intent filter `MAIN`/`LAUNCHER` دارد؛ FileProvider `exported=false`, `grantUriPermissions=true` است.
- Capacitor برای Android scheme از `https` استفاده می‌کند؛ `MainActivity` فقط `BridgeActivity` را extend می‌کند.
- Release build در Gradle `debuggable=false` و signing config جدا دارد؛ CI workflowهای آزمایشی debug APK تولید می‌کنند و آن را NOT FOR STORES برچسب می‌زنند.

## ارزیابی و موارد نیازمند verification

### AND-01 — FileProvider یک root گسترده دارد، اما call-site مشاهده‌شده cache-scoped است (کم؛ hardening)

`file_paths.xml` دو root تعریف می‌کند: `external-path path="."` و `cache-path path="."`. Provider non-exported است و URI grant لازم دارد، پس صرف تعریف external root اثبات نشت فایل نیست. جست‌وجوی source در commit دقیق فقط `src/core/utils/file-save.ts` را به‌عنوان Filesystem/Share call-site نشان داد؛ آن خروجی را با `Directory.Cache` می‌نویسد و URI همان فایل را برای share می‌دهد. بنابراین call-site موجود به `cache-path` مربوط است؛ هیچ app call-site برای `external-path` دیده نشد. رفتار dependency/plugin نهایی و grantهای APK binary در این ممیزی بررسی نشدند.

**پیشنهاد:** تأیید کنید Capacitor Share/دیگر pluginها به `external-path` نیاز دارند؛ اگر نه، root را حذف یا محدود کنید؛ APK واقعی را برای read-only URI grant فقط به فایل cache انتخابی تست کنید.

### AND-02 — cleartext policy صریح در app manifest دیده نشد (سخت‌سازی؛ نه vulnerability اثبات‌شده)

در manifest برنامه `android:usesCleartextTraffic` یا `android:networkSecurityConfig` دیده نشد؛ Capacitor scheme محلی روی `https` است و target SDK 36 اعلام شده. رفتار پیش‌فرض Android برای targetهای جدید معمولاً cleartext را محدود می‌کند، اما merged manifest، plugin overrides و APK runtime در این نشست بررسی نشدند. از نبود صفت در manifest به‌تنهایی HTTP traffic نتیجه نمی‌گیریم.

**پیشنهاد:** merged manifest و APK با `aapt`/`apkanalyzer` بازبینی شود؛ cleartext فقط در صورت نیاز صریح block و با تست URLهای داخلی/remote تأیید شود.

### AND-03 — `allowBackup=false` مفید است، اما رمزنگاری داده نیست

این flag Android auto-backup را غیرفعال می‌کند؛ آن را با encryption of IndexedDB/backup اشتباه نگیرید. برنامه backup JSON مستقل دارد و audit قبلی آن را cleartext دانسته است؛ حفاظت فایل خروجی و restore همچنان باید جداگانه طراحی شود.

### AND-04 — خروجی‌های حساس در app cache پاک‌سازی صریح ندارند (متوسط؛ نیازمند تأیید سیاست)

[`src/core/utils/file-save.ts:37-55`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/utils/file-save.ts#L37-L55) Blob را با `Filesystem.writeFile(..., Directory.Cache)` ذخیره و همان URI را برای `Share.share` می‌فرستد؛ پس از برگشت Share، `Filesystem.deleteFile` صدا زده نمی‌شود. در `catch` نیز error نادیده گرفته می‌شود و comment می‌گوید فایل cache باقی می‌ماند. Call-siteها شامل [backup JSON](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/db/backup.ts#L249)، [CSV](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/utils/csv.ts#L24)، [invoice PDF](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/features/store/invoice-pdf.ts#L832) و [payroll PDF](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/features/payroll/payroll-pdf.ts#L378) هستند. بنابراین اگر کاربر share را ببندد یا plugin خطا دهد، فایل—از جمله backup حاوی DB—تا پاک‌سازی OS/app می‌تواند در cache خصوصی برنامه بماند. `allowBackup=false` جلوی این cache را نمی‌گیرد و encryption هم ایجاد نمی‌کند. [`file-save.test.ts`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/utils/file-save.test.ts) فقط web download path را تست می‌کند؛ native cache/share cleanup test مشاهده نشد.

**پیشنهاد:** retention policy روشن (TTL/پاک‌سازی پس از share با توجه به lifecycle chooser، یا پیام شفاف دربارهٔ ماندن فایل)، خطا را از cancel واقعی جدا کنید و روی دستگاه cancel/restart/space-error و cleanup را تست کنید. تغییر نباید فایل انتخاب‌شده را پیش از تکمیل share حذف کند.

### AND-05 — source manifest به‌تنهایی permission set نهایی APK را ثابت نمی‌کند

`capacitor.settings.gradle` ماژول‌های `@capacitor/app`, `filesystem`, `share`, `status-bar` را فهرست می‌کند؛ نسخه‌های قفل‌شده در `package-lock.json` به‌ترتیب 8.1.2، 8.1.4، 8.0.3، 8.0.4 هستند و `@capacitor/android` روی 8.5.3 است. AndroidManifest منتشرشدهٔ این پنج package در نسخه‌های دقیق lockfile فقط تگ خالی `<manifest>` دارد؛ بنابراین در manifest خود این pluginها permission اضافه‌ای declare نشده است. با این شاهد، احتمال permission اضافه از این plugin manifestها پایین‌تر می‌آید.

اما Android Gradle merge و manifestهای dependencyهای transitive اجرا نشدند؛ `settings.gradle` همچنین به ماژول generated `capacitor-cordova-android-plugins` اشاره می‌کند که در snapshot codeload موجود نبود. در CI runهای مشاهده‌شده permission audit نهایی روی APK (`aapt dump permissions`) به‌عنوان gate ثبت نشد. پس یافته فقط source/package-level است و فهرست مؤثر APK نهایی همچنان `NEEDS_VERIFICATION` است.

### AND-06 — Scanner از WebView camera API استفاده می‌کند؛ Capacitor مجوز را bridge می‌کند، اما رفتار واقعی تست نشده

[`BarcodeScannerDialog.tsx`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/components/BarcodeScannerDialog.tsx#L65-L103) وجود `window.BarcodeDetector` و `navigator.mediaDevices.getUserMedia` را بررسی و فقط video environment را درخواست می‌کند (`audio:false`); اگر API موجود نباشد یا خطا دهد، ورود دستی در UI هست. پروژه Capacitor Camera plugin نصب نکرده؛ CAMERA permission مستقیم برای همین WebView flow موجود است.

`package-lock.json`، `@capacitor/android@8.5.3` را pin می‌کند؛ `Bridge.java` و `BridgeWebChromeClient.java` در tarball همین نسخه با فایل‌های GitHub tag `8.5.3` byte-for-byte مقایسه و برابر شدند. در [Capacitor tag 8.5.3، Bridge.java](https://github.com/ionic-team/capacitor/blob/8.5.3/android/capacitor/src/main/java/com/getcapacitor/Bridge.java#L280)، `BridgeWebChromeClient` نصب می‌شود؛ [onPermissionRequest](https://github.com/ionic-team/capacitor/blob/8.5.3/android/capacitor/src/main/java/com/getcapacitor/BridgeWebChromeClient.java#L101-L124) درخواست `VIDEO_CAPTURE` را به Android `CAMERA` runtime permission وصل می‌کند و پس از نتیجه grant/deny می‌دهد. بنابراین در source، bridge دوربین وجود دارد؛ این یافته، نبود permission handler را اثبات نمی‌کند.

با این حال Android System WebView version، secure-context runtime، `BarcodeDetector` support، prompt/deny/revoke و دستگاه واقعی تست نشدند؛ fallback دستی مسیر جایگزین است. ثبت source-level bridge به‌تنهایی کارکرد اسکن را ثابت نمی‌کند.

### AND-07 — خطای setup می‌تواند camera stream را تا بسته‌شدن dialog فعال نگه دارد (کم تا متوسط؛ source-level privacy risk)

در همان component، `stop()` مسیر trackها را متوقف می‌کند و بعد از تشخیص بارکد و در cleanup زمان بستن/unmount فراخوانی می‌شود. اما پس از `getUserMedia`، stream در `streamRef` ذخیره می‌شود؛ اگر `videoRef.current` خالی باشد تابع زود برمی‌گردد، و اگر `video.play()` یا ساخت `BarcodeDetector` throw کند، `catch` فقط status را به `denied` می‌برد و `stop()` را صدا نمی‌زند. در این مسیر، تا وقتی dialog باز بماند، stream ممکن است فعال بماند. دسترسی اولیه همچنان با اقدام کاربر/مجوز camera است؛ هیچ رخداد live یا فعال‌سازی از راه دور اثبات نشده.

**پیشنهاد:** همهٔ خطاهای پس از دریافت stream را با cleanup یکسان جمع کنید (`track.stop()`, clear کردن `srcObject`) و خطای runtime را از permission denial جدا کنید؛ تست مجاز باید `play()`/constructor failure، close، deny/revoke و توقف indicator دوربین را پوشش دهد. تست اختصاصی component در source پیدا نشد؛ این مورد static review است، نه اجرای failure روی device.

### AND-08 — اسکن async ممکن است callback بارکد را بیش از یک‌بار فراخوانی کند (متوسط؛ نیازمند device/component test)

`BarcodeScannerDialog.tsx:87-100` هر 350ms یک `setInterval(async ...)` اجرا می‌کند؛ هیچ in-flight/one-shot guard برای جلوگیری از هم‌پوشانی `detector.detect()` وجود ندارد. `cancelled` فقط پیش از `await detector.detect(...)` بررسی می‌شود، نه بعد از آن. وقتی اولین نتیجه می‌رسد، `stop()` interval و camera track را می‌بندد، اما Promiseهای detect در حال اجرا لغو نمی‌شوند و ممکن است بعداً همان barcode را دوباره به `onDetectedRef` بدهند؛ بستن dialog نیز فقط `cancelled` را تغییر می‌دهد و callback پس از await دوباره آن را نمی‌سنجد.

اثر مستقیم در POS مهم است: [`PosPage.tsx:185-210`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/features/store/PosPage.tsx#L185-L210) هر بار callback، کالای موجود در basket را یک واحد زیاد می‌کند؛ store مقدار فعلی را sync می‌خواند و set می‌کند. بنابراین اگر چند detect Promise برای یک اسکن resolve شوند، draft ممکن است چند واحد اضافه کند و اگر cashier متوجه نشود همان تعداد در فاکتور ثبت شود. ثبت مالی هنوز به مرحلهٔ تأیید cashier وابسته است؛ تکرار واقعی روی device مشاهده/آزموده نشده و این یک ریسک شرطی source-level است.

**پیشنهاد:** scan را serialize یا one-shot کنید، پس از هر `await` وضعیت cancelled/detected را دوباره بررسی کنید، و callback موفق را با latch یک‌بارمصرف محافظت کنید. تست با detector mock کند باید تضمین کند برای یک بارکد دقیقاً یک callback رخ دهد و پس از close هیچ callback دیررس نرسد. تست اختصاصی scanner در snapshot پیدا نشد.

## کنترل‌های مثبت

- permissionهای مستقیم کم هستند؛ camera optional و manual barcode fallback توصیف شده؛ source پین‌شدهٔ Capacitor، runtime `VIDEO_CAPTURE` را به `CAMERA` permission وصل می‌کند.
- FileProvider export نشده؛ call-site مشاهده‌شدهٔ `saveBlob` فایل را در `Directory.Cache` می‌نویسد و همان URI را share می‌کند؛ intent filter عمیق/وبی روی activity دیده نشد.
- Android backup خاموش است؛ release build در Gradle non-debuggable تنظیم شده.
- scheme محلی Capacitor `https` است، اما این به‌تنهایی TLS برای remote host یا data-at-rest encryption را اثبات نمی‌کند.

## آزمون‌های مجاز بعدی

روی APK متعلق به build مصوب و دستگاه/emulator مجاز: merged manifest/permission diff، exported components، cleartext test، FileProvider URI grants، app backup behavior/restore، camera allow/deny/revoke، BarcodeDetector fallback و توقف track پس از setup error/بستن dialog. تست دستگاه واقعی و APK binary در این ممیزی اجرا نشدند؛ هیچ APK یا تنظیمی تغییر نکرد.
