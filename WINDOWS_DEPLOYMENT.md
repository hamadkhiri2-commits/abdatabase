# 🪟 راهنمای نصب و اجرای سیستم بر روی Windows

راهنمای جامع برای نصب و اجرای سیستم مدیریت فروشگاه موبایل بر روی Windows.

---

## 📋 فهرست

1. [پیش‌نیازها](#پیش‌نیازها)
2. [نصب مرحله به مرحله](#نصب-مرحله-به-مرحله)
3. [راه‌اندازی دیتابیس PostgreSQL](#راه‌اندازی-دیتابیس-postgresql)
4. [اجرای برنامه](#اجرای-برنامه)
5. [ایجاد فایل‌های Batch برای خودکار کردن](#ایجاد-فایل‌های-batch)
6. [راه‌اندازی Windows Service](#راه‌اندازی-windows-service)
7. [رفع مشکلات](#رفع-مشکلات)

---

## 🔧 پیش‌نیازها

### الزامی:
- **Windows 10/11 64-bit**
- **Node.js 18 یا بالاتر** ([دانلود](https://nodejs.org/))
- **PostgreSQL 12 یا بالاتر** ([دانلود](https://www.postgresql.org/download/windows/))
- **Git برای Windows** ([دانلود](https://git-scm.com/download/win)) - اختیاری

### نرم‌افزارهای توصیه‌شده:
- **Visual Studio Code** ([دانلود](https://code.visualstudio.com/)) - برای editing
- **pgAdmin** - برای مدیریت دیتابیس PostgreSQL
- **Postman** - برای تست API

---

## 🚀 نصب مرحله به مرحله

### مرحله 1: نصب Node.js

1. دانلود Node.js از [nodejs.org](https://nodejs.org/)
2. نصب فایل `.exe` (دانلود‌شده)
3. در حین نصب گزینه‌های پیش‌فرض را قبول کنید
4. بررسی نصب موفق:
```cmd
node --version
npm --version
```

### مرحله 2: نصب PostgreSQL

1. دانلود PostgreSQL برای Windows از [postgresql.org](https://www.postgresql.org/download/windows/)
2. اجرای فایل نصب
3. تعیین کلمه‌عبور برای کاربر `postgres` (یادداشت کنید!)
4. پورت پیش‌فرض: `5432`
5. انتخاب "برای همه" برای تنظیمات
6. بررسی نصب:
```cmd
psql --version
```

### مرحله 3: ایجاد دیتابیس

1. باز کردن `pgAdmin 4` (نصب شده با PostgreSQL)
2. ورود با کاربر `postgres`
3. ایجاد دیتابیس جدید:
   - نام: `mobile_shop`
   - Encoding: `UTF-8`
   - Locale: `C`

یا از طریق Command Prompt:
```cmd
psql -U postgres

-- درون psql:
CREATE DATABASE mobile_shop ENCODING 'UTF8';
CREATE USER shop_user WITH PASSWORD 'your_secure_password';
ALTER ROLE shop_user WITH SUPERUSER;
\q
```

### مرحله 4: کلون کردن پروژه

```cmd
# باز کردن دایرکتوری مورد نظر
cd C:\Users\YourUsername\Projects

# کلون کردن از Git (یا دانلود فایل ZIP)
git clone <repository-url> mobile-shop

# ورود به دایرکتوری پروژه
cd mobile-shop
```

### مرحله 5: نصب وابستگی‌ها

```cmd
npm install
```

اگر خطایی دریافت کردید، سعی کنید:
```cmd
npm cache clean --force
npm install
```

### مرحله 6: تنظیم متغیرهای محیطی

1. ایجاد فایل `.env` در ریشة پروژه:
```cmd
copy .env.example .env
```

2. ویرایش فایل `.env`:
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://shop_user:your_secure_password@localhost:5432/mobile_shop
SESSION_SECRET=your_session_secret_key_here
```

### مرحله 7: اجرای Migrations

```cmd
npm run migrations
```

---

## 📊 راه‌اندازی دیتابیس PostgreSQL

### روش 1: استفاده از pgAdmin (GUI)

1. باز کردن pgAdmin 4
2. راست‌کلیک بر روی Database → Query Tool
3. کپی و paste کردن queries زیر:

```sql
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    serial TEXT NOT NULL,
    buy_price DECIMAL(10,2) NOT NULL,
    sell_price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    supplier TEXT NOT NULL,
    date_added DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    items JSONB NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    cost_price DECIMAL(12,2) NOT NULL,
    net_profit DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    remaining_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed',
    notes TEXT
);

CREATE TABLE IF NOT EXISTS daily_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    sale_id UUID REFERENCES sales(id),
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT
);

CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    profit_share DECIMAL(12,2) NOT NULL DEFAULT 0,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE
);
```

### روش 2: استفاده از Command Prompt

```cmd
psql -U shop_user -d mobile_shop -f init.sql
```

---

## 🎯 اجرای برنامه

### اجرای Development Server

```cmd
npm run dev
```

سرور در `http://localhost:3000` اجرا می‌شود.

### اجرای صرف کلاینت React

```cmd
npm run dev:client
```

کلاینت در `http://localhost:5000` اجرا می‌شود.

### ایجاد Build برای Production

```cmd
npm run build
npm run start
```

---

## 🔄 ایجاد فایل‌های Batch برای خودکار کردن

### فایل 1: `run.bat` - شروع سریع

ایجاد فایل `run.bat` در ریشة پروژه:

```batch
@echo off
echo Starting Mobile Shop Management System...
echo.

REM بررسی Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM شروع برنامه
echo Installing dependencies...
npm install

echo.
echo Starting development server...
npm run dev

pause
```

### فایل 2: `setup.bat` - نصب و راه‌اندازی

ایجاد فایل `setup.bat`:

```batch
@echo off
echo ==========================================
echo Mobile Shop - Setup Wizard
echo ==========================================
echo.

REM بررسی Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM نصب وابستگی‌ها
echo Installing dependencies...
npm install

REM اجرای migrations
echo Setting up database...
npm run migrations

echo.
echo Setup completed successfully!
echo Run 'npm run dev' to start the application.
echo.
pause
```

### فایل 3: `dev.bat` - شروع سریع (بدون نصب)

```batch
@echo off
npm run dev
pause
```

### استفاده از فایل‌های Batch

1. ذخیره فایل‌های `.bat` در ریشة پروژه
2. دوبار کلیک بر روی فایل مورد نظر
3. یا از Command Prompt:
```cmd
.\run.bat
.\setup.bat
.\dev.bat
```

---

## 📦 راه‌اندازی Windows Service

برای اجرای برنامه به‌عنوان Windows Service از **NSSM** استفاده کنید:

### مرحله 1: دانلود NSSM

1. دانلود NSSM از [nssm.cc](https://nssm.cc/)
2. استخراج فایل
3. کپی `nssm.exe` به `C:\Windows\System32`

### مرحله 2: ایجاد Service

```cmd
cd C:\Users\YourUsername\Projects\mobile-shop

nssm install MobileShop "C:\Program Files\nodejs\node.exe" "C:\Users\YourUsername\Projects\mobile-shop\server\index.js"

REM تنظیم دایرکتوری کاری
nssm set MobileShop AppDirectory "C:\Users\YourUsername\Projects\mobile-shop"

REM شروع Service
nssm start MobileShop
```

### مرحله 3: مدیریت Service

```cmd
REM شروع Service
nssm start MobileShop

REM توقف Service
nssm stop MobileShop

REM حذف Service
nssm remove MobileShop confirm
```

---

## 🐛 رفع مشکلات

### مشکل 1: "Node.js not found"

**حل:**
```cmd
# بررسی نصب Node.js
node --version

# اگر کار نکرد، نصب مجدد Node.js
# https://nodejs.org/
```

### مشکل 2: "PostgreSQL connection failed"

**حل:**
```cmd
# بررسی وضعیت PostgreSQL
sc query PostgreSQL

# راه‌اندازی PostgreSQL Service
net start PostgreSQL

# بررسی اتصال
psql -U postgres

# آپدیت فایل .env با اطلاعات صحیح دیتابیس
```

### مشکل 3: "Port 3000 is already in use"

**حل:**
```cmd
REM پیدا کردن process استفاده‌کننده از پورت
netstat -ano | findstr :3000

REM قطع process (جایگزین PID با شماره واقعی)
taskkill /PID <PID> /F

REM یا استفاده از پورت دیگر
set PORT=3001
npm run dev
```

### مشکل 4: "npm install fails"

**حل:**
```cmd
REM پاک کردن cache
npm cache clean --force

REM حذف node_modules و package-lock.json
rmdir /s /q node_modules
del package-lock.json

REM نصب مجدد
npm install
```

### مشکل 5: "Database migrations failed"

**حل:**
```cmd
REM بررسی اتصال دیتابیس
psql -U shop_user -d mobile_shop

REM اگر دیتابیس وجود ندارد، ایجاد دوباره:
psql -U postgres

CREATE DATABASE mobile_shop ENCODING 'UTF8';
CREATE USER shop_user WITH PASSWORD 'password';

REM سپس اجرای migrations
npm run migrations
```

### مشکل 6: "Cannot find module"

**حل:**
```cmd
REM بررسی و نصب مجدد وابستگی‌ها
npm install

REM یا برای وابستگی خاص
npm install <package-name>
```

---

## 🔐 نکات امنیتی برای Windows

1. **Firewall Configuration**:
   - اضافه کردن برنامه به Windows Defender Firewall
   - تنظیم درگاه (port) پیش‌فرض

2. **بکاپ‌گیری دیتابیس**:
```cmd
REM بکاپ دیتابیس
pg_dump -U shop_user -d mobile_shop > backup.sql

REM Restore بکاپ
psql -U shop_user -d mobile_shop < backup.sql
```

3. **متغیرهای محیطی محفوظ**:
   - هیچگاه رمزهای عبور را در کد قرار ندهید
   - استفاده از فایل `.env` و گنجاندن آن در `.gitignore`

---

## 📱 دسترسی از دستگاه‌های دیگر

برای دسترسی به برنامه از رایانه‌های دیگر در شبکة محلی:

```cmd
REM پیدا کردن IP آدرس
ipconfig

REM یا استفاده از Hostname
hostname

REM سپس دسترسی از دستگاه دیگر:
http://<YOUR_IP>:3000
```

---

## 🚀 نکات اضافی

### بهینه‌سازی برای Production

1. استفاده از `npm run build` برای کاهش اندازة فایل‌ها
2. تنظیم متغیر محیطی `NODE_ENV=production`
3. استفاده از reverse proxy مثل **Nginx** یا **Apache**
4. فعال کردن SSL/TLS

### Nginx Configuration (اختیاری)

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📞 پشتیبانی

برای سوالات و مشکلات:
1. بررسی فایل‌های log در `%APPDATA%\nodejs\`
2. بررسی Event Viewer برای خطاهای Windows
3. مراجعة به README.md اصلی

---

**آخرین آپدیت**: دسامبر 2024  
**نسخة**: 1.0.0
