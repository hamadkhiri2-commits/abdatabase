import { Layout } from "@/components/layout/layout";
import { usePurchases, useCreatePurchase, useDeletePurchase } from "@/hooks/useApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const purchaseSchema = z.object({
  supplier: z.string().min(1, "تأمین‌کننده الزامی است"),
  date: z.string().min(1, "تاریخ الزامی است"),
  billNo: z.string().min(1, "شماره بل الزامی است"),
  model: z.string().min(1, "مدل الزامی است"),
  serial: z.string().min(1, "سریال الزامی است"),
  color: z.string().min(1, "رنگ الزامی است"),
  unitPrice: z.string().min(1, "قیمت فی واحد الزامی است"),
  quantity: z.string().min(1, "تعداد الزامی است"),
  totalPrice: z.string().min(1, "قیمت مجموعی الزامی است"),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function Inventory() {
  const { data: purchases = [], isLoading } = usePurchases();
  const createMutation = useCreatePurchase();
  const deleteMutation = useDeletePurchase();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplier: "",
      date: new Date().toISOString().split('T')[0],
      billNo: `BIL-${Date.now()}`,
      model: "",
      serial: "",
      color: "",
      unitPrice: "",
      quantity: "",
      totalPrice: "",
    },
  });

  // Watch unitPrice and quantity for auto-calculation
  const unitPrice = form.watch("unitPrice");
  const quantity = form.watch("quantity");
  
  useEffect(() => {
    if (unitPrice && quantity) {
      const total = (parseFloat(unitPrice) * parseInt(quantity)).toFixed(2);
      form.setValue("totalPrice", total);
    }
  }, [unitPrice, quantity, form]);

  const onSubmit = async (data: PurchaseFormValues) => {
    await createMutation.mutateAsync({
      ...data,
      quantity: parseInt(data.quantity),
    });
    form.reset();
    setOpen(false);
  };

  const filteredPurchases = purchases.filter((p: any) =>
    p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = (purchases as any[]).reduce((sum: number, p: any) => sum + (p.quantity || 0), 0);
  const totalValue = (purchases as any[]).reduce((sum: number, p: any) => sum + parseFloat(p.totalPrice || 0), 0);

  return (
    <Layout title="مدیریت گدام (انبار)">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="جستجو نام، مدل، سریال..." 
                  className="pr-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                خروجی اکسل
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    جنس جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>ثبت خرید جنس جدید</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تأمین‌کننده</FormLabel>
                            <FormControl>
                              <Input placeholder="نام تأمین‌کننده" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تاریخ</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>شماره بل</FormLabel>
                            <FormControl>
                              <Input placeholder="B-001" {...field} disabled className="bg-muted" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>مدل گوشی</FormLabel>
                            <FormControl>
                              <Input placeholder="iPhone 15 Pro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="serial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>سریال نمبر</FormLabel>
                            <FormControl>
                              <Input placeholder="SN839210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رنگ</FormLabel>
                            <FormControl>
                              <Input placeholder="سیاه، سفید، طلایی..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unitPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>قیمت فی واحد</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="950" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تعداد</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>قیمت مجموعی</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="4750" {...field} disabled className="bg-muted" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "درحال ثبت..." : "ثبت خرید"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <p className="text-sm text-muted-foreground mb-1">کل موجودی</p>
              <p className="text-2xl font-bold">{totalStock} عدد</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              <p className="text-sm text-muted-foreground mb-1">ارزش کل گدام</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
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
                  <TableHead className="text-right">ارزش</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      هنوز خریدی ثبت نشده است
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase: any) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.model}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{purchase.supplier}</span>
                          <span className="text-xs text-muted-foreground">{purchase.color}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">{purchase.serial}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {purchase.quantity} عدد
                        </Badge>
                      </TableCell>
                      <TableCell>${parseFloat(purchase.unitPrice || 0).toFixed(2)}</TableCell>
                      <TableCell className="font-bold">${parseFloat(purchase.totalPrice || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-left">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(purchase.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Layout>
  );
}
