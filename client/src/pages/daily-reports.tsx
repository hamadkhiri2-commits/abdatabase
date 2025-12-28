import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales, useDailyExpenses, useAnalyticsSummary } from "@/hooks/useApi";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DailyReports() {
  const { data: sales = [] } = useSales();
  const { data: dailyExpenses = [] } = useDailyExpenses();
  const { data: analytics = {} as any } = useAnalyticsSummary();

  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const parseDateFilter = () => {
    const [year, month, day] = filterDate.split('-');
    
    if (filterType === "day") {
      return { year, month, day };
    } else if (filterType === "month") {
      return { year, month, day: null };
    } else {
      return { year, month: null, day: null };
    }
  };

  const { year: filterYear, month: filterMonth, day: filterDay } = parseDateFilter();

  const filteredSales = useMemo(() => {
    return (sales as any[]).filter((sale) => {
      const [saleYear, saleMonth, saleDay] = sale.date.split('-');
      
      if (filterDay && (saleYear !== filterYear || saleMonth !== filterMonth || saleDay !== filterDay)) {
        return false;
      } else if (!filterDay && filterMonth && (saleYear !== filterYear || saleMonth !== filterMonth)) {
        return false;
      } else if (!filterDay && !filterMonth && saleYear !== filterYear) {
        return false;
      }
      return true;
    });
  }, [sales, filterYear, filterMonth, filterDay]);

  const filteredDailyExpenses = useMemo(() => {
    return (dailyExpenses as any[]).filter((expense) => {
      const [expYear, expMonth, expDay] = expense.date.split('-');
      
      if (filterDay && (expYear !== filterYear || expMonth !== filterMonth || expDay !== filterDay)) {
        return false;
      } else if (!filterDay && filterMonth && (expYear !== filterYear || expMonth !== filterMonth)) {
        return false;
      } else if (!filterDay && !filterMonth && expYear !== filterYear) {
        return false;
      }
      return true;
    });
  }, [dailyExpenses, filterYear, filterMonth, filterDay]);

  const totalCapital = (sales as any[]).reduce((sum, s) => sum + parseFloat(s.costPrice || 0), 0);
  const totalNetProfit = (sales as any[]).reduce((sum, s) => sum + parseFloat(s.netProfit || 0), 0);
  const totalDailyExpenses = (dailyExpenses as any[]).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const filteredSalesTotal = filteredSales.reduce((sum, s) => sum + parseFloat(s.totalPrice || 0), 0);
  const filteredDailyExpensesTotal = filteredDailyExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const dailyNetIncome = filteredSalesTotal - filteredDailyExpensesTotal;

  const handleExport = (format: 'csv' | 'txt') => {
    const dateLabel = filterDay ? filterDate : (filterMonth ? `${filterYear}-${filterMonth}` : filterYear);
    const header = `گزارش ${filterType === 'day' ? 'روزانه' : filterType === 'month' ? 'ماهانه' : 'سالانه'} - ${dateLabel}`;
    
    let content = `${header}\n`;
    content += `تاریخ تولید: ${new Date().toLocaleString('fa-IR')}\n\n`;
    
    content += `خلاصة مالی:\n`;
    content += `مجموع سرمایه (قیمت آمد): $${totalCapital.toFixed(2)}\n`;
    content += `مجموع فایده خالص: $${totalNetProfit.toFixed(2)}\n`;
    content += `مجموع مصارف روزمره: $${totalDailyExpenses.toFixed(2)}\n`;
    content += `---\n`;
    content += `عواید دوره: $${filteredSalesTotal.toFixed(2)}\n`;
    content += `مصارف دوره: $${filteredDailyExpensesTotal.toFixed(2)}\n`;
    content += `دخل فعلی ${filterType === 'day' ? 'روزانه' : filterType === 'month' ? 'ماهانه' : 'سالانه'}: $${dailyNetIncome.toFixed(2)}\n\n`;
    
    content += `تفاصیل فروش‌ها:\n`;
    filteredSales.forEach((s) => {
      content += `- ${s.customerName} | ${s.model} | کل: $${parseFloat(s.totalPrice || 0).toFixed(2)} | فایده: $${parseFloat(s.netProfit || 0).toFixed(2)} | ${s.date}\n`;
    });
    
    content += `\nتفاصیل مصارف روزمره:\n`;
    filteredDailyExpenses.forEach((e) => {
      content += `- ${e.description} | $${parseFloat(e.amount || 0).toFixed(2)} | ${e.date}\n`;
    });

    const element = document.createElement("a");
    const filename = `report-${dateLabel}.${format === 'csv' ? 'csv' : 'txt'}`;
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout title="گزارشات با مصارف روزمره">
      <div className="grid gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              انتخاب دوره گزارش
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              {(['day', 'month', 'year'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setFilterDate(new Date().toISOString().split('T')[0]);
                  }}
                  className={`px-4 py-2 rounded font-medium transition ${
                    filterType === type
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {type === 'day' && 'روز'}
                  {type === 'month' && 'ماه'}
                  {type === 'year' && 'سال'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {filterType === 'day' && 'انتخاب روز'}
                {filterType === 'month' && 'انتخاب ماه'}
                {filterType === 'year' && 'انتخاب سال'}
              </label>
              <Input
                type={filterType === 'day' ? 'date' : filterType === 'month' ? 'month' : 'number'}
                value={filterType === 'day' 
                  ? filterDate 
                  : filterType === 'month'
                  ? filterDate.slice(0, 7)
                  : filterDate.split('-')[0]
                }
                onChange={(e) => {
                  if (filterType === 'day') {
                    setFilterDate(e.target.value);
                  } else if (filterType === 'month') {
                    setFilterDate(e.target.value + '-01');
                  } else {
                    setFilterDate(e.target.value + '-01-01');
                  }
                }}
                className="dir-ltr"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">مجموع سرمایه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              ${totalCapital.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">جمع قیمت آمد اجناس</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">مجموع فایده خالص</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              ${totalNetProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">جمع تمام فایده‌ها</p>
          </CardContent>
        </Card>

        <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-600">مجموع مصارف روزمره</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">
              ${totalDailyExpenses.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">جمع تمام مصارف</p>
          </CardContent>
        </Card>

        <Card className={dailyNetIncome >= 0 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">دخل فعلی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dailyNetIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${dailyNetIncome.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filterType === 'day' ? 'درآمد روزانه' : filterType === 'month' ? 'درآمد ماهانه' : 'درآمد سالانه'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={() => handleExport('csv')} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          دانلود CSV
        </Button>
        <Button onClick={() => handleExport('txt')} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          دانلود TXT
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>فروش‌های دوره</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-right text-xs">مشتری</TableHead>
                    <TableHead className="text-right text-xs">محصول</TableHead>
                    <TableHead className="text-right text-xs">فروش</TableHead>
                    <TableHead className="text-right text-xs">فایده</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground text-sm">
                        فروشی یافت نشد
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell className="text-xs">{sale.customerName}</TableCell>
                        <TableCell className="text-xs">{sale.model}</TableCell>
                        <TableCell className="text-xs font-bold">
                          ${parseFloat(sale.totalPrice || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-emerald-600 font-bold">
                          ${parseFloat(sale.netProfit || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مصارف دوره</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-right text-xs">توضیح</TableHead>
                    <TableHead className="text-right text-xs">مبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDailyExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-sm">
                        مصرفی یافت نشد
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDailyExpenses.map((expense: any) => (
                      <TableRow key={expense.id}>
                        <TableCell className="text-xs">{expense.description}</TableCell>
                        <TableCell className="text-xs font-bold text-rose-600">
                          ${parseFloat(expense.amount || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
