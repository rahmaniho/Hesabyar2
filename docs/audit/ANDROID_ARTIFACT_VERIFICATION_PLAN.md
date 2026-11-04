# معیار پیشنهادی راستی‌آزمایی artifactهای Android/Admin

**وضعیت:** پیشنهاد اجرایی برای بازبینی owner/security؛ تصویب یا پیاده‌سازی نشده است. هیچ workflow، secret، APK/AAB، تنظیم مخزن یا release در این مرحله تغییر نکرد.

**مبنای ممیزی:** `rahmaniho/KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`؛ یافته‌های `CI-06..08`، `ADM-04` و `R-38..40`.

## هدف و مرز

این چک‌لیست شکاف‌های موجود در ترتیب upload و پوشش verifierها را به معیار پذیرش قابل‌آزمون تبدیل می‌کند. «گذراندن workflow موجود» فقط همان assertionهای workflow را اثبات می‌کند؛ به‌تنهایی تأیید مستقل binary، merged manifest، runtime یا device نیست. معیارها باید پیش از تغییر CI توسط ownerهای Android، امنیت و release تصویب شوند.

## ماتریس targetها

| Target | وضعیت مشاهده‌شده در baseline | ترتیب لازم پیش از upload/انتشار | حداقل معیارهای artifact |
|---|---|---|---|
| `android.yml` / `github-test` | APK debug ابتدا به Actions artifact upload می‌شود؛ verifier فعلی پیش از انتشار GitHub pre-release APK اجرا می‌شود، نه پیش از آن upload | assemble → verify APK → محاسبهٔ SHA-256 → Actions artifact upload → در صورت موفقیت، انتشار pre-release | application ID، versionName/versionCode، امضای test/debug مورد انتظار، `application-debuggable=true`، حداقل SDK و policy مصوب manifest؛ برچسب و توضیح TEST/DEBUG و NOT FOR STORES حفظ شود |
| `android.yml` / `test-apk` | APK debug به Actions artifact upload می‌شود؛ verifier فعلی اجرا نمی‌شود | assemble → همان verifier fail-closed → SHA-256 → upload | همان assertions مربوط به test APK؛ artifact نامعتبر یا فاقد metadata قابل‌خواندن نباید قابل دریافت شود |
| `android.yml` / `signed-release` | verifier موجود APK را بررسی می‌کند؛ APK و AAB هر دو upload/publish می‌شوند، ولی AAB verifier مستقل ندارد | assemble APK و bundle AAB → اعتبارسنجی جداگانهٔ هر دو → تطبیق package/version/signer → SHA-256 هر فایل نهایی → upload → انتشار | application ID/versionName/versionCode مصوب، امضای release مجاز، APK/AAB هم‌هویت، `application-debuggable=false`، SDK و merged-manifest policy مصوب؛ AAB نباید صرفاً به‌واسطهٔ موفقیت APK قبول شود |
| `admin-android.yml` / debug APK | verifier پیش از upload اجرا می‌شود؛ امضا معتبر، app ID، versionName، minSdk و targetSdk بررسی می‌شوند؛ signer identity، `application-debuggable`, versionCode و permissions صریحاً assert نمی‌شوند | assemble → تکمیل verifier → SHA-256 → Actions artifact upload → انتشار prerelease فقط پس از موفقیت | debug variant مورد انتظار (`application-debuggable=true`)، app ID، versionName/versionCode، min/target SDK، signer policy مصوب، permissions و مقصد staging مطابق سیاست owner؛ prerelease/debug بودن باید روشن بماند |

`application-debuggable=true` برای artifactهای debug/test در این ماتریس انتظار build-type است، نه مجوز استفاده با دادهٔ واقعی. برای signed release مقدار مورد انتظار `false` است. Admin APK در baseline از `assembleDebug` ساخته می‌شود؛ destination امن و محدودبودن دسترسی آن همچنان نیازمند owner verification است.

## معیارهای مشترک verifier

1. **Fail closed:** هر ابزار گمشده/ناموفق، parse ناقص، artifact مفقود یا مبهم، metadata نامنتظر، امضای نامعتبر و mismatch باید کل مسیر upload/publication را متوقف کند. خطای verifier نباید با `continue-on-error`، fallback خاموش یا artifact قبلاً uploadشده بی‌اثر شود.
2. **هویت signer:** سیاست مجاز باید برای test/debug، Admin debug و release جداگانه تعریف شود. در release، fingerprint گواهی مجاز از مسیر مورد اعتماد owner پیکربندی شود؛ subject عمومی مانند `CN=Android Debug` به‌تنهایی هویت رمزنگاری‌شده را اثبات نمی‌کند. اگر debug keystore در runner ناپایدار/تولیدشده است، owner باید قبل از الزام fingerprint ثابت، سیاست آن را روشن کند. هیچ private key یا secret در log، artifact یا این سند قرار نگیرد.
3. **Metadata:** package/application ID، versionName، versionCode، minSdk و targetSdk با مقادیر مورد انتظار همان build مقایسه شوند؛ صرف وجود مقدار کافی نیست. مقدار مورد انتظار از همان commit و config مصوب بیاید، نه از رشتهٔ دلخواه artifact.
4. **Merged manifest:** APK و در صورت لزوم bundle نهایی بررسی شوند؛ permissionهای جدید/خطرناک، componentهای exported، intent-filterها، `usesCleartextTraffic` و network-security references باید با baseline مصوب تطبیق داده شوند. هر تغییر خارج allowlist نیازمند review است. سورس manifest به‌تنهایی جای بررسی manifest ادغام‌شده را نمی‌گیرد.
5. **Debug/runtime policy:** برای test و Admin debug، debug state فقط در artifactهای با برچسب و دسترسی مصوب پذیرفته شود؛ release باید non-debuggable باشد. برای WebView، رفتار runtime debugging و destination host در device/staging test مستقل ارزیابی شود؛ از آزمون metadata به‌تنهایی نتیجهٔ runtime نگیرید.
6. **APK و AAB مستقل:** هر نوع artifact با ابزار مناسب خودش اعتبارسنجی و metadata/signer آن ثبت شود. برای AAB از verifier bundle مستقل (برای مثال `bundletool validate` به‌همراه بررسی امضای JAR) استفاده شود؛ نتیجهٔ APK جایگزین نتیجهٔ AAB نیست.
7. **Hash و provenance:** SHA-256 روی بایت‌های نهایی هر artifact پس از verification محاسبه شود. نام artifact، digest محلی/CI، Git commit، tag/ref، run ID، workflow path و نسخهٔ ابزارهای verification ثبت شوند. digest گزارش‌شده از GitHub API را «hash مستقل محلی» معرفی نکنید.
8. **ترتیب انتشار:** هیچ Actions artifact یا release assetی پیش از verification در مسیر قابل‌دسترسی قرار نگیرد. اگر انتقال artifact بین jobها اجتناب‌ناپذیر است، آن را private/unpublished نگه دارید و انتشار نهایی را به gate موفق وابسته کنید.
9. **حداقل دسترسی:** build/verify jobها نیازی به release write یا signing secret غیرضروری نداشته باشند. انتشار در job جدا، با permission محدود و environment/ref policy مصوب انجام شود؛ این معیار طراحی است، نه دستور تغییر workflow در این مرحله.

## تست‌های پیشنهادی برای خود verifier

Verifier باید یک positive fixture کنترل‌شده و negative fixtures داشته باشد که دست‌کم این حالات را رد کنند: APK بدون امضا یا دستکاری‌شده؛ signer خارج از policy؛ package/version/versionCode یا SDK ناهماهنگ؛ debug flag نادرست؛ permission/manifest delta تأییدنشده؛ فایل ناقص/اشتباه یا چند خروجی مبهم؛ AAB بدون امضای معتبر یا دارای هویت متفاوت از APK؛ و mismatch بین digest محاسبه‌شده و فایلی که واقعاً upload می‌شود. کلیدهای fixture باید آزمایشی/یک‌بارمصرف باشند و هیچ credential تولیدی وارد test نشود.

## شواهد baseline و محدودیت مستقل‌سازی

| مورد | شواهد فعلی | آنچه هنوز اثبات نشده |
|---|---|---|
| `github-test` | run `41813070224` موفق گزارش شد؛ tree آن با source baseline برابر است و verifier قبل از public pre-release APK اجرا شد. GitHub API digest برابر `sha256:0474e5015531dedf4daa1c35a11848d7db1dd43412eef5bc6a275fb011ebd3fc` گزارش کرد | Actions artifact پیش از verifier upload شده؛ binary در این sandbox مستقل download/parse نشد و hash محلی نداریم |
| `test-apk` | ترتیب workflow نشان می‌دهد artifact بدون verifier upload می‌شود | اجرای artifact هدف و parse مستقل binary انجام نشد |
| signed release AAB | منبع workflow AAB را همراه APK upload/publish می‌کند؛ verifier دیده‌شده APK-only است | AAB معتبر/نامعتبر مشاهده نشد؛ run tag `v1.4.2` پیش از build در signing-key validation متوقف شد |
| Admin debug APK | run `41274386135` گام‌های build، verifier، upload و publish را گذراند؛ API digest `sha256:95c0b44236f603aae56efcaee684576aad21fd462a34ecf844e5ee7a2f6b8946` گزارش کرد | signer/debuggable/versionCode/permissions assertionهای verifier موجود نیستند؛ APK مستقلاً download/parse یا روی device اجرا نشد |

محدودیت دانلود binary از محیط فعلی به‌معنی شواهدی دربارهٔ محتوا یا نامعتبر بودن artifact نیست؛ فقط verification مستقل در این نشست انجام نشده است.

## فرم ثبت اجرای آینده

برای هر target، یک رکورد جداگانه با این فیلدها تکمیل شود؛ مقدار ناشناخته را `NOT VERIFIED` ثبت کنید:

- Target، نام artifact و نوع آن (APK/AAB)
- source repository، commit SHA، tag/ref، workflow و run ID
- build toolchain و نسخهٔ verifierها
- نتیجهٔ امضا و fingerprint signer طبق policy مصوب
- application ID، versionName/versionCode، min/target SDK و debuggable state
- نتیجهٔ بررسی merged manifest و مواردی که owner برای allowlist تصویب کرده
- SHA-256 روی فایل نهایی، محل upload/release و تطبیق digest پس از انتقال
- reviewer/approval لازم و لینک run/evidence غیرحساس
- موارد `NOT RUN` یا محدودیت‌های دسترسی/device/staging

## Approval gate

پیش از پیاده‌سازی CI، ownerهای repository/security باید signer policy، metadata/permission baselines، دسترسی و retention artifactها، release authority و required checks را تأیید کنند. اجرای واقعی نیازمند مجوز جداگانه است؛ تا آن زمان این سند فقط معیار پیشنهادی است و هیچ workflow، artifact، release یا signing configuration را تغییر نمی‌دهد.
