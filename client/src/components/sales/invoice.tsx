import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface InvoiceItem {
  model: string;
  serial: string;
  color: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
  totalPrice: number;
  totalCost: number;
  netProfit: number;
}

interface InvoiceProps {
  invoiceNo: string;
  customerName: string;
  phone: string;
  date: string;
  items: InvoiceItem[];
  paidAmount: number;
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  remainingAmount: number;
}

export function Invoice({
  invoiceNo,
  customerName,
  phone,
  date,
  items,
  paidAmount,
  totalAmount,
  totalCost,
  totalProfit,
  remainingAmount,
}: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handlePrint} className="gap-2 print:hidden">
          <Printer className="w-4 h-4" />
          چاپ فاتورة
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader className="text-center border-b-2 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">فاتورة فروش</h1>
            <p className="text-muted-foreground">فروشگاه موبایل حاجی عبدالرحمن</p>
            <p className="text-sm text-muted-foreground">شماره فاتورة: {invoiceNo}</p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">نام مشتری:</p>
              <p className="font-bold text-lg">{customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">شماره تماس:</p>
              <p className="font-bold text-lg dir-ltr">{phone || "---"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">تاریخ:</p>
              <p className="font-bold">{date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ساعت:</p>
              <p className="font-bold">{new Date().toLocaleTimeString('fa-IR')}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-t-2 py-2">
                  <th className="text-right py-3 px-2">ردیف</th>
                  <th className="text-right py-3 px-2">محصول</th>
                  <th className="text-right py-3 px-2">سریال</th>
                  <th className="text-right py-3 px-2">رنگ</th>
                  <th className="text-right py-3 px-2">تعداد</th>
                  <th className="text-right py-3 px-2">قیمت واحد</th>
                  <th className="text-right py-3 px-2">مجموع</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b py-2">
                    <td className="text-right py-3 px-2 font-medium">{index + 1}</td>
                    <td className="text-right py-3 px-2 font-semibold">{item.model}</td>
                    <td className="text-right py-3 px-2 font-mono text-xs">{item.serial}</td>
                    <td className="text-right py-3 px-2 text-muted-foreground text-xs">{item.color}</td>
                    <td className="text-right py-3 px-2">{item.quantity}</td>
                    <td className="text-right py-3 px-2 font-bold">
                      ${item.salePrice.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-2 font-bold text-lg">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="font-semibold border-b pb-2">خلاصة مالی</h3>

              <div className="flex justify-between text-lg border-b pb-2">
                <span className="font-medium">کل فروش:</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg border-b pb-2">
                <span className="font-medium text-emerald-600">فایده خالص:</span>
                <span className="font-bold text-emerald-600">${totalProfit.toFixed(2)}</span>
              </div>

              <div className="text-xs text-muted-foreground">
                درصد فایده: {((totalProfit / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold border-b pb-2">وضعیت پرداخت</h3>
              
              <div className="flex justify-between text-lg">
                <span className="font-medium text-emerald-600">رسید شده:</span>
                <span className="font-bold text-emerald-600">${paidAmount.toFixed(2)}</span>
              </div>

              {remainingAmount > 0 && (
                <div className="flex justify-between text-lg border-t pt-2">
                  <span className="font-medium text-rose-600">باقی‌مانده:</span>
                  <span className="font-bold text-rose-600 text-xl">
                    ${remainingAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {remainingAmount === 0 && (
                <div className="py-2 px-3 bg-emerald-100 text-emerald-700 rounded text-sm font-medium">
                  ✓ کامل پرداخت شده است
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="border-t-2 pt-6 space-y-2 text-center text-sm text-muted-foreground">
            <p>تشکر از خرید شما</p>
            <p>فاتورة اصلی برای ثبت‌نام محصول نگاه داشته شود</p>
            <p className="text-xs">تولید شده توسط: سیستم مدیریت فروشگاه موبایل حاجی عبدالرحمن</p>
            <p className="text-xs mt-4">{new Date().toLocaleString('fa-IR')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
