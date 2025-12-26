# 📦 فایل‌های شامل شده

## دانلود‌های دسترس‌پذیر

### 1. `mobile-shop-system.tar.gz` (131 MB)
**شامل همه چیز:**
- ✅ کد منبع کامل
- ✅ Schema دیتابیس
- ✅ Migrations
- ✅ Configuration files
- ❌ node_modules (برای اندازة کوچک‌تر)

**استفاده:** برای هاست‌کردن/backup

### 2. `mobile-shop-lite.tar.gz` (خفیف‌تر)
**تر و تمیز:**
- ✅ فقط کد منبع
- ✅ Configuration
- ❌ node_modules
- ❌ dist
- ❌ .git

**استفاده:** برای توسعة سریع

---

## فایل‌های مستند

### 📘 SYSTEM_GUIDE.md (کامل)
- **اندازة:** 50+ صفحه
- **محتوای:**
  - بررسی کلی سیستم
  - معماری کامل
  - ۷ بخش سیستم تفصیلی
  - API endpoints
  - نکات فنی
  - حل مسائل

### 🚀 QUICK_START.md (سریع)
- **اندازة:** 2-3 صفحه
- **برای:** شروع سریع بدون تفاصیل
- **شامل:**
  - نصب ۲ دقیقه‌ای
  - اجرا فوری
  - ۷ صفحة اصلی
  - حل خطاهای رایج

---

## ساختار پروژة داخلی

```
mobile-shop-system/
│
├── 📄 SYSTEM_GUIDE.md          ← دستورالعمل کامل
├── 📄 QUICK_START.md            ← شروع سریع
├── 📄 FILES_INCLUDED.md         ← این فایل
├── 📄 README.md                 ← مستندات اصلی
│
├── 📁 client/                   ← Frontend
│   ├── src/
│   │   ├── pages/               (۸ صفحة)
│   │   ├── components/          (۵۰+ کامپوننت)
│   │   ├── hooks/               (۲۰+ React Query hooks)
│   │   ├── lib/                 (Utils)
│   │   └── index.css            (Tailwind + RTL)
│   ├── public/
│   └── index.html
│
├── 📁 server/                   ← Backend
│   ├── index.ts                 (Server setup)
│   ├── routes.ts                (۳۰+ endpoints)
│   ├── storage.ts               (CRUD operations)
│   └── static.ts
│
├── 📁 shared/                   ← Shared Code
│   └── schema.ts                (Database schema)
│
├── 📁 migrations/               ← Database migrations
│
├── 🔧 package.json              ← Dependencies
├── 🔧 tsconfig.json             ← TypeScript config
├── 🔧 vite.config.ts            ← Vite config
├── 🔧 drizzle.config.ts         ← Database config
└── 🔧 .env                      ← Environment (create this)
```

---

## حجم فایل‌ها

```
mobile-shop-system.tar.gz    131 MB    (با migrations)
mobile-shop-lite.tar.gz      ~25 MB    (بدون node_modules)

بعد از npm install:
node_modules/               ~500 MB
dist/                       ~100 MB
Total:                      ~650 MB
```

---

## چگونه استفاده کنید

### برای توسعة جدید:
```bash
tar -xzf mobile-shop-lite.tar.gz
cd mobile-shop-system
npm install
npm run dev
```

### برای هاست کردن:
```bash
tar -xzf mobile-shop-system.tar.gz
cd mobile-shop-system
npm install --production
npm run build
npm run start
```

### برای Backup:
```bash
tar -xzf mobile-shop-system.tar.gz
# کل پروژه باز می‌شود
```

---

## نکات مهم

- 🔐 **Security:** فایل `.env` میلی‌هرتز اضافه کنید (داخل نیست)
- 🗄️ **Database:** PostgreSQL مورد نیاز است
- 📱 **Browser:** Chrome/Firefox/Safari جدید
- 🌐 **Internet:** برای development خودی نیاز نیست (بعد از npm install)

---

**تمام فایل‌ها برای استفاده تجاری آماده هستند!** ✅
