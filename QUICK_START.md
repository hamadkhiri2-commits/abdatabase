# 🚀 راهنمای سریع شروع

## بدون هیچ تنظیمات پیچیده!

### 1️⃣ نصب (۲ دقیقه)

```bash
# دانلود پروژه
tar -xzf mobile-shop-lite.tar.gz
cd mobile-shop-system

# نصب پکیج‌ها
npm install
```

### 2️⃣ تنظیم دیتابیس (۲ دقیقه)

```bash
# فایل .env ایجاد کنید
echo "DATABASE_URL=postgresql://username:password@localhost:5432/mobile_shop" > .env
echo "PORT=5000" >> .env

# دیتابیس را راه‌اندازی کنید
npm run db:push
```

### 3️⃣ اجرا (۱ دقیقه)

```bash
npm run dev
# بروید به: http://localhost:5000
```

---

## ۷ صفحة اصلی

| صفحه | مسیر | کار |
|------|------|------|
| 📊 داشبورد | `/` | مشاهدة خلاصة کل سیستم |
| 📦 گدام | `/inventory` | مدیریت خریدها و موجودی |
| 🛒 فروش | `/sales` | ثبت فروش و چاپ فاتورة |
| 💳 باقیات | `/debts` | مدیریت قرض‌های مشتریان |
| 👥 شرکا | `/partners` | تقسیم سود بین شرکا |
| 📈 سود | `/profit` | تحلیل سود و درآمد |
| 📄 گزارشات | `/reports` | لیست و دانلود گزارشات |
| 💰 مصارف | `/expenses` | ثبت مصارف روزانه |

---

## کار سریع (۵ دقیقه)

### مثال: فروش یک گوشی

```
1. صفحة "فروش و بیجک" باز کن
2. محصول جستجو کن
3. قیمت فروش دستی وارد کن
4. مشخصات مشتری
5. ثبت = فاتورة خودکار چاپ‌شود!
```

---

## فایل‌های مهم

```
📁 mobile-shop-system/
├── SYSTEM_GUIDE.md       ← دستورالعمل کامل
├── QUICK_START.md        ← این فایل
├── package.json          ← پکیج‌ها
├── .env                  ← تنظیمات (ایجاد کنید)
├── client/src/           ← React کدها
├── server/               ← Express API
└── shared/schema.ts      ← دیتابیس
```

---

## توقف خطاها

| خطا | حل |
|-----|-----|
| "DATABASE_URL not configured" | فایل `.env` را بررسی کنید |
| "Cannot connect to PostgreSQL" | `sudo systemctl start postgresql` |
| "Port 5000 already in use" | `lsof -i :5000` و kill کنید |
| صفحه خالی | `F5` برای ریفرش |

---

## فرمان‌های مفید

```bash
npm run dev              # اجرای development
npm run build            # ساختن برای production
npm run db:push          # مایگریشن دیتابیس
npm run check            # بررسی TypeScript errors
```

---

**بس! اکنون آماده برای استفاده هستید!** ✅
