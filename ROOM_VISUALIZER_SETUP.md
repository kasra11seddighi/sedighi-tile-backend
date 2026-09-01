# راه‌اندازی Room Visualizer (اعمال کاشی با هوش مصنوعی)

این فایل‌ها به بک‌اند اضافه شدند:

```
src/
├── controllers/roomVisualizer.controller.ts
├── services/roomVisualizer.service.ts
├── validations/roomVisualizer.validation.ts
├── routes/roomVisualizer.routes.ts
├── middlewares/upload.middleware.ts   (آپلود عکس با multer)
└── utils/aiImageProvider.ts           (تنها نقطه‌ی تماس با سرویس AI)
```

و این‌ها ویرایش شدند:
- `src/app.ts` → mount شدن `roomVisualizerRoutes` روی `/api/room-visualizer`
- `src/config/env.ts` → دو متغیر جدید (`AI_API_URL`, `AI_API_KEY`) اضافه شد
- `src/middlewares/errorHandler.middleware.ts` → پیام فارسی برای خطاهای multer (حجم فایل و ...)

## ۱. نصب پکیج‌های جدید

```bash
npm install multer axios form-data
npm install -D @types/multer
```

## ۲. متغیرهای محیطی (.env)

```
AI_API_URL=آدرس پایه سرویس هوش مصنوعی تصویر
AI_API_KEY=کلید API سرویس
```

اگر این دو مقدار ست نشوند، سرور بالا می‌آید ولی endpoint `/apply` با خطای واضح ۵۰۰ جواب می‌دهد (کرش نمی‌کند).

## ۳. مسیرهای جدید

| متد | مسیر | توضیح |
|---|---|---|
| GET | `/api/room-visualizer/suggest` | یک کاشی از کاتالوگ محصولات فعال پیشنهاد می‌دهد |
| POST | `/api/room-visualizer/apply` | عکس اتاق (`image`) + `tileId` را می‌گیرد و آدرس تصویر نهایی را برمی‌گرداند |

`apply` باید به‌صورت `multipart/form-data` با فیلدهای `image` (فایل) و `tileId` (رشته - شناسه محصول در دیتابیس) ارسال شود.

## ۴. نکته‌ی مهم درباره‌ی `aiImageProvider.ts`

بدنه‌ی دقیق درخواست و مسیر endpoint به سرویس هوش مصنوعی انتخابی‌ات (مثلاً gapgpt.app) بستگی دارد و من مستندات دقیق آن را ندارم؛ بنابراین `generateRoomWithTile` یک اسکلت کاملاً کارکردی نوشته شده که فقط باید مسیر `/images/edits` و نام فیلدهای فرم را طبق مستندات سرویس خودت تنظیم کنی. بقیه‌ی زنجیره (آپلود، اعتبارسنجی، ذخیره‌ی نتیجه، مسیرها) کامل و آماده‌ی استفاده است.

## ۵. ذخیره‌سازی تصاویر

- عکس آپلودی کاربر → `public/uploads/rooms/`
- تصویر نهایی تولیدشده → `public/uploads/results/`

چون `app.use(express.static("public"))` از قبل در پروژه هست، هر دو مسیر خودکار در دسترس فرانت قرار می‌گیرند (دقیقاً مثل تصاویر محصولات - با همون الگوی `API_BASE_URL` prefix که قبلاً استفاده می‌کردی).

## ۶. پیشنهاد کاشی (`/suggest`)

فعلاً این endpoint یک محصول فعال تصادفی از دیتابیس برمی‌گرداند (نه تحلیل واقعی تصویر). برای پیشنهاد هوشمندتر بر اساس محتوای عکس، باید یک مدل بینایی ماشین جداگانه اضافه شود؛ این بخش برای شروع سریع و تست UI کافی است.
