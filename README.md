# سیستم مدیریت فروشگاه موبایل حاجی عبدالرحمن 📱

نرم‌افزار جامع و حرفه‌ای مدیریت دکان فروش تلیفون – تحت وب (برای لپتاپ و دسکتاپ)، سریع، امن، دقیق و آسان الاستخدام.

---

## 📋 فهرست

1. [ویژگی‌های اصلی](#ویژگی‌های-اصلی)
2. [شروع سریع](#شروع-سریع)
3. [ساختار دیتابیس](#ساختار-دیتابیس)
4. [API Documentation](#api-documentation)
5. [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
6. [راهنمای Windows Deployment](#windows-deployment)
7. [فرمول‌های محاسباتی](#فرمول‌های-محاسباتی)
8. [رفع خرابی‌ها](#رفع-خرابی‌ها)

---

## 🚀 شروع سریع

### نصب برای Windows
برای اجرای سیستم بر روی Windows، [راهنمای کامل Windows Deployment](WINDOWS_DEPLOYMENT.md) را ببینید.

### نصب سریع (Linux/Mac):
```bash
# کلون پروژه
git clone <repository-url>
cd mobile-shop

# نصب وابستگی‌ها
npm install

# تنظیم دیتابیس
npm run migrations

# اجرای سرور
npm run dev
```

سرور در `http://localhost:3000` اجرا می‌شود.

---

## ساختار دیتابیس

### 1. **purchases** (جداول خریدها)
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier TEXT NOT NULL,              -- نام تأمین‌کننده
  date DATE NOT NULL,                  -- تاریخ خرید
  bill_no VARCHAR NOT NULL,            -- شماره بل
  model TEXT NOT NULL,                 -- مدل گوشی
  serial VARCHAR NOT NULL,             -- سریال نمبر
  color TEXT NOT NULL,                 -- رنگ
  unit_price NUMERIC(10,2) NOT NULL,   -- قیمت فی واحد
  quantity INTEGER NOT NULL,           -- تعداد
  total_price NUMERIC(12,2) NOT NULL   -- قیمت مجموعی
);
```

### 2. **sales** (جدول فروش‌ها)
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,              -- نام مشتری
  phone VARCHAR,                            -- شماره تماس مشتری
  date DATE NOT NULL,                       -- تاریخ فروش
  model TEXT NOT NULL,                      -- مدل گوشی
  serial VARCHAR NOT NULL,                  -- سریال نمبر
  color TEXT NOT NULL,                      -- رنگ
  sale_price NUMERIC(10,2) NOT NULL,        -- قیمت فروش
  quantity INTEGER NOT NULL,                -- تعداد
  total_price NUMERIC(12,2) NOT NULL,       -- قیمت مجموعی
  paid_amount NUMERIC(12,2) DEFAULT 0,      -- مبلغ دریافتی
  remaining_amount NUMERIC(12,2) DEFAULT 0  -- مبلغ باقی‌مانده
);
```

### 3. **customers** (جدول مشتریان)
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                   -- نام مشتری
  phone VARCHAR NOT NULL UNIQUE,        -- شماره تماس (منحصر‌به‌فرد)
  debts NUMERIC(12,2) DEFAULT 0         -- مجموع قرض
);
```

### 4. **partners** (جدول شرکا)
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                       -- نام شریک
  share_percent NUMERIC(5,2) NOT NULL,      -- درصد سهم
  total_payments NUMERIC(12,2) DEFAULT 0    -- کل برداشت‌ها
);
```

### 5. **expenses** (جدول مصارف روزانه)
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,                   -- تاریخ مصرف
  description TEXT NOT NULL,            -- شرح مصرف
  amount NUMERIC(10,2) NOT NULL         -- مبلغ مصرف
);
```

### 6. **profits** (جدول محاسبه سود)
```sql
CREATE TABLE profits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id VARCHAR NOT NULL,             -- شناسه فروش
  purchase_id VARCHAR NOT NULL,         -- شناسه خرید
  profit_amount NUMERIC(12,2) NOT NULL, -- مبلغ سود (فروش - خرید)
  date DATE NOT NULL                    -- تاریخ محاسبه
);
```

---

## نصب و راه‌اندازی

### الزامات
- **Node.js** (v18+)
- **PostgreSQL** (v12+)
- **npm** یا **yarn**

### مراحل نصب

#### 1. کلون کردن و نصب پکیج‌ها
```bash
git clone <repo-url>
cd mobile-shop-dashboard
npm install
```

#### 2. تنظیم متغیرهای محیطی
فایل `.env` را ایجاد کنید:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/mobile_shop
NODE_ENV=development
PORT=5000
```

#### 3. اجرای مایگریشن‌های دیتابیس
```bash
npm run db:push
```

#### 4. اجرای پروژه

**برای development:**
```bash
npm run dev
```

**برای production:**
```bash
npm run build
npm run start
```

سرور روی `http://localhost:5000` راه‌اندازی خواهد شد.

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

---

### 📦 PURCHASES (خریدها)

#### ایجاد خرید جدید
```http
POST /api/purchases
Content-Type: application/json

{
  "supplier": "Dubai Mobile",
  "date": "2024-03-15",
  "billNo": "B-001",
  "model": "iPhone 15 Pro",
  "serial": "SN839210",
  "color": "Titanium",
  "unitPrice": "950",
  "quantity": 5,
  "totalPrice": "4750"
}
```

**پاسخ (Response):**
```json
{
  "id": "uuid-string",
  "supplier": "Dubai Mobile",
  "date": "2024-03-15",
  "billNo": "B-001",
  "model": "iPhone 15 Pro",
  "serial": "SN839210",
  "color": "Titanium",
  "unitPrice": "950",
  "quantity": 5,
  "totalPrice": "4750"
}
```

#### دریافت تمام خریدها
```http
GET /api/purchases
```

**پاسخ:**
```json
[
  {
    "id": "uuid-1",
    "supplier": "Dubai Mobile",
    "date": "2024-03-15",
    ...
  },
  {
    "id": "uuid-2",
    "supplier": "Herat Trade",
    "date": "2024-03-10",
    ...
  }
]
```

#### دریافت یک خرید خاص
```http
GET /api/purchases/:id
```

#### به‌روزرسانی خرید
```http
PUT /api/purchases/:id
Content-Type: application/json

{
  "quantity": 10
}
```

#### حذف خرید
```http
DELETE /api/purchases/:id
```

---

### 🛒 SALES (فروش‌ها)

#### ایجاد فروش جدید
```http
POST /api/sales
Content-Type: application/json

{
  "customerName": "Ahmad Reshad",
  "phone": "0799123456",
  "date": "2024-03-15",
  "model": "iPhone 15 Pro",
  "serial": "SN839210",
  "color": "Titanium",
  "salePrice": "1100",
  "quantity": 1,
  "totalPrice": "1100",
  "paidAmount": "1100",
  "remainingAmount": "0"
}
```

#### دریافت تمام فروش‌ها
```http
GET /api/sales
```

#### دریافت یک فروش خاص
```http
GET /api/sales/:id
```

#### به‌روزرسانی فروش
```http
PUT /api/sales/:id
Content-Type: application/json

{
  "paidAmount": "500",
  "remainingAmount": "600"
}
```

#### حذف فروش
```http
DELETE /api/sales/:id
```

---

### 👥 CUSTOMERS (مشتریان)

#### ایجاد مشتری جدید
```http
POST /api/customers
Content-Type: application/json

{
  "name": "Mahmood Khan",
  "phone": "0799234567",
  "debts": "0"
}
```

#### دریافت تمام مشتریان
```http
GET /api/customers
```

#### دریافت مشتری خاص
```http
GET /api/customers/:id
```

#### به‌روزرسانی مشتری
```http
PUT /api/customers/:id
Content-Type: application/json

{
  "debts": "500"
}
```

#### حذف مشتری
```http
DELETE /api/customers/:id
```

---

### 🤝 PARTNERS (شرکا)

#### ایجاد شریک جدید
```http
POST /api/partners
Content-Type: application/json

{
  "name": "Haji Abdur Rahman",
  "sharePercent": "60",
  "totalPayments": "0"
}
```

#### دریافت تمام شرکا
```http
GET /api/partners
```

#### دریافت شریک خاص
```http
GET /api/partners/:id
```

#### به‌روزرسانی شریک
```http
PUT /api/partners/:id
Content-Type: application/json

{
  "sharePercent": "50"
}
```

#### حذف شریک
```http
DELETE /api/partners/:id
```

---

### 💰 EXPENSES (مصارف)

#### ایجاد مصرف جدید
```http
POST /api/expenses
Content-Type: application/json

{
  "date": "2024-03-15",
  "description": "اجاره دوکان",
  "amount": "500"
}
```

#### دریافت تمام مصارف
```http
GET /api/expenses
```

#### دریافت مصرف خاص
```http
GET /api/expenses/:id
```

#### به‌روزرسانی مصرف
```http
PUT /api/expenses/:id
Content-Type: application/json

{
  "amount": "600"
}
```

#### حذف مصرف
```http
DELETE /api/expenses/:id
```

---

### 📊 ANALYTICS (تحلیل‌ها)

#### دریافت خلاصه مالی
```http
GET /api/analytics/summary
```

**پاسخ:**
```json
{
  "totalSales": 12500.50,
  "totalExpenses": 2000.00,
  "totalDebts": 1200.75,
  "totalProfit": 10500.50
}
```

---

## نکات آتی (Features برای تکمیل)

### 🎯 Features اولویت دار

- [ ] **صفحه گزارشات عمومی**
  - فیلتر بر اساس بازه‌های زمانی (روزانه، هفتگی، ماهانه)
  - دانلود PDF و Excel
  
- [ ] **محاسبه خودکار سود خالص**
  - ایجاد صفحه profit با نمودار روند سود
  - نمایش سود به تفکیک هر قلم محصول

- [ ] **گزارش سود شرکا**
  - محاسبه خودکار سهم هر شریک
  - نمایش تاریخچه برداشت‌ها

- [ ] **بهبود صفحه فروش (POS)**
  - اتصال به دیتابیس برای دریافت محصولات
  - اتصال به دیتابیس برای ثبت فروش
  - چاپ بل/فاکتور

- [ ] **بهبود صفحه گدام (انبار)**
  - فیلتر و جستجو در دیتابیس
  - نمایش موجودی واقعی
  - هشدار موجودی پایین

- [ ] **سیستم احراز هویت**
  - ورود کاربر با نام کاربری و رمز
  - سطح‌های دسترسی مختلف (مالک، کارمند، حسابدار)

- [ ] **بکاپ خودکار و Backup**
  - نسخه‌پشتیبانی روزانه
  - بازیابی اطلاعات

- [ ] **اطلاع‌رسانی و Notifications**
  - هشدار موجودی پایین
  - تذکر تاریخ گذشته برای قرض‌ها

---

## ساختار پروژه

```
.
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── pages/            # صفحات اصلی
│   │   ├── components/       # کامپوننت‌های React
│   │   ├── lib/              # Helper functions
│   │   └── index.css         # استایل‌های Tailwind
│   └── index.html
│
├── server/                    # Backend (Express)
│   ├── index.ts              # تنظیم سرور
│   ├── routes.ts             # API routes
│   └── storage.ts            # CRUD operations
│
├── shared/                    # Shared code
│   └── schema.ts             # جداول دیتابیس (Drizzle ORM)
│
├── migrations/               # مایگریشن‌های دیتابیس
├── drizzle.config.ts         # تنظیمات Drizzle ORM
└── package.json
```

---

## تیم و مشارکت‌کنندگان

- **مالک پروژه:** Haji Abdur Rahman Mobile Store
- **توسعه‌دهنده:** AI Assistant (Replit)

---

## مجوز

Licensed under MIT License.

---

## تماس و پشتیبانی

برای سوالات و مشکلات:
- 📧 Email: support@example.com
- 📱 Phone: +93-799-123-456

---

**آخرین به‌روزرسانی:** 26 دسمبر 2024
