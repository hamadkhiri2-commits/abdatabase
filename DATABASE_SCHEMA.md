# 🗄️ طرح دیتابیس (Database Schema)

راهنمای کامل طرح دیتابیس برای سیستم مدیریت فروشگاه موبایل.

---

## 📋 فهرست

1. [مقدمه](#مقدمه)
2. [جداول اصلی](#جداول-اصلی)
3. [تعریفات تفصیلی](#تعریفات-تفصیلی)
4. [روابط بین جداول](#روابط-بین-جداول)
5. [نمایش‌ها (Views)](#نمایش‌های-views)

---

## 📖 مقدمه

- **سیستم مدیریت دیتابیس**: PostgreSQL 12+
- **ORM**: Drizzle ORM
- **زبان قید**: TypeScript
- **Encoding**: UTF-8
- **Locale**: C

---

## 🗂️ جداول اصلی

### 1️⃣ جدول `products` (محصولات)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,              -- نام محصول
  model TEXT NOT NULL,              -- مدل
  color TEXT NOT NULL,              -- رنگ
  serial TEXT NOT NULL UNIQUE,       -- سریال نمبر (منحصر‌به‌فرد)
  buy_price DECIMAL(10,2) NOT NULL,  -- قیمت خرید
  sell_price DECIMAL(10,2) NOT NULL, -- قیمت فروش
  stock INTEGER NOT NULL DEFAULT 0,  -- موجودی
  supplier TEXT NOT NULL,            -- تامین‌کننده
  date_added DATE NOT NULL DEFAULT CURRENT_DATE -- تاریخ اضافه
);

CREATE INDEX idx_products_serial ON products(serial);
CREATE INDEX idx_products_name ON products(name);
```

**ستون‌ها:**
| ستون | نوع | الزامی | توضیح |
|------|-----|--------|-------|
| id | UUID | ✅ | شناسة منحصر‌به‌فرد |
| name | TEXT | ✅ | نام محصول |
| model | TEXT | ✅ | مدل (مثال: 256GB) |
| color | TEXT | ✅ | رنگ |
| serial | TEXT | ✅ | سریال نمبر |
| buy_price | DECIMAL | ✅ | قیمت خرید |
| sell_price | DECIMAL | ✅ | قیمت فروش |
| stock | INTEGER | ✅ | موجودی |
| supplier | TEXT | ✅ | نام تامین‌کننده |
| date_added | DATE | ✅ | تاریخ ثبت |

---

### 2️⃣ جدول `sales` (فروش‌ها)

```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,      -- شماره فاکتور (INV-[timestamp])
  customer_name TEXT NOT NULL,              -- نام مشتری
  date DATE NOT NULL DEFAULT CURRENT_DATE,  -- تاریخ فروش
  items JSONB NOT NULL,                     -- فهرست آیتم‌های فروخته‌شده
  total_price DECIMAL(12,2) NOT NULL,       -- مجموع قیمت فروش
  cost_price DECIMAL(12,2) NOT NULL,        -- مجموع قیمت خرید
  net_profit DECIMAL(12,2) NOT NULL,        -- فایده خالص (auto-calc)
  paid_amount DECIMAL(12,2) DEFAULT 0,      -- مبلغ دریافتی
  remaining_amount DECIMAL(12,2) DEFAULT 0, -- مبلغ باقی‌مانده (قرض)
  status TEXT NOT NULL DEFAULT 'completed', -- وضعیت: completed | debt
  notes TEXT,                                -- یادداشت‌ها
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_customer ON sales(customer_name);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
```

**ستون‌ها:**
| ستون | نوع | الزامی | توضیح |
|------|-----|--------|-------|
| id | UUID | ✅ | شناسة منحصر‌به‌فرد |
| invoice_number | TEXT | ✅ | شماره فاکتور خودکار |
| customer_name | TEXT | ✅ | نام مشتری |
| date | DATE | ✅ | تاریخ فروش |
| items | JSONB | ✅ | لیست محصولات فروخته‌شده |
| total_price | DECIMAL | ✅ | مجموع فروش |
| cost_price | DECIMAL | ✅ | مجموع قیمت خرید |
| net_profit | DECIMAL | ✅ | فایده = total_price - cost_price |
| paid_amount | DECIMAL | ❌ | مبلغ پرداختی |
| remaining_amount | DECIMAL | ❌ | مبلغ قرض |
| status | TEXT | ✅ | completed / debt |
| notes | TEXT | ❌ | یادداشت‌های اضافی |

**ساختار `items` JSON:**
```json
[
  {
    "productId": "uuid",
    "productName": "iPhone 15 Pro",
    "qty": 1,
    "costPrice": 950,
    "salePrice": 1100
  }
]
```

---

### 3️⃣ جدول `daily_expenses` (مصارف روزمره)

```sql
CREATE TABLE daily_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,  -- تاریخ مصرف
  description TEXT NOT NULL,                 -- توضیح (اجاره، برق، آب، ...)
  amount DECIMAL(10,2) NOT NULL,            -- مبلغ مصرف
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_daily_expenses_date ON daily_expenses(date);
CREATE INDEX idx_daily_expenses_created ON daily_expenses(created_at);
```

**ستون‌ها:**
| ستون | نوع | الزامی | توضیح |
|------|-----|--------|-------|
| id | UUID | ✅ | شناسة منحصر‌به‌فرد |
| date | DATE | ✅ | تاریخ مصرف |
| description | TEXT | ✅ | توضیح مصرف |
| amount | DECIMAL | ✅ | مبلغ |
| created_at | TIMESTAMP | ✅ | تاریخ و زمان ثبت |

---

### 4️⃣ جدول `debts` (قرض‌ها)

```sql
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,              -- نام مشتری
  amount DECIMAL(12,2) NOT NULL,            -- مبلغ قرض
  sale_id UUID REFERENCES sales(id),        -- شناسة فروش مرتبط
  due_date DATE,                            -- تاریخ سررسید
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | paid
  notes TEXT,                                -- یادداشت‌ها
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_debts_customer ON debts(customer_name);
CREATE INDEX idx_debts_status ON debts(status);
CREATE INDEX idx_debts_due_date ON debts(due_date);
CREATE INDEX idx_debts_sale_id ON debts(sale_id);
```

**ستون‌ها:**
| ستون | نوع | الزامی | توضیح |
|------|-----|--------|-------|
| id | UUID | ✅ | شناسة منحصر‌به‌فرد |
| customer_name | TEXT | ✅ | نام مشتری |
| amount | DECIMAL | ✅ | مبلغ |
| sale_id | UUID | ❌ | ارجاع به فروش |
| due_date | DATE | ❌ | تاریخ سررسید |
| status | TEXT | ✅ | pending / paid |
| notes | TEXT | ❌ | یادداشت‌ها |

---

### 5️⃣ جدول `partners` (شرکا)

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                       -- نام شریک
  percentage DECIMAL(5,2) NOT NULL,         -- درصد سهم (0-100)
  profit_share DECIMAL(12,2) DEFAULT 0,     -- سهم سود (auto-calc)
  join_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_partners_name ON partners(name);
```

**ستون‌ها:**
| ستون | نوع | الزامی | توضیح |
|------|-----|--------|-------|
| id | UUID | ✅ | شناسة منحصر‌به‌فرد |
| name | TEXT | ✅ | نام شریک |
| percentage | DECIMAL | ✅ | درصد سهم |
| profit_share | DECIMAL | ❌ | سهم سود (auto) |
| join_date | DATE | ✅ | تاریخ پیوستن |

---

## 🔗 روابط بین جداول

### Foreign Keys:

```sql
-- sales -> products (one-to-many)
-- (محفوظ در JSONB items)

-- debts -> sales (many-to-one)
ALTER TABLE debts 
ADD CONSTRAINT fk_debts_sales 
FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE;
```

### Diagram:

```
products ←─┐
           │ (items JSONB)
sales ─────┘
    │
    └─→ debts (one-to-many)

daily_expenses (مستقل)
partners (مستقل)
```

---

## 📊 نمایش‌ها (Views)

### View 1: خلاصة روزانه

```sql
CREATE VIEW daily_summary AS
SELECT
  DATE(s.date) as summary_date,
  COUNT(s.id) as sales_count,
  SUM(s.total_price) as total_sales,
  SUM(s.net_profit) as total_profit,
  SUM(de.amount) as total_expenses,
  (SUM(s.total_price) - COALESCE(SUM(de.amount), 0)) as daily_net_income
FROM sales s
LEFT JOIN daily_expenses de ON DATE(s.date) = de.date
GROUP BY DATE(s.date)
ORDER BY summary_date DESC;
```

### View 2: خلاصة مشتریان

```sql
CREATE VIEW customer_summary AS
SELECT
  s.customer_name,
  COUNT(s.id) as purchase_count,
  SUM(s.total_price) as total_spent,
  SUM(s.remaining_amount) as debt_amount
FROM sales s
GROUP BY s.customer_name
ORDER BY total_spent DESC;
```

### View 3: خلاصة محصولات

```sql
CREATE VIEW product_sales_summary AS
SELECT
  p.name,
  p.model,
  p.color,
  SUM((s.items ->> 'qty')::int) as total_sold,
  p.stock as current_stock,
  SUM(s.net_profit) as total_profit
FROM products p
LEFT JOIN sales s ON s.items @> jsonb_build_array(jsonb_build_object('productId', p.id::text))
GROUP BY p.id, p.name, p.model, p.color, p.stock;
```

---

## 🔑 Constraints و Rules

### NOT NULL Constraints:
- تمام `id` و `name` و `date` الزامی هستند
- قیمت‌ها منفی نمی‌تواند باشند

### UNIQUE Constraints:
- `products.serial`: سریال منحصر‌به‌فرد
- `sales.invoice_number`: شماره فاکتور منحصر‌به‌فرد

### CHECK Constraints:
```sql
ALTER TABLE products ADD CHECK (buy_price >= 0);
ALTER TABLE products ADD CHECK (sell_price >= 0);
ALTER TABLE sales ADD CHECK (total_price >= 0);
ALTER TABLE partners ADD CHECK (percentage >= 0 AND percentage <= 100);
```

---

## 💾 دستورات مهم

### Backup دیتابیس:
```bash
pg_dump -U shop_user -d mobile_shop > backup.sql
```

### Restore دیتابیس:
```bash
psql -U shop_user -d mobile_shop < backup.sql
```

### بررسی اندازة جداول:
```sql
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname != 'pg_catalog'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### حذف تمام داده‌ها (احتیاط!):
```sql
TRUNCATE TABLE sales CASCADE;
TRUNCATE TABLE daily_expenses CASCADE;
TRUNCATE TABLE debts CASCADE;
TRUNCATE TABLE partners CASCADE;
TRUNCATE TABLE products CASCADE;
```

---

## 📈 بهینه‌سازی

### Indexing:
- تمام فیلدهای جستجو‌شدة فرکانس زیاد indexed هستند
- `date`, `customer_name`, `status` indexed هستند

### Query Optimization:
- استفاده از JSONB برای flexibility
- استفاده از Views برای خلاصه‌های پیچیده
- استفاده از Indexes برای JOIN‌ها

---

## 🔐 امنیت

### Authorization:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO shop_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO shop_user;
```

### Row-Level Security (اختیاری):
```sql
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY sales_access ON sales USING (true) WITH CHECK (true);
```

---

**آخرین آپدیت**: دسامبر 2024  
**نسخة Schema**: 1.0.0
