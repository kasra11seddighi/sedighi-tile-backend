# نمایندگی صدیقی — بک‌اند (TypeScript)

بازنویسی حرفه‌ای بک‌اند قبلی با معماری لایه‌بندی‌شده (Controller → Service → Model)،
اعتبارسنجی ورودی با zod، و type-safety کامل. **تمام API endpoint ها و فرمت پاسخ‌ها
دقیقاً همان چیزی هستند که در نسخه‌ی JS قبلی بودند** — فرانت بدون تغییر کار می‌کند.

## اجرا

```bash
npm install
cp .env.example .env   # مقادیر MONGO_URI و JWT_SECRET را ست کن
npm run dev            # حالت توسعه (ts-node-dev)
npm run build && npm start   # حالت production
```

## Seed اولیه

```bash
npm run seed:tilefinder   # داده‌ی location/size/style/color برای Tile Finder
npm run seed:setting      # لوگو و منوی هدر
```

## مسیر API ها (بدون تغییر نسبت به قبل)

| ماژول | Base Path |
|---|---|
| Auth | `/api/auth` |
| Categories | `/api/categories` |
| Products | `/api/products` |
| Cart | `/api/cart` |
| Orders | `/api/orders` |
| Home | `/api/home` |
| Brands | `/api/brands` |
| Settings | `/api/settings` |
| **Tile Finder** | **`/tile-finder`** (بدون پیشوند `/api` — عمداً، مطابق فرانت فعلی) |
| Swagger Docs | `/api-docs` |
| Health check | `/api/health` |

نکته مهم درباره‌ی Tile Finder: پنج endpoint گزینه‌ها (`/locations`, `/sizes`,
`/brands`, `/styles`, `/colors`) و همچنین `/products` و `/filter` عمداً
**آرایه‌ی خام** برمی‌گردانند (نه `{success, data}`) — دقیقاً مثل قبل، چون فرانت
فعلی همین فرمت را می‌خواند.

## چه چیزی نسبت به نسخه‌ی قبلی عوض شده

- **TypeScript کامل** با `strict: true` — همه‌ی مدل‌ها، سرویس‌ها و کنترلرها تایپ دارند.
- **لایه‌ی validation جدید** (`src/validations` + میان‌افزار `validate`): قبلاً
  هیچ اعتبارسنجی ورودی نبود و اولین خطا را mongoose در دیتابیس تولید می‌کرد؛
  الان درخواست نامعتبر قبل از رسیدن به دیتابیس با پیام فارسی مشخص رد می‌شود.
- **حذف کد تکراری**: تابع `slugify` که در `productService` و `categoryService`
  دوبار پیاده‌سازی شده بود، حالا یک util مشترک است.
- **رفع باگ Tile Finder** که در چت قبلی پیدا شد: نام غلط فایل کنترلر
  (`tileFinderController.js` به‌جای `tileFinder.controller.js`)، کد کوروپت‌شده
  با بلاک‌های markdown داخل فایل‌های `.js`، و دو پیاده‌سازی موازی `filterProducts`
  — همه در این بازنویسی از ریشه حذف شدند.
- **errorHandler متمرکز و تایپ‌شده**: خطاهای mongoose (`ValidationError`,
  `CastError`, duplicate key) به‌صورت یکسان به پیام فارسی قابل‌فهم تبدیل می‌شوند.
- **Swagger** برای مسیرهای اصلی (`Auth`, `Categories`, `Products`) نگه داشته و
  به TypeScript منتقل شده؛ در `/api-docs` قابل مشاهده است.

## ساختار پروژه

```
src/
├── config/        env.ts (اعتبارسنجی env با zod)، db.ts، swagger.ts
├── types/         افزودن req.user به تایپ‌های Express
├── models/        اسکیمای Mongoose + اینترفیس TS برای هر مدل
├── validations/   zod schema برای هر endpoint
├── services/      تمام منطق تجاری — تنها منبع حقیقت هر ماژول
├── controllers/   لایه‌ی نازک HTTP، فقط صدا زدن service و برگرداندن پاسخ
├── routes/        تعریف مسیر + میان‌افزارها (auth/adminOnly/validate)
├── middlewares/   auth، adminOnly، errorHandler، validate
├── seeds/         اسکریپت‌های seed برای Tile Finder و Setting
├── app.ts         ساخت Express app (بدون listen — برای تست هم قابل استفاده)
└── server.ts       نقطه‌ی ورود: اتصال DB و سپس app.listen
```

## قبل از استفاده در پروژه‌ی واقعی

1. مقدار `JWT_SECRET` در `.env` را حتماً با یک رشته‌ی تصادفی و امن جایگزین کن.
2. پوشه‌ی `public/` برای فایل‌های استاتیک (تصاویر محصولات) در نظر گرفته شده —
   تصاویر فعلی پروژه را داخل `public/images/products` کپی کن.
3. چون این پروژه از صفر با همان دیتابیس (collection ها/فیلدها بدون تغییر) کار
   می‌کند، migration دیتا لازم نیست — فقط کد جایگزین می‌شود.
