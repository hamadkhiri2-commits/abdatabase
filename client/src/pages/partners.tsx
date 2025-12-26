import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Users, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Partners() {
  const totalProfit = 12500;
  const partners = [
    { name: "Haji Abdur Rahman", share: 60, role: "Owner" },
    { name: "Brother Ali", share: 30, role: "Partner" },
    { name: "Shop Fund", share: 10, role: "Reserve" },
  ];

  return (
    <Layout title="تقسیم عواید بین شرکا">
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg opacity-90">سود خالص این ماه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">${totalProfit.toLocaleString()}</div>
            <p className="text-sm opacity-80">پس از کسر تمامی مصارف</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex justify-between items-center">
               <span>عملیات مالی</span>
               <Button variant="outline" size="sm" className="h-8 gap-2">
                 <Download className="w-3 h-3" />
                 گزارش PDF
               </Button>
             </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button className="w-full h-auto py-4 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
               <ArrowUpRight className="w-6 h-6" />
               <span>واریز به صندوق</span>
            </Button>
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 border-dashed">
               <ArrowDownLeft className="w-6 h-6" />
               <span>برداشت شریک</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {partners.map((partner) => {
           const amount = (totalProfit * partner.share) / 100;
           return (
             <Card key={partner.name} className="overflow-hidden">
               <CardHeader className="bg-muted/30 pb-4">
                 <div className="flex justify-between items-start">
                   <div>
                     <CardTitle className="text-base">{partner.name}</CardTitle>
                     <CardDescription>{partner.role}</CardDescription>
                   </div>
                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                     {partner.share}%
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="pt-6">
                 <div className="mb-4">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-muted-foreground">سهم مبلغی:</span>
                     <span className="font-bold text-lg">${amount.toLocaleString()}</span>
                   </div>
                   <Progress value={partner.share} className="h-2" />
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">برداشت شده:</span>
                     <span className="text-rose-600 font-medium">$0</span>
                   </div>
                   <Separator />
                   <div className="flex justify-between text-sm font-medium">
                     <span>قابل برداشت:</span>
                     <span className="text-emerald-600">${amount.toLocaleString()}</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           );
        })}
      </div>
    </Layout>
  );
}
