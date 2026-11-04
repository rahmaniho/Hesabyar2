# گزارش نقش‌محور — Principal Software Architect

**مرجع Agency Agents:** `engineering/engineering-software-architect.md`.
**مبنای کد:** `rahmaniho/KarenYar/main@d41ca2916a4edfa93b5edbeeefa6403d11a3ff24`.
**شفافیت:** این نقش توسط همان ایجنت نشست اجرا شده؛ اجرای مستقل چندعاملی نیست.

## یافته‌ها

- مخزن متصل به نشست `Hesabyar2` فقط README دارد؛ مخزن برنامه از مستند سایت شرکت `rahmaniho/KarenYar` شناسایی شد.
- برنامه Vite/React/TS + Capacitor، Dexie/IndexedDB و PWA است؛ ساختار feature/core دارد و برای local single-device طراحی شده.
- مسیر مالی server/API مرکزی وجود ندارد؛ PHPهای repo به licensing/staging مربوط‌اند.
- schema/feature model برای journal، company/tenant و roles وجود ندارد.

## پیشنهاد

- حفظ تدریجی app فعلی و ایجاد Shared Core در کنار آن؛ نه big-bang rewrite.
- Modular monolith برای server Business فقط به‌عنوان target candidate، با database/runtime انتخاب‌نشده تا constraints روشن شوند.
- ماژول‌های domain و transaction boundaries در `docs/architecture/MODULE_BOUNDARIES.md` ثبت شده‌اند.

## اطمینان/سؤال باز

اطمینان بالا درباره ساختار سورس snapshot؛ وضعیت production نامعلوم است. مالک باید تأیید کند که `KarenYar` source رسمی Hesabyar 2.0 است و تصمیم دهد تغییرات کد با branch ثابت نشست چگونه انجام شود.
