import { Layout } from "@/components/layout/layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Search, Phone, History } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockDebtors = [
  { id: 1, name: "Mahmood Khan", phone: "0799123456", totalDebt: 400, lastDate: "2024-03-16", items: "Xiaomi 14 (x2)" },
  { id: 2, name: "Jamaluddin", phone: "0788654321", totalDebt: 150, lastDate: "2024-03-10", items: "Repair Service" },
  { id: 3, name: "Shop-e-Hamaya", phone: "0777112233", totalDebt: 1200, lastDate: "2024-02-28", items: "Bulk iPhone Case" },
];

export default function Debts() {
  return (
    <Layout title="مدیریت باقیات (قرض مشتریان)">
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-600 dark:text-rose-400">مجموع کل باقیات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">$1,750</div>
            <p className="text-xs text-rose-600/60 mt-1">نیاز به پیگیری فوری</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">تعداد بدهکاران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 نفر</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
           <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="جستجو نام مشتری..." className="pr-9" />
        </div>
        <Button className="gap-2">
          <Wallet className="w-4 h-4" />
          ثبت رسید جدید
        </Button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right">نام مشتری</TableHead>
              <TableHead className="text-right">شماره تماس</TableHead>
              <TableHead className="text-right">بابت</TableHead>
              <TableHead className="text-right">مبلغ باقی</TableHead>
              <TableHead className="text-right">آخرین خرید</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDebtors.map((debtor) => (
              <TableRow key={debtor.id}>
                <TableCell className="font-medium">{debtor.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground dir-ltr text-right">{debtor.phone}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{debtor.items}</TableCell>
                <TableCell className="font-bold text-rose-600">${debtor.totalDebt}</TableCell>
                <TableCell>{debtor.lastDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">هشدار</Badge>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end gap-2">
                     <Button variant="ghost" size="icon" title="تماس">
                       <Phone className="w-4 h-4" />
                     </Button>
                     <Button variant="ghost" size="icon" title="تاریخچه">
                       <History className="w-4 h-4" />
                     </Button>
                     <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                       تسویه
                     </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
