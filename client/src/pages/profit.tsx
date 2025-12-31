import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsSummary, useSales, useExpenses } from "@/hooks/useApi";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Profit() {
  const { data: analytics = {}, isLoading } = useAnalyticsSummary();
  const { data: sales = [] } = useSales();
  const { data: expenses = [] } = useExpenses();

  const totalSales = (sales as any[]).reduce((sum, s) => sum + parseFloat(s.totalPrice || 0), 0);
  const totalCost = (sales as any[]).reduce((sum, s) => sum + parseFloat(s.costPrice || 0), 0);
  const totalProfit = totalSales - totalCost;
  const totalExpenses = parseFloat(analytics.totalExpenses || 0);

  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(2) : 0;

  // Group data by date for chart
  const dailyData: { [key: string]: { sales: number; expenses: number } } = {};
  
  (sales as any[]).forEach((sale: any) => {
    const date = sale.date;
    if (!dailyData[date]) dailyData[date] = { sales: 0, expenses: 0 };
    dailyData[date].sales += parseFloat(sale.totalPrice || 0);
  });

  (expenses as any[]).forEach((exp: any) => {
    const date = exp.date;
    if (!dailyData[date]) dailyData[date] = { sales: 0, expenses: 0 };
    dailyData[date].expenses += parseFloat(exp.amount || 0);
  });

  const chartData = Object.entries(dailyData)
    .map(([date, data]) => ({
      date,
      فروش: data.sales,
      مصارف: data.expenses,
      سود: data.sales - data.expenses,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  return (
    <Layout title="گزارش فایده خالص و تحلیل">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  فایده خالص
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>

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
                <CardTitle className="text-sm font-medium text-muted-foreground">سهم سود (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{profitMargin}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  روند فروش و مصارف (۳۰ روز گذشته)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `$${typeof value === 'number' ? value.toFixed(2) : value}`} />
                    <Legend />
                    <Bar dataKey="فروش" fill="#10b981" />
                    <Bar dataKey="مصارف" fill="#ef4444" />
                    <Bar dataKey="سود" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>خلاصه مالی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">کل درآمد (فروش):</span>
                  <span className="font-bold text-emerald-600">${totalSales.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">کل هزینه (مصارف):</span>
                  <span className="font-bold text-rose-600">${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-900/50">
                  <span className="font-bold">فایده خالص:</span>
                  <span className="font-bold text-2xl text-emerald-700 dark:text-emerald-300">${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>تحلیل سود</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">سهم فروش از درآمد</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600" style={{ width: "100%" }}></div>
                    </div>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">سهم مصارف از درآمد</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-rose-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600" style={{ width: `${totalSales > 0 ? (totalExpenses / totalSales) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{totalSales > 0 ? ((totalExpenses / totalSales) * 100).toFixed(2) : 0}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">سهم فایده خالص از درآمد</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${profitMargin}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
}
