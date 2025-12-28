# 🔌 API Documentation

راهنمای کامل API endpoints برای سیستم مدیریت فروشگاه موبایل.

---

## 📋 فهرست

1. [معلومات کلی](#معلومات-کلی)
2. [محصولات (Products)](#محصولات-products)
3. [فروش‌ها (Sales)](#فروش‌ها-sales)
4. [مصارف روزمره (Daily Expenses)](#مصارف-روزمره-daily-expenses)
5. [قرض‌ها (Debts)](#قرض‌ها-debts)
6. [شرکا (Partners)](#شرکا-partners)
7. [تحلیل (Analytics)](#تحلیل-analytics)

---

## 📡 معلومات کلی

### Base URL
```
http://localhost:3000/api
```

### محتوای درخواست و پاسخ
```
Content-Type: application/json
```

### کدهای وضعیت HTTP
- `200 OK`: درخواست موفق
- `201 Created`: منبع جدید ایجاد شد
- `400 Bad Request`: خطای ورودی
- `404 Not Found`: منبع یافت نشد
- `500 Server Error`: خطای سرور

---

## 📱 محصولات (Products)

### لیست تمام محصولات
```
GET /api/products
```

**پاسخ موفق:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 15 Pro",
      "model": "256GB",
      "color": "Titanium",
      "serial": "SN839210",
      "buyPrice": 950,
      "sellPrice": 1100,
      "stock": 5,
      "supplier": "Dubai Mobile",
      "dateAdded": "2024-03-01"
    }
  ]
}
```

### افزودن محصول جدید
```
POST /api/products
```

**درخواست:**
```json
{
  "name": "iPhone 15 Pro",
  "model": "256GB",
  "color": "Titanium",
  "serial": "SN839210",
  "buyPrice": 950,
  "sellPrice": 1100,
  "stock": 5,
  "supplier": "Dubai Mobile"
}
```

**پاسخ:**
```json
{
  "status": "success",
  "data": { "id": "uuid", ... }
}
```

### ویرایش محصول
```
PUT /api/products/:id
```

### حذف محصول
```
DELETE /api/products/:id
```

---

## 🛒 فروش‌ها (Sales)

### لیست تمام فروش‌ها
```
GET /api/sales
```

**پاسخ:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "INV-1701234567890",
      "invoiceNumber": "INV-001",
      "customerName": "Ahmad Reshad",
      "date": "2024-03-15",
      "items": [
        {
          "productId": "uuid",
          "productName": "iPhone 15 Pro",
          "qty": 1,
          "costPrice": 950,
          "salePrice": 1100
        }
      ],
      "totalPrice": 1100,
      "costPrice": 950,
      "netProfit": 150,
      "paidAmount": 1100,
      "remainingAmount": 0,
      "status": "completed",
      "notes": ""
    }
  ]
}
```

### ثبت فروش جدید
```
POST /api/sales
```

**درخواست:**
```json
{
  "customerName": "Ahmad Reshad",
  "items": [
    {
      "productId": "uuid",
      "productName": "iPhone 15 Pro",
      "qty": 1,
      "costPrice": 950,
      "salePrice": 1100
    }
  ],
  "paidAmount": 1100,
  "notes": "نقدی"
}
```

**پاسخ:**
```json
{
  "status": "success",
  "data": {
    "id": "INV-1701234567890",
    "invoiceNumber": "INV-001",
    "totalPrice": 1100,
    "costPrice": 950,
    "netProfit": 150,
    ...
  }
}
```

### ویرایش فروش
```
PUT /api/sales/:id
```

### حذف فروش
```
DELETE /api/sales/:id
```

---

## 📊 مصارف روزمره (Daily Expenses)

### لیست تمام مصارف
```
GET /api/daily-expenses
```

**پاسخ:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "date": "2024-03-15",
      "description": "اجاره دوکان",
      "amount": 500,
      "createdAt": "2024-03-15T10:30:00Z"
    }
  ]
}
```

### افزودن مصرف جدید
```
POST /api/daily-expenses
```

**درخواست:**
```json
{
  "date": "2024-03-15",
  "description": "اجاره دوکان",
  "amount": 500
}
```

**پاسخ:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "date": "2024-03-15",
    "description": "اجاره دوکان",
    "amount": 500
  }
}
```

### ویرایش مصرف
```
PUT /api/daily-expenses/:id
```

**درخواست:**
```json
{
  "date": "2024-03-15",
  "description": "اجاره دوکان",
  "amount": 550
}
```

### حذف مصرف
```
DELETE /api/daily-expenses/:id
```

---

## 💳 قرض‌ها (Debts)

### لیست تمام قرض‌ها
```
GET /api/debts
```

**پاسخ:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "customerName": "Mahmood Khan",
      "amount": 400,
      "saleId": "INV-xxx",
      "dueDate": "2024-04-15",
      "status": "pending",
      "notes": "برای روز شنبه"
    }
  ]
}
```

### افزودن قرض جدید
```
POST /api/debts
```

**درخواست:**
```json
{
  "customerName": "Mahmood Khan",
  "amount": 400,
  "saleId": "INV-xxx",
  "dueDate": "2024-04-15",
  "notes": "برای روز شنبه"
}
```

### ویرایش قرض
```
PUT /api/debts/:id
```

### حذف قرض
```
DELETE /api/debts/:id
```

### علامت‌گذاری قرض به‌عنوان پرداخت‌شده
```
PUT /api/debts/:id/pay
```

---

## 👥 شرکا (Partners)

### لیست تمام شرکا
```
GET /api/partners
```

**پاسخ:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "علی",
      "percentage": 50,
      "profitShare": 1500,
      "joinDate": "2024-01-01"
    }
  ]
}
```

### افزودن شریک جدید
```
POST /api/partners
```

**درخواست:**
```json
{
  "name": "علی",
  "percentage": 50
}
```

### ویرایش شریک
```
PUT /api/partners/:id
```

### حذف شریک
```
DELETE /api/partners/:id
```

---

## 📈 تحلیل (Analytics)

### خلاصة کلی (Overview)
```
GET /api/analytics/overview
```

**پاسخ:**
```json
{
  "status": "success",
  "data": {
    "totalSales": 5500,
    "totalCost": 3800,
    "totalNetProfit": 1700,
    "totalDebts": 400,
    "totalExpenses": 1200,
    "inventoryValue": 8950
  }
}
```

### خلاصة روزانه (Daily Summary)
```
GET /api/analytics/daily
```

**پاسخ:**
```json
{
  "status": "success",
  "data": [
    {
      "date": "2024-03-15",
      "salesCount": 3,
      "totalSales": 1500,
      "totalProfit": 350,
      "totalExpenses": 500,
      "dailyNetIncome": 850
    }
  ]
}
```

### خلاصة ماهانه (Monthly Summary)
```
GET /api/analytics/monthly
```

**پاسخ:**
```json
{
  "status": "success",
  "data": [
    {
      "month": "2024-03",
      "totalSales": 15000,
      "totalProfit": 4500,
      "totalExpenses": 3000,
      "monthlyNetIncome": 1500
    }
  ]
}
```

### اطلاعات تحلیلی (Analytics Info)
```
GET /api/analytics/info
```

**پاسخ:**
```json
{
  "status": "success",
  "data": {
    "totalCapital": 3800,
    "totalNetProfit": 1700,
    "totalDailyExpenses": 1200,
    "dailyNetIncome": 500,
    "averageSalePrice": 550,
    "averageProfitMargin": "25%"
  }
}
```

### فیلترینگ بر اساس تاریخ (Date Filter)
```
GET /api/analytics/summary?startDate=2024-03-01&endDate=2024-03-31
```

---

## ❌ خطاها (Error Responses)

### خطای عمومی
```json
{
  "status": "error",
  "message": "توضیح خطا",
  "code": "ERROR_CODE"
}
```

### مثال: محصول یافت نشد
```json
{
  "status": "error",
  "message": "محصول یافت نشد",
  "code": "PRODUCT_NOT_FOUND"
}
```

### مثال: داده نامعتبر
```json
{
  "status": "error",
  "message": "داده‌های نامعتبر",
  "code": "INVALID_DATA",
  "errors": [
    {
      "field": "name",
      "message": "نام الزامی است"
    }
  ]
}
```

---

## 🔄 نمونة کامل: ثبت فروش

### مرحله 1: دریافت محصولات
```bash
curl -X GET http://localhost:3000/api/products
```

### مرحله 2: ثبت فروش
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "احمد",
    "items": [
      {
        "productId": "uuid",
        "productName": "iPhone 15",
        "qty": 1,
        "costPrice": 950,
        "salePrice": 1100
      }
    ],
    "paidAmount": 1100,
    "notes": "نقدی"
  }'
```

### مرحله 3: دریافت آخرین فروش‌ها
```bash
curl -X GET http://localhost:3000/api/sales
```

---

## 🧪 تست API با Postman

### وارد کردن Collection:

1. باز کردن Postman
2. انتخاب "Import"
3. انتخاب فایل `postman_collection.json`
4. تست تمام endpoints

---

## 📝 نکات مهم

1. **ترتیب ای دی**: استفاده از UUID برای امنیت
2. **تاریخ**: استفاده از فرمت ISO 8601 (YYYY-MM-DD)
3. **اعداد اعشاری**: استفاده از decimal برای مالیات
4. **توثیق**: تمام درخواست‌ها بدون احراز هویت (برای حال)
5. **Rate Limiting**: هیچ محدودیتی نیست (برای توسعه)

---

**آخرین آپدیت**: دسامبر 2024  
**نسخة API**: 1.0.0
