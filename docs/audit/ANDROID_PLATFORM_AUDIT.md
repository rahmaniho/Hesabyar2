# ممیزی static پلتفرم Android برنامهٔ اصلی

**مبنای بررسی:** `rahmaniho/KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** بررسی static Android manifest/config و Capacitor، به‌علاوهٔ metadata و guardهای GitHub CI. APK عمومی آزمایشی 1.4.2 از run `41813070224` در verifier همان workflow قبول شد؛ اما خود binary در این نشست مستقل دانلود/parse نشد، و merged manifest، permissionهای مؤثر و رفتار دستگاه/plugin بررسی نشدند.

## شواهد سورس

- `android/app/src/main/AndroidManifest.xml`، `android/app/build.gradle`, `android/variables.gradle`, `android/app/src/main/res/xml/file_paths.xml` و `capacitor.config.ts` بررسی شدند.
- `applicationId=ir.karensoft.hesabyar`, `minSdk=24`, `targetSdk=36`, `compileSdk=36`; version 1.4.2/code 10402.
- Manifest مستقیم فقط `INTERNET` و `CAMERA` درخواست می‌کند؛ camera feature با `required=false` است.
- `allowBackup=false`; launcher activity exported است و فقط intent filter `MAIN`/`LAUNCHER` دارد؛ FileProvider `exported=false`, `grantUriPermissions=true` است.
- Capacitor برای Android scheme از `https` استفاده می‌کند؛ `MainActivity` فقط `BridgeActivity` را extend می‌کند.
- Release build در Gradle `debuggable=false` و signing config جدا دارد؛ CI workflowهای آزمایشی debug APK تولید می‌کنند و آن را NOT FOR STORES برچسب می‌زنند.
- Artifact provenance: run `41813070224` روی `f724e847b7aa87f7facb8c04be5e27c7473d82a5` build/sync، `assembleDebug` و `Publish verified testing APK` را با موفقیت گذراند؛ release tag به همین commit اشاره می‌کند. Tree آن (`0a4d5a687dde09e3acf8eccea353079bfb7adbe3`) با tree مبنای ممیزی `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24` برابر است. کد انتشار پیش از publish، `verifyTestApk` را اجرا می‌کند که Debug certificate، app ID/version/versionCode، `application-debuggable` و minSdk را می‌سنجد. GitHub API برای APK digest `sha256:0474e5015531dedf4daa1c35a11848d7db1dd43412eef5bc6a275fb011ebd3fc` گزارش می‌کند؛ این metadata است و hash را محلی دوباره محاسبه نکردیم. دانلود binary به‌دلیل redirect به `release-assets.githubusercontent.com` خارج از allowlist این sandbox انجام نشد.

## ارزیابی و موارد نیازمند verification

### AND-01 — FileProvider یک root گسترده دارد، اما call-site مشاهده‌شده cache-scoped است (کم؛ hardening)

`file_paths.xml` دو root تعریف می‌کند: `external-path path="."` و `cache-path path="."`. Provider non-exported است و URI grant لازم دارد، پس صرف تعریف external root اثبات نشت فایل نیست. جست‌وجوی source در commit دقیق فقط `src/core/utils/file-save.ts` را به‌عنوان Filesystem/Share call-site نشان داد؛ آن خروجی را با `Directory.Cache` می‌نویسد و URI همان فایل را برای share می‌دهد. بنابراین call-site موجود به `cache-path` مربوط است؛ هیچ app call-site برای `external-path` دیده نشد. رفتار dependency/plugin نهایی و grantهای APK binary در این ممیزی بررسی نشدند.

**پیشنهاد:** تأیید کنید Capacitor Share/دیگر pluginها به `external-path` نیاز دارند؛ اگر نه، root را حذف یا محدود کنید؛ APK واقعی را برای read-only URI grant فقط به فایل cache انتخابی تست کنید.

### AND-02 — cleartext policy صریح در app manifest دیده نشد (سخت‌سازی؛ نه vulnerability اثبات‌شده)

در manifest برنامه `android:usesCleartextTraffic` یا `android:networkSecurityConfig` دیده نشد؛ Capacitor scheme محلی روی `https` است و target SDK 36 اعلام شده. منبع دقیق Capacitor 8.5.3 [`CapConfig`](https://github.com/ionic-team/capacitor/blob/8.5.3/android/capacitor/src/main/java/com/getcapacitor/CapConfig.java#L42-L50) مقدار `allowMixedContent=false` دارد؛ app config آن را override نمی‌کند و [`Bridge.initWebView`](https://github.com/ionic-team/capacitor/blob/8.5.3/android/capacitor/src/main/java/com/getcapacitor/Bridge.java#L587-L596) فقط در صورت true بودن مقدار، `MIXED_CONTENT_ALWAYS_ALLOW` می‌گذارد. در CLI 8.5.3، مسیر معمول `copy`، `writeCordovaAndroidManifest` را بدون آرگومان `cleartext` صدا می‌زند؛ آن generator مقدار `usesCleartextTraffic=true` را از این مسیر فقط با `server.cleartext` یا آرگومان صریح فعال می‌کند. config بررسی‌شده فقط `server.androidScheme: 'https'` دارد، نه `server.cleartext`؛ پس override از این مسیر عادی CLI مشاهده نمی‌شود. این کنترل source-level مثبت برای mixed content و شواهد محدودکنندهٔ cleartext است، اما این دو سیاست یکی نیستند و plugin/Gradle merge یا hookهای دیگر همچنان می‌توانند مؤثر باشند؛ merged manifest و APK بررسی نشدند. از نبود صفت در app manifest به‌تنهایی HTTP traffic نتیجه نمی‌گیریم. [منبع CLI](https://github.com/ionic-team/capacitor/blob/8.5.3/cli/src/cordova.ts#L869-L879)

**پیشنهاد:** merged manifest و APK با `aapt`/`apkanalyzer` بازبینی شود؛ cleartext فقط در صورت نیاز صریح block و با تست URLهای داخلی/remote تأیید شود.

### AND-03 — `allowBackup=false` مفید است، اما رمزنگاری داده نیست

این flag Android auto-backup را غیرفعال می‌کند؛ آن را با encryption of IndexedDB/backup اشتباه نگیرید. برنامه backup JSON مستقل دارد و audit قبلی آن را cleartext دانسته است؛ حفاظت فایل خروجی و restore همچنان باید جداگانه طراحی شود.

### AND-04 — خروجی‌های حساس در app cache پاک‌سازی صریح ندارند (متوسط؛ نیازمند تأیید سیاست)

[`src/core/utils/file-save.ts:37-55`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/utils/file-save.ts#L37-L55) Blob را با `Filesystem.writeFile(..., Directory.Cache)` ذخیره و همان URI را برای `Share.share` می‌فرستد؛ پس از برگشت Share، `Filesystem.deleteFile` صدا زده نمی‌شود. در `catch` نیز error نادیده گرفته می‌شود و comment می‌گوید فایل cache باقی می‌ماند. Call-siteها شامل [backup JSON](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/db/backup.ts#L249)، [CSV](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/utils/csv.ts#L24)، [invoice PDF](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/features/store/invoice-pdf.ts#L832) و [payroll PDF](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/features/payroll/payroll-pdf.ts#L378) هستند. بنابراین اگر کاربر share را ببندد یا plugin خطا دهد، فایل—از جمله backup حاوی DB—تا پاک‌سازی OS/app می‌تواند در cache خصوصی برنامه بماند. `allowBackup=false` جلوی این cache را نمی‌گیرد و encryption هم ایجاد نمی‌کند. [`file-save.test.ts`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/src/core/utils/file-save.test.ts) فقط web download path را تست می‌کند؛ native cache/share cleanup test مشاهده نشد.

**پیشنهاد:** retention policy روشن (TTL/پاک‌سازی پس از share با توجه به lifecycle chooser، یا پیام شفاف دربارهٔ ماندن فایل)، خطا را از cancel واقعی جدا کنید و روی دستگاه cancel/restart/space-error و cleanup را تست کنید. تغییر نباید فایل انتخاب‌شده را پیش از تکمیل share حذف کند.

### AND-05 — source manifest به‌تنهایی permission set نهایی APK را ثابت نمی‌کند

`capacitor.settings.gradle` ماژول‌های `@capacitor/app`, `filesystem`, `share`, `status-bar` را فهرست می‌کند؛ نسخه‌های قفل‌شده در `package-lock.json` به‌ترتیب 8.1.2، 8.1.4، 8.0.3، 8.0.4 هستند و `@capacitor/android` روی 8.5.3 است. AndroidManifest منتشرشدهٔ این پنج package در نسخه‌های دقیق lockfile فقط تگ خالی `<manifest>` دارد؛ بنابراین در manifest خود این pluginها permission اضافه‌ای declare نشده است. با این شاهد، احتمال permission اضافه از این plugin manifestها پایین‌تر می‌آید.

اما Android Gradle merge و manifestهای dependencyهای transitive در این ممیزی مستقل اجرا/بازبینی نشدند؛ `settings.gradle` همچنین به ماژول generated `capacitor-cordova-android-plugins` اشاره می‌کند که در snapshot codeload موجود نبود. Run `41813070224` موفق شد و verifier آن روی APK واقعی `aapt dump badging` برای app ID/version/debuggable/minSdk اجرا کرد، نه `aapt dump permissions`; بنابراین permission audit مؤثر نهایی gate نشد. یافته فقط source/package-level برای permissionهاست و فهرست merged permissionهای APK همچنان `NEEDS_VERIFICATION` است.

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

### AND-09 — WebView debugging به debuggable build وابسته است (کم؛ artifact verification)

`capacitor.config.ts` برنامه [`android.webContentsDebuggingEnabled` را تنظیم نمی‌کند](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/capacitor.config.ts#L5-L16). `package-lock.json`، `@capacitor/cli` و `@capacitor/android` را هر دو روی 8.5.3 pin می‌کند. در [CLI tag 8.5.3، `loadExtConfigTS`](https://github.com/ionic-team/capacitor/blob/8.5.3/cli/src/config.ts#L98-L124)، default export تنظیمات به‌عنوان `extConfig` بارگذاری می‌شود؛ مسیر Android copy در [`copyCapacitorConfig`](https://github.com/ionic-team/capacitor/blob/8.5.3/cli/src/tasks/copy.ts#L135-L164) همان `extConfig` را پس از حذف `android/ios.buildOptions` در `capacitor.config.json` می‌نویسد و این تابع default برای `webContentsDebuggingEnabled` اضافه نمی‌کند. بنابراین شواهد مسیر source نشان می‌دهد JSON تولیدی در copy/sync عادی باید فاقد این کلید باشد. در Android Capacitor 8.5.3، [`CapConfig`](https://github.com/ionic-team/capacitor/blob/8.5.3/android/capacitor/src/main/java/com/getcapacitor/CapConfig.java#L242-L288) در نبود override مقدار را از `ApplicationInfo.FLAG_DEBUGGABLE` می‌گیرد و [`Bridge.initWebView`](https://github.com/ionic-team/capacitor/blob/8.5.3/android/capacitor/src/main/java/com/getcapacitor/Bridge.java#L617-L625) همان را به `WebView.setWebContentsDebuggingEnabled()` می‌دهد. app `build.gradle` برای `release` صریحاً `debuggable=false` دارد؛ workflow آزمایشی از `assembleDebug` استفاده می‌کند. مشخصاً run `41813070224` از همان tree سورس، build/sync و `Publish verified testing APK` را موفق گذراند؛ `publishTestRelease()` پیش از انتشار `verifyTestApk()` را روی فایل واقعی اجرا می‌کند و debug certificate و `application-debuggable` را بررسی می‌کند. بنابراین CI برای APK آزمایشی عمومی شواهد verification دارد؛ این verifier خود وضعیت WebView debugging را جداگانه نمی‌سنجد و release signing build نیز در run دیگری fail شد. Binary در این sandbox مستقل دانلود/parse و WebView روی دستگاه اجرا نشد؛ پس رفتار runtime و release APK همچنان `NEEDS_VERIFICATION` است.

فعال‌بودن WebView debugging به‌تنهایی اثبات دسترسی شبکه‌ای عمومی نیست و برای استفاده نیازمند debugging channel/device access است؛ بااین‌حال ابزار محلی مجاز می‌تواند WebView content را inspect کند. Debug APK را فقط به testerهای مجاز بدهید و در آن با دادهٔ آزمایشی کار کنید؛ artifact نهایی release/debug را جداگانه تأیید کنید.

### AND-10 — مسیر `test-apk` خود APK آپلودشده را verify نمی‌کند (کم؛ CI hardening)

در [`.github/workflows/android.yml`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/.github/workflows/android.yml#L115-L164)، targetهای `github-test` و `test-apk` هر دو `assembleDebug` می‌سازند و فایل APK را به‌صورت artifact آپلود می‌کنند. فقط target `github-test` مرحلهٔ `android:publish-test` را اجرا می‌کند؛ [`scripts/android-test-release.mjs`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/scripts/android-test-release.mjs#L32-L65) در این مسیر، APK واقعی را با `apksigner` و `aapt` از نظر Debug certificate، package/version، `application-debuggable` و minSdk می‌سنجد. مسیر `signed-release` نیز [`scripts/verify-android-release.mjs`](https://github.com/rahmaniho/KarenYar/blob/d41ca2916a4edfa93b5edbeeefa6403d11a3ff24/scripts/verify-android-release.mjs#L20-L50) را اجرا می‌کند تا امضا/manifest release را validate کند. در workflow ترتیب برای هر دو target این است که Actions artifact پیش از مرحلهٔ `android:publish-test` upload می‌شود؛ بنابراین حتی در `github-test` verifier، upload artifact قبلی را gate نمی‌کند (اگرچه public release asset را پیش از انتشار می‌سنجد). Target `test-apk` اصلاً آن verifier را اجرا نمی‌کند؛ `npm run test:android-release` صرفاً تست‌های Node مربوط به guard scripts است و فایل APK همین run را نمی‌سنجد. Signed-release verifier نیز فقط APK را می‌گیرد؛ AAB همراه در این مسیر verify نمی‌شود (CI-07).

این gap مختص artifact-only target `test-apk` است، نه شاهد APK خراب یا release اشتباه. برای public `github-test` run `41813070224` روی همان tree سورس، مرحلهٔ verification/publish موفق بود؛ download و دسترسی به Actions artifactهای target `test-apk` همچنان در این ممیزی بررسی نشد. **پیشنهاد:** verifier مشترک روی تمام APKهای uploadشده اجرا شود و checksum ساخته شود؛ اگر verification fail شد artifact publish نشود.

## کنترل‌های مثبت

- permissionهای مستقیم کم هستند؛ camera optional و manual barcode fallback توصیف شده؛ source پین‌شدهٔ Capacitor، runtime `VIDEO_CAPTURE` را به `CAMERA` permission وصل می‌کند.
- FileProvider export نشده؛ call-site مشاهده‌شدهٔ `saveBlob` فایل را در `Directory.Cache` می‌نویسد و همان URI را share می‌کند؛ intent filter عمیق/وبی روی activity دیده نشد.
- Android backup خاموش است؛ release build در Gradle non-debuggable تنظیم شده؛ `github-test` و signed-release مسیرهای binary verification دارند (artifact-only `test-apk` gap جداگانهٔ AND-10 است).
- scheme محلی Capacitor `https` است، اما این به‌تنهایی TLS برای remote host یا data-at-rest encryption را اثبات نمی‌کند.

## آزمون‌های مجاز بعدی

روی APK متعلق به build مصوب و دستگاه/emulator مجاز: merged manifest/permission diff، exported components، cleartext test، FileProvider URI grants، app backup behavior/restore، camera allow/deny/revoke، BarcodeDetector fallback و توقف track پس از setup error/بستن dialog. دستگاه واقعی تست نشد؛ public test APK run `41813070224` در CI verifier گذشت، اما در این sandbox مستقل دانلود/parse نشد؛ هیچ APK یا تنظیمی تغییر نکرد.
