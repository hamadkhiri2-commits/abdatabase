# 📥 نحوة نصب و استفاده

## دانلود‌های دسترس‌پذیر

### 🔥 **mobile-shop-minimal.tar.gz** (93 KB - **بهترین!**)
✅ فقط کد منبع مورد نیاز
✅ بدون node_modules یا build files
✅ شامل تمام فایل‌های ضروری

### 📦 دیگر گزینه‌ها:
- `mobile-shop-lite.tar.gz` (174 MB) - اگر بخواهید
- `mobile-shop-system.tar.gz` (131 MB) - اگر بخواهید

---

## 🚀 نصب سریع (۳ دقیقه)

### مرحلة ۱: استخراج فایل
```bash
tar -xzf mobile-shop-minimal.tar.gz
cd mobile-shop-system
```

### مرحلة ۲: نصب dependency‌ها
```bash
npm install
```
> ⏱️ این ۲-۳ دقیقه طول می‌کشد

### مرحلة ۳: تنظیم دیتابیس

**الف) ایجاد فایل `.env`**
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://username:password@localhost:5432/mobile_shop
PORT=5000
NODE_ENV=development
EOF
```

**ب) اطلاعات به جای:
- `username` - نام کاربری PostgreSQL
- `password` - رمز عبور
- `localhost` - آدرس سرور
- `5432` - پورت (معمول)
- `mobile_shop` - نام دیتابیس

### مرحلة ۴: ایجاد دیتابیس
```bash
# ابتدا دیتابیس را در PostgreSQL ایجاد کنید:
createdb -U username mobile_shop

# سپس schema‌ها را ایجاد کنید:
npm run db:push
```

### مرحلة ۵: اجرا کنید!
```bash
npm run dev
```

**بروید به:** `http://localhost:5000` ✅

---

## ✅ تأیید موفقیت

اگر صفحة داشبورد بدون خطا باز شود = **تمام شد!**

```
✓ Frontend درحال اجرا است
✓ Backend درحال اجرا است
✓ دیتابیس متصل است
✓ سیستم آماده است
```

---

## 🔧 فایل‌های داخل Minimal

```
mobile-shop-system/
├── client/src/              (۸ صفحة React)
├── server/                  (۳۰+ API endpoints)
├── shared/                  (Database schema)
├── package.json             (dependency list)
├── vite.config.ts           (Frontend config)
├── tsconfig.json            (TypeScript config)
├── drizzle.config.ts        (Database config)
├── SYSTEM_GUIDE.md          (دستورالعمل کامل)
├── QUICK_START.md           (شروع سریع)
└── .env (ایجاد کنید)
```

---

## 💾 حجم‌های مختلف

| مرحله | حجم |
|------|------|
| دانلود minimal | **93 KB** ⭐ |
| بعد npm install | ~150 MB |
| بعد npm run build | ~250 MB |

---

## 🎯 تمام این‌ها برای چیه؟

```
93 KB (minimal) = کد خالص
↓ (npm install)
150 MB = اضافة dependency‌ها (node_modules)
↓ (npm run build)
250 MB = اضافة فایل‌های build شده
```

---

## ❓ مشکل داشتید؟

### خطا: DATABASE_URL not configured
```bash
→ بررسی کنید فایل .env در root پروژه باشد
```

### خطا: Cannot connect to PostgreSQL
```bash
→ PostgreSQL نصب و فعال شده؟
→ اطلاعات .env درست است؟
```

### خطا: Port 5000 already in use
```bash
lsof -i :5000
kill -9 <PID>
npm run dev
```

---

## 📱 اکنون شما می‌توانید:

✅ **صفحة فروش** - ثبت فروش و چاپ فاتورة
✅ **صفحة گدام** - مدیریت خریدها
✅ **صفحة داشبورد** - دیدن کل سیستم
✅ **صفحة سود** - تحلیل درآمد
✅ **صفحة شرکا** - تقسیم عواید
✅ **صفحة مصارف** - ثبت مخارج
✅ **صفحة گزارشات** - دانلود لیست‌ها

---

## 🎉 یا دیگر کمک مورد نیاز!

فقط `npm run dev` کن و شروع کن! 🚀
