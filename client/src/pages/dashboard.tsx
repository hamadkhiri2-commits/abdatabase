import { Layout } from "@/components/layout/layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { mockSales, mockInventory } from "@/lib/data";
import { DollarSign, ShoppingBag, AlertTriangle, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const totalSales = mockSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalDebt = mockSales.reduce((acc, curr) => acc + curr.remainingAmount, 0);
  const lowStockItems = mockInventory.filter((item) => item.stock < 5).length;
  const todaySales = 1200; // Mocked for today

  return (
    <Layout title="داشبورد مدیریتی">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="فروش کل"
          value={`$${totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+20.1%"
          description="نسبت به ماه گذشته"
        />
        <StatsCard
          title="فروش امروز"
          value={`$${todaySales.toLocaleString()}`}
          icon={ShoppingBag}
          trend="up"
          trendValue="+12%"
          description="نسبت به دیروز"
        />
        <StatsCard
          title="طلب از مشتریان"
          value={`$${totalDebt.toLocaleString()}`}
          icon={Wallet}
          trend="down"
          trendValue="-4%"
          description="نیاز به پیگیری"
          className="border-l-4 border-l-rose-500"
        />
        <StatsCard
          title="هشدار موجودی"
          value={`${lowStockItems} قلم`}
          icon={AlertTriangle}
          description="نیاز به خرید مجدد"
          className="border-l-4 border-l-amber-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>فروش‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {mockSales.map((sale) => (
                <div key={sale.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                    <p className="text-sm text-muted-foreground">{sale.items[0].productName} {sale.items.length > 1 && `+${sale.items.length - 1} دیگر`}</p>
                  </div>
                  <div className="mr-auto font-medium text-left dir-ltr">
                    <div className="flex flex-col items-end">
                      <span>+${sale.totalAmount}</span>
                      <span className="text-xs text-muted-foreground">{sale.date}</span>
                    </div>
                  </div>
                  <div className="mr-4">
                    <Badge variant={sale.status === "Completed" ? "default" : "destructive"} className={sale.status === "Completed" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                      {sale.status === "Completed" ? "تکمیل" : "باقی‌دار"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
             <button className="w-full bg-primary text-primary-foreground h-12 rounded-lg font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
               <ShoppingBag className="w-5 h-5" />
               ثبت فروش جدید
             </button>
             <button className="w-full bg-background border border-border h-12 rounded-lg font-medium hover:bg-accent transition flex items-center justify-center gap-2">
               <DollarSign className="w-5 h-5" />
               ثبت مصارف روزانه
             </button>
             <button className="w-full bg-background border border-border h-12 rounded-lg font-medium hover:bg-accent transition flex items-center justify-center gap-2">
               <Wallet className="w-5 h-5" />
               دریافت طلب (رسید)
             </button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
