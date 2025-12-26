import { Layout } from "@/components/layout/layout";
import { mockInventory } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Inventory() {
  return (
    <Layout title="مدیریت گدام (انبار)">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجو نام، مدل، سریال..." className="pr-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            خروجی اکسل
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            جنس جدید
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right">نام جنس</TableHead>
              <TableHead className="text-right">مدل / رنگ</TableHead>
              <TableHead className="text-right hidden md:table-cell">سریال نمبر</TableHead>
              <TableHead className="text-right">موجودی</TableHead>
              <TableHead className="text-right">قیمت خرید</TableHead>
              <TableHead className="text-right">قیمت فروش</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInventory.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/5 transition-colors">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{item.model}</span>
                    <span className="text-xs text-muted-foreground">{item.color}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">{item.serial}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={item.stock < 5 ? "border-amber-500 text-amber-600 bg-amber-50" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                    {item.stock} عدد
                  </Badge>
                </TableCell>
                <TableCell>${item.buyPrice}</TableCell>
                <TableCell className="font-bold text-primary">${item.sellPrice}</TableCell>
                <TableCell>
                   {item.stock > 0 ? (
                     <span className="text-xs font-medium text-emerald-600">موجود</span>
                   ) : (
                     <span className="text-xs font-medium text-rose-600">ناموجود</span>
                   )}
                </TableCell>
                <TableCell className="text-left">
                  <Button variant="ghost" size="sm">ویرایش</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
