# 📱 راهنمای جامع سیستم مدیریت فروشگاه موبایل حاجی عبدالرحمن

**نسخه:** 1.0.0  
**تاریخ:** 26 دسمبر 2024  
**زبان:** دری/فارسی  
**وضعیت:** آماده برای استفاده تجاری

---

## 📋 فهرست محتویات

1. [بررسی کلی](#بررسی-کلی)
2. [ویژگی‌های اصلی](#ویژگی‌های-اصلی)
3. [معماری سیستم](#معماری-سیستم)
4. [راهنمای شروع](#راهنمای-شروع)
5. [دستورالعمل کاربری](#دستورالعمل-کاربری)
6. [API Documentation](#api-documentation)
7. [نکات فنی](#نکات-فنی)
8. [حل مسائل](#حل-مسائل)

---

## بررسی کلی

**سیستم مدیریت فروشگاه موبایل** یک نرم‌افزار **تمام‌ستون (Full-Stack)** برای مدیریت دکان فروش تلیفون‌های همراه است.

### مزایا:
- ✅ **اتوماسیون کامل:** فروش → گزارش سود → باقیات
- ✅ **رابط کاربری مدرن:** طراحی واقعی RTL
- ✅ **داده‌های دائمی:** ذخیره در PostgreSQL
- ✅ **فاتورة حرفه‌ای:** قابل چاپ و ذخیره PDF
- ✅ **گزارشات مالی:** تحلیل سود/زیان دقیق
- ✅ **مدیریت شرکا:** تقسیم سود بر اساس درصد

---

## ویژگی‌های اصلی

### ۷ بخش اصلی سیستم:

#### 1️⃣ **داشبورد مدیریتی** (Dashboard)
```
مسیر: /
نمایش:
- کل فروش‌های ثبت‌شده
- کل مصارف
- طلب از مشتریان
- سود خالص
- نمودارهای درآمد
- لیست آخرین فروش‌ها
```

#### 2️⃣ **مدیریت گدام** (Inventory)
```
مسیر: /inventory
عملیات:
- ثبت خریدهای جدید
- مشاهده موجودی
- جستجو و فیلتر
- نمایش ارزش کل گدام
- حذف خریدهای اشتباه

فیلدهای ثبت:
- نام تأمین‌کننده
- تاریخ خرید
- شماره بل
- مدل/رنگ/سریال
- قیمت واحد و تعداد
```

#### 3️⃣ **فروش و صدور بل** (POS/Sales)
```
مسیر: /sales
جریان کاری:
1. جستجو محصول در گدام
2. انتخاب محصول
3. وارد کردن قیمت فروش دستی
4. مشخصات مشتری (نام، تماس)
5. مبلغ دریافتی
6. ثبت فروش فوری
7. نمایش و چاپ فاتورة

فاتورة شامل:
- نام فروشگاه و شماره
- مشخصات مشتری
- جدول محصول‌ها
- خلاصة مالی (مجموع، رسید، باقی)
- تاریخ/ساعت و امضا
```

#### 4️⃣ **مدیریت باقیات** (Debts)
```
مسیر: /debts
مشاهده:
- لیست کسانی که قرض دارند
- مبلغ دریافت‌شده
- مبلغ باقی‌مانده
- تاریخ خرید

عملیات:
- دریافت پرداخت اضافی
- ثبت رسید
- هشدار قرض‌های قدیمی
```

#### 5️⃣ **تقسیم عواید** (Partners)
```
مسیر: /partners
مدیریت:
- افزودن شریک جدید
- تعیین درصد سهم
- محاسبه خودکار سود هر شریک
- نمایش سهم قابل برداشت

مثال:
کل سود: $1000
شریک 1 (60%): $600 قابل برداشت
شریک 2 (40%): $400 قابل برداشت
```

#### 6️⃣ **سود و تحلیل** (Profit Analysis)
```
مسیر: /profit
نمایش:
- سود خالص کل
- نسبت سود (درصد)
- روند سود (نمودار 30 روز)
- تفکیک درآمد و مصارف
- تحلیل مقایسه‌ای
```

#### 7️⃣ **گزارشات و مصارف** (Reports & Expenses)
```
مسیر 1: /reports
- لیست تمام فروش‌ها
- لیست تمام مصارف
- خلاصة مالی
- دانلود به PDF

مسیر 2: /expenses
- ثبت مصارف روزانه
- انواع: اجاره، برق، آب، دستمزد
- جستجو و حذف
- محاسبه کل مصارف
```

---

## معماری سیستم

### Stack فنی:

```
┌─────────────────────────────────────────────────┐
│            Frontend (React 19)                   │
│  - Pages: 8 صفحه فاصل                          │
│  - Components: 50+ کامپوننت                     │
│  - Styling: Tailwind CSS v4                     │
│  - Forms: React Hook Form                       │
│  - API: React Query (TanStack Query)            │
│  - Routing: Wouter                              │
│  - RTL: راست‌به‌چپ کامل                        │
└─────────────────────────────────────────────────┘
                       ↕ (HTTP/REST)
┌─────────────────────────────────────────────────┐
│         Backend (Node.js + Express)             │
│  - API Routes: 30+ endpoints                    │
│  - Validation: Zod                              │
│  - ORM: Drizzle ORM                             │
│  - Database: PostgreSQL                         │
│  - Error Handling: Custom middleware            │
└─────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────┐
│        Database (PostgreSQL)                     │
│  - 6 جداول اصلی                                │
│  - Relations: شامل                              │
│  - Constraints: Primary/Foreign Keys            │
└─────────────────────────────────────────────────┘
```

### جداول دیتابیس:

```sql
purchases (خریدها)
├─ id: UUID
├─ supplier: نام تأمین‌کننده
├─ date: تاریخ خرید
├─ billNo: شماره بل
├─ model: مدل گوشی
├─ serial: سریال نمبر
├─ color: رنگ
├─ unitPrice: قیمت واحد
├─ quantity: تعداد
└─ totalPrice: قیمت کل

sales (فروش‌ها)
├─ id: UUID
├─ customerName: نام مشتری
├─ phone: شماره تماس
├─ date: تاریخ فروش
├─ model: مدل گوشی
├─ serial: سریال نمبر
├─ color: رنگ
├─ salePrice: قیمت فروش
├─ quantity: تعداد
├─ totalPrice: قیمت کل
├─ paidAmount: مبلغ دریافتی
└─ remainingAmount: باقی‌مانده

customers (مشتریان)
├─ id: UUID
├─ name: نام
├─ phone: شماره تماس (منحصر)
└─ debts: کل قرض

partners (شرکا)
├─ id: UUID
├─ name: نام شریک
├─ sharePercent: درصد سهم
└─ totalPayments: کل برداشت‌ها

expenses (مصارف)
├─ id: UUID
├─ date: تاریخ
├─ description: شرح
└─ amount: مبلغ

profits (محاسبه سود)
├─ id: UUID
├─ saleId: شناسة فروش
├─ purchaseId: شناسة خرید
├─ profitAmount: مبلغ سود
└─ date: تاریخ
```

---

## راهنمای شروع

### الزامات سخت‌افزاری:

```bash
- Node.js: v18 یا جدیدتر
- npm: v9 یا جدیدتر
- PostgreSQL: v12 یا جدیدتر
- RAM: حداقل 2GB
- فضای ذخیره: 500MB
```

### مراحل نصب:

#### 1. کلون و نصب
```bash
# کلون مخزن
git clone <repo-url>
cd mobile-shop-dashboard

# نصب پکیج‌ها
npm install
```

#### 2. تنظیم دیتابیس
```bash
# ایجاد فایل .env
cat > .env << EOF
DATABASE_URL=postgresql://username:password@localhost:5432/mobile_shop
NODE_ENV=development
PORT=5000
EOF

# مایگریشن دیتابیس
npm run db:push
```

#### 3. اجرای سیستم

**برای Development:**
```bash
npm run dev
# سرور در http://localhost:5000 باز می‌شود
```

**برای Production:**
```bash
npm run build
npm run start
```

---

## دستورالعمل کاربری

### جریان کاری کامل (مثال):

#### **سناریو:** فروش یک گوشی اپل

**مرحلة 1: ثبت خرید اولیه**
```
1. رفتن به صفحة "گدام"
2. کلیک بر "جنس جدید"
3. پر کردن فرم:
   - تأمین‌کننده: Dubai Mobile
   - تاریخ: 2024-12-26
   - شماره بل: B-2024001
   - مدل: iPhone 15 Pro
   - سریال: SN839210
   - رنگ: Black
   - قیمت واحد: $950
   - تعداد: 2
   - قیمت کل: $1900
4. کلیک "ثبت خرید"
```

**مرحلة 2: فروش محصول**
```
1. رفتن به صفحة "فروش و بیجک"
2. کلیک "ثبت فروش جدید"
3. جستجو: "iPhone 15"
4. انتخاب محصول
5. وارد کردن فیلدها:
   - نام مشتری: Ahmad Reshad
   - تماس: 0799123456
   - تاریخ: 2024-12-26
   - قیمت فروش: $1200 (دستی!)
   - تعداد: 1
   - مبلغ دریافتی: $1200
6. کلیک "ثبت فروش"
7. فاتورة نمایش داده می‌شود
8. کلیک "چاپ فاتورة" یا "ذخیره PDF"
```

**مرحلة 3: بررسی سود**
```
1. رفتن به صفحة "سود و تحلیل"
2. دیدن خودکار:
   - کل فروش: $1200
   - کل مصارف: (مثلاً) $50
   - سود خالص: $1150
   - نسبت سود: 95.8%
3. نمودار روند 30 روز قبلی
```

**مرحلة 4: ثبت مصارف روزانه**
```
1. رفتن به صفحة "مصارف"
2. کلیک "مصرف جدید"
3. مثال‌ها:
   - اجاره دوکان: $100
   - برق: $25
   - آب: $10
4. کلیک "ثبت مصرف"
5. مصارف به طور خودکار از سود کم می‌شوند
```

**مرحلة 5: مدیریت شرکا**
```
1. رفتن به صفحة "شرکا"
2. شریک 1: 60%
3. شریک 2: 40%
4. سیستم خودکار محاسبه می‌کند:
   - سود نهایی: $1100 (بعد از مصارف)
   - شریک 1: $660
   - شریک 2: $440
```

**مرحلة 6: مشاهدة گزارشات**
```
1. رفتن به صفحة "گزارشات عمومی"
2. دیدن خلاصة:
   - کل فروش: $1200
   - کل مصارف: $135
   - سود خالص: $1065
3. دانلود به PDF یا Excel
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### **PURCHASES (خریدها)**

```http
POST /api/purchases
Content-Type: application/json

{
  "supplier": "Dubai Mobile",
  "date": "2024-12-26",
  "billNo": "B-001",
  "model": "iPhone 15 Pro",
  "serial": "SN839210",
  "color": "Black",
  "unitPrice": "950",
  "quantity": 5,
  "totalPrice": "4750"
}

Response: 201 Created
{
  "id": "uuid",
  "supplier": "Dubai Mobile",
  ...
}
```

```http
GET /api/purchases
Response: 200 OK
[
  {
    "id": "uuid",
    "supplier": "Dubai Mobile",
    ...
  },
  ...
]
```

```http
GET /api/purchases/:id
PUT /api/purchases/:id
DELETE /api/purchases/:id
```

#### **SALES (فروش‌ها)**

```http
POST /api/sales
Content-Type: application/json

{
  "customerName": "Ahmad Reshad",
  "phone": "0799123456",
  "date": "2024-12-26",
  "model": "iPhone 15 Pro",
  "serial": "SN839210",
  "color": "Black",
  "salePrice": "1200",
  "quantity": 1,
  "totalPrice": "1200",
  "paidAmount": "1200",
  "remainingAmount": "0"
}

Response: 201 Created
```

#### **CUSTOMERS (مشتریان)**

```http
POST /api/customers
{
  "name": "Ahmad Reshad",
  "phone": "0799123456",
  "debts": "0"
}

GET /api/customers
GET /api/customers/:id
PUT /api/customers/:id
DELETE /api/customers/:id
```

#### **PARTNERS (شرکا)**

```http
POST /api/partners
{
  "name": "Haji Abdur Rahman",
  "sharePercent": "60",
  "totalPayments": "0"
}

GET /api/partners
GET /api/partners/:id
PUT /api/partners/:id
DELETE /api/partners/:id
```

#### **EXPENSES (مصارف)**

```http
POST /api/expenses
{
  "date": "2024-12-26",
  "description": "اجاره دوکان",
  "amount": "100"
}

GET /api/expenses
GET /api/expenses/:id
PUT /api/expenses/:id
DELETE /api/expenses/:id
```

#### **ANALYTICS (تحلیل‌ها)**

```http
GET /api/analytics/summary

Response: 200 OK
{
  "totalSales": 5400.00,
  "totalExpenses": 135.00,
  "totalDebts": 400.00,
  "totalProfit": 5265.00
}
```

---

## نکات فنی

### معماری Frontend

```
client/src/
├── pages/              # 8 صفحة اصلی
│   ├── dashboard.tsx
│   ├── inventory.tsx
│   ├── sales.tsx
│   ├── debts.tsx
│   ├── partners.tsx
│   ├── profit.tsx
│   ├── reports.tsx
│   └── expenses.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   └── stats-card.tsx
│   ├── sales/
│   │   └── invoice.tsx
│   └── ui/             # Shadcn components
├── hooks/
│   └── useApi.ts       # 20+ hooks برای API
├── lib/
│   ├── queryClient.ts
│   └── utils.ts
└── App.tsx             # Router
```

### معماری Backend

```
server/
├── index.ts            # Server setup
├── routes.ts           # 30+ API endpoints
├── storage.ts          # CRUD operations
└── static.ts

shared/
└── schema.ts           # Database schema (Drizzle)
```

### State Management

```
React Query (TanStack Query):
- useQuery: فیچ کردن داده
- useMutation: ثبت/تغییر/حذف داده
- useQueryClient: Cache management
```

### Form Handling

```
React Hook Form + Zod:
- Validation: سمت کلاینت
- Error messages: نمایش خودکار
- Toast notifications: Sonner
```

---

## حل مسائل

### مسئلة 1: خطای اتصال دیتابیس

```bash
خطا: "DATABASE_URL not configured"

حل:
1. بررسی فایل .env
2. اطمینان از صحیح بودن رشته اتصال
3. بررسی وضعیت PostgreSQL:
   sudo systemctl status postgresql

4. اگر PostgreSQL متوقف است:
   sudo systemctl start postgresql
```

### مسئلة 2: صفحه خالی یا بدون داده

```bash
خطا: "No data showing"

حل:
1. بازگذاری صفحه (F5)
2. بررسی Console (F12)
3. بررسی Network tab برای API errors
4. اگر API Error: بررسی backend logs
```

### مسئلة 3: بدون اتصال انترنت (Offline)

```bash
حالت فعلی:
- React Query cached data نمایش داده می‌شود
- نوشتن درخواست‌ها ممکن نیست

بهبود برای آینده:
- Service Workers برای offline support
- LocalStorage as fallback
```

### مسئلة 4: فاتورة چاپ نمی‌شود

```bash
حل:
1. بررسی فیلتر Print Preview (Ctrl+P)
2. تنظیم Margins: "None"
3. Orientation: Portrait
4. اگر بازهم مشکل: Screenshot + Print به PDF
```

---

## نکات نگهداری

### بکاپ دیتابیس

```bash
# دانلود بکاپ
pg_dump -h localhost -U username mobile_shop > backup.sql

# بازگردانی بکاپ
psql -h localhost -U username mobile_shop < backup.sql
```

### بهروزرسانی سیستم

```bash
# دریافت آخرین تغييرات
git pull

# نصب پکیج‌های جدید
npm install

# مایگریشن دیتابیس
npm run db:push

# ریبیلد
npm run build
```

### نمایش لاگ‌ها

```bash
# Frontend logs:
Chrome DevTools (F12)

# Backend logs:
Console output هنگام npm run dev
```

---

## نکات آتی برای بهبود

- [ ] سیستم احراز هویت (Login/Register)
- [ ] سطح‌های دسترسی (Admin/User/Viewer)
- [ ] بارکد اسکن برای گدام
- [ ] Offline mode کامل (Service Workers)
- [ ] Mobile app (React Native)
- [ ] Email receipts برای مشتریان
- [ ] SMS reminder برای قرض‌های باقی
- [ ] صادرات داده به Excel/CSV
- [ ] بکاپ خودکار روزانه
- [ ] Analytics بیشتر (نمودارهای پیشرفته)

---

## تماس و پشتیبانی

- **ایمیل:** support@example.com
- **تماس:** +93-799-123-456
- **ساعات کاری:** شنبه تا چهارشنبه، 9 صبح تا 5 عصر

---

**نسخة 1.0.0 - تمام حقوق محفوظ است © 2024**
