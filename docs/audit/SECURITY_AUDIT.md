# ممیزی امنیت و حریم خصوصی — سورس حساب‌یار 1.4.2

**مبنای کد:** `rahmaniho/KarenYar/main`, commit `d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**دامنه:** source/lockfile محلی؛ هیچ live server، production config، endpoint واقعی، دادهٔ کاربر یا penetration test بررسی نشد.

## یافته‌های اولویت‌دار

### SEC-01 — محرمانهٔ HMAC در کد/کلاینت (بحرانی برای یکپارچگی مجوز)

`src/core/license/license-core.ts:108-112` کلید HMAC را از `VITE_LICENSE_SECRET` می‌خواند و مقدار fallback هم در همان کد قرار دارد؛ `scripts/generate-license.mjs` نیز کلید متناظر را برای صدور استفاده می‌کند. هر `VITE_*` وارد bundle مرورگر می‌شود، و سورس عمومی است. بنابراین secret client-side قابل محرمانه‌ماندن نیست و مسیر offline KS1 از نظر صدور مجوز قابل اعتماد نیست. مسیر server-issued Ed25519 موجود است، ولی فقط با `VITE_LICENSE_API_BASE` فعال می‌شود؛ وضعیت config production `NEEDS_VERIFICATION` است. مقدار secret در این گزارش عمداً چاپ نشده است.

### SEC-02 — PIN قفل UI است، نه رمزنگاری داده (بالا)

`src/core/utils/pin.ts` PIN ۴ تا ۱۲ رقمی را با SHA-256 و salt ثابت hash می‌کند. `LockScreen` محدودیت تلاش/قفل موقت را enforce نمی‌کند؛ تلاش‌ها فقط برای انیمیشن UI استفاده می‌شوند. IndexedDB/localStorage و backup JSON در سورس بازرسی‌شده رمزنگاری نشده‌اند. تهدید سرقت دستگاه/دسترسی به browser profile باید صریحاً از تهدید remote attacker جدا شود.

### SEC-03 — مرز تک‌دستگاهی برای دادهٔ مالی (بالا برای هدف Business)

هیچ login/session مالی، backend authorization، RBAC یا company/tenant isolation در سورس فعلی وجود ندارد. در معماری local-only این نبودن خودبه‌خود آسیب‌پذیری remote نیست، اما محصول را برای multi-user/business سازمانی نامناسب می‌کند تا این لایه طراحی و آزمون شود.

### SEC-04 — Pages HTTPS/domain configuration نامتجانس (بحرانی تا verification)

GitHub Pages settings API در زمان ممیزی `html_url=http://hesabyar.karen-soft.ir/`, `custom_domain=null` و `https_enforced=false` گزارش داد؛ status آخرین deployment موفق نیز `environment_url=http://hesabyar.karen-soft.ir/` ثبت کرد. در مقابل، source دارای CNAME برای همین دامنه و workflow commentی است که HTTPS را ادعا می‌کند. این‌ها شواهد پیکربندی GitHub هستند، نه HTTP response زنده؛ host از sandbox قابل دسترسی نبود و معلوم نیست HTTPS دستی/redirect دیگری برقرار باشد. اگر app از HTTP قابل دریافت باشد، کد client و اطلاعات واردشده در مرورگر در معرض tampering/MITM خواهند بود. پیش از release باید Pages/domain/TLS را روی host واقعی reconcile و HTTP→HTTPS را تأیید کرد.

### SEC-05 — dependency advisories (بالا؛ نیازمند triage)

روی lockfile همین commit:

- `npm audit --omit=dev`: **۳ advisory** (۲ moderate، ۱ high) شامل Zod و React Router.
- `npm audit`: **۳۰ advisory** (۳ low، ۲۲ moderate، ۲ high، ۳ critical)، از جمله `tinypool` در test toolchain، Vite/esbuild و transitive dependencies.

این تعداد، ارزیابی exploitability یا وجود exploit در production نیست. dev-only و runtime باید جدا شوند؛ `npm audit fix --force` انجام نشد چون major upgrade می‌تواند breaking change باشد.

### SEC-06 — CI build steps با token دارای write permission اجرا می‌شوند (ریسک بالقوه بالا)

`android.yml` و `admin-android.yml` `contents:write` را در سطح workflow می‌دهند و در همان jobها `npm ci`/Gradle یا scriptهای repository اجرا می‌شود. `actions/checkout@v4` مقدار پیش‌فرض `persist-credentials=true` دارد و workflow آن را خاموش نکرده است؛ بنابراین credential checkout به شکل git configuration تا پایان job باقی می‌ماند. کد dependency/build در صورت compromise ممکن است از permissionهای job سوءاستفاده کند. این مسیر بالقوه است؛ هیچ سوءاستفاده‌ای مشاهده نشده است. راهکار: build کم‌دسترسی، checkout بدون credential پایدار و publication جدا با token حداقلی.

### SEC-07 — signed release مسیر tag و dispatch دارد، اما gate در YAML دیده نشد (بالا تا verification)

`android.yml` هر tag `v*` را برای signed release می‌گیرد و `workflow_dispatch` نیز گزینهٔ `signed-release`/legacy release را می‌پذیرد. فایل workflow برای signing job، GitHub Environment با reviewer approval یا source-ref allowlist نشان نمی‌دهد. Keystore در workflow پیش از `npm ci` decode می‌شود و مسیرش برای stepهای بعدی export می‌گردد؛ passwordها هنگام Gradle signing داده می‌شوند. Rulesets/branch protection قابل بررسی نبودند (API 403)، پس بیرون از YAML وجودداشتن کنترل را نمی‌توان رد کرد. Owner باید tag rules, required reviewers و secret scope را تأیید کند.

### SEC-08 — Pages write/OIDC permission در کل workflow به build job هم می‌رسد (متوسط)

`pages.yml` `pages:write` و `id-token:write` را workflow-wide اعلام می‌کند، در حالی‌که build job `npm ci` و rate-update script اجرا می‌کند. دسترسی‌ها را تا حد ممکن به deploy job محدود کنید؛ نیاز `configure-pages` با enablement باید جداگانه لحاظ شود.

## کنترل‌های مثبت مشاهده‌شده

- WebCrypto Ed25519 client verifier، public key pin option و device key identity برای مسیر server license وجود دارند.
- endpointهای PHP staging دارای `Cache-Control: no-store` و روش POST هستند؛ پنل staging در کد به environment guard و CSRF/session متکی است. production deployment تأیید نشد.
- backup import پیش از clear، ساختار و برخی رابطه‌ها را validate می‌کند؛ CSV writer تست formula injection دارد.
- Vite build sourcemap را کنترل می‌کند؛ هیچ ادعای امنیت production از این مورد نتیجه نمی‌شود.

## موارد نیازمند verification/تست

- آیا production از server license path استفاده می‌کند؟ issuer private key و envها کجا نگهداری می‌شوند؟
- HTTPS، CSP، headers، access logs، admin protection و rate limits روی host واقعی.
- backup encryption، دستگاه گم‌شده، XSS/local access و بازیابی PIN.
- امضا/لغو مجوز و compatibility با مشتریانی که KS1 مادام‌العمر خریده‌اند.
- triage advisories و برنامهٔ ارتقای کم‌ریسک با تست رگرسیون.

هیچ secret واقعی از config محیطی بازیابی نشد؛ production secrets در دسترس نبودند و نباید در Git/chat قرار گیرند.
