import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales, useExpenses, useCustomers } from "@/hooks/useApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const { data: sales = [], isLoading: loadingSales } = useSales();
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();
  const { data: customers = [] } = useCustomers();

  const totalSales = sales.reduce((sum, s: any) => sum + parseFloat(s.totalPrice || 0), 0);
  const totalExpenses = expenses.reduce((sum, e: any) => sum + parseFloat(e.amount || 0), 0);
  const totalProfit = totalSales - totalExpenses;

  const handleExportPDF = () => {
    const content = `
رگزارش گردش مالی - ${new Date().toLocaleDateString('fa-IR')}

خلاصه مالی:
- کل فروش: $${totalSales.toFixed(2)}
- کل مصارف: $${totalExpenses.toFixed(2)}
- سود خالص: $${totalProfit.toFixed(2)}

تفاصیل فروش‌ها:
${sales.map((s: any) => `- ${s.customerName}: $${parseFloat(s.totalPrice || 0).toFixed(2)} (${s.date})`).join('\n')}

تفاصیل مصارف:
${expenses.map((e: any) => `- ${e.description}: $${parseFloat(e.amount || 0).toFixed(2)} (${e.date})`).join('\n')}
    `.trim();

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loadingSales || loadingExpenses) {
    return (
      <Layout title="گزارشات عمومی">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="گزارشات عمومی">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold mb-2">گزارش دوره {new Date().toLocaleDateString('fa-IR')}</h2>
        </div>
        <Button onClick={handleExportPDF} className="gap-2">
          <Download className="w-4 h-4" />
          دانلود گزارش
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">کل فروش</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">کل مصارف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">سود خالص</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              لیست فروش‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-right">مشتری</TableHead>
                    <TableHead className="text-right">محصول</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale: any) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium text-sm">{sale.customerName}</TableCell>
                      <TableCell className="text-sm">{sale.model}</TableCell>
                      <TableCell className="text-sm font-bold">${parseFloat(sale.totalPrice || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sale.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              لیست مصارف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-right">شرح</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense: any) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium text-sm">{expense.description}</TableCell>
                      <TableCell className="text-sm font-bold">${parseFloat(expense.amount || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{expense.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>خلاصه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <p className="text-sm text-muted-foreground mb-1">تعداد فروش</p>
              <p className="text-2xl font-bold">{sales.length}</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <p className="text-sm text-muted-foreground mb-1">تعداد مصارف</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              <p className="text-sm text-muted-foreground mb-1">تعداد مشتریان</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
