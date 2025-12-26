import { Layout } from "@/components/layout/layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useSales, useExpenses, useAnalyticsSummary } from "@/hooks/useApi";
import { DollarSign, ShoppingBag, AlertTriangle, Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const { data: sales = [], isLoading: loadingSales } = useSales();
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();
  const { data: analytics = {} as any } = useAnalyticsSummary();

  const totalSales = parseFloat((analytics.totalSales || 0) as any) || 0;
  const totalExpenses = parseFloat((analytics.totalExpenses || 0) as any) || 0;
  const totalDebts = parseFloat((analytics.totalDebts || 0) as any) || 0;
  const totalProfit = parseFloat((analytics.totalProfit || 0) as any) || 0;

  const recentSales = (sales as any[]).slice(0, 5);
  
  const chartData = [
    { name: "فروش", value: parseFloat(totalSales) || 0 },
    { name: "مصارف", value: parseFloat(totalExpenses) || 0 },
    { name: "سود", value: parseFloat(totalProfit) || 0 },
  ];

  const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

  return (
    <Layout title="داشبورد مدیریتی">
      {(loadingSales || loadingExpenses) ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="فروش کل"
              value={`$${parseFloat(totalSales || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
              icon={DollarSign}
              trend="up"
              trendValue="+12%"
              description="تمام فروش‌های ثبت‌شده"
            />
            <StatsCard
              title="مصارف کل"
              value={`$${parseFloat(totalExpenses || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
              icon={ShoppingBag}
              description="هزینه‌های ثبت‌شده"
              className="border-l-4 border-l-amber-500"
            />
            <StatsCard
              title="طلب از مشتریان"
              value={`$${parseFloat(totalDebts || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
              icon={Wallet}
              trend="down"
              trendValue="-4%"
              description="نیاز به پیگیری"
              className="border-l-4 border-l-rose-500"
            />
            <StatsCard
              title="سود خالص"
              value={`$${parseFloat(totalProfit || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
              icon={TrendingUp}
              trend="up"
              trendValue="+18%"
              description="درآمد خالص"
              className="border-l-4 border-l-emerald-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
            <Card className="col-span-4 shadow-sm">
              <CardHeader>
                <CardTitle>فروش‌های اخیر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 max-h-96 overflow-y-auto">
                  {recentSales.length === 0 ? (
                    <p className="text-muted-foreground text-sm">هنوز فروشی ثبت نشده است</p>
                  ) : (
                    recentSales.map((sale: any) => (
                      <div key={sale.id} className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                          <p className="text-sm text-muted-foreground">{sale.model} ({sale.color})</p>
                        </div>
                        <div className="mr-auto font-medium text-left dir-ltr">
                          <div className="flex flex-col items-end">
                            <span>+${parseFloat(sale.totalPrice || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                            <span className="text-xs text-muted-foreground">{sale.date}</span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <Badge 
                            variant={parseFloat(sale.remainingAmount || 0) > 0 ? "destructive" : "default"} 
                            className={parseFloat(sale.remainingAmount || 0) === 0 ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                          >
                            {parseFloat(sale.remainingAmount || 0) > 0 ? "باقی‌دار" : "تکمیل"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">خلاصه مالی</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
}
