import { Layout } from "@/components/layout/layout";
import { usePurchases, useSales, useCreateSale } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Trash2, User, CreditCard, Printer, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Invoice } from "@/components/sales/invoice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const saleSchema = z.object({
  customerName: z.string().min(1, "نام مشتری الزامی است"),
  phone: z.string().optional(),
  date: z.string().min(1, "تاریخ الزامی است"),
  model: z.string().min(1, "مدل الزامی است"),
  serial: z.string().min(1, "سریال الزامی است"),
  color: z.string().min(1, "رنگ الزامی است"),
  salePrice: z.string().min(1, "قیمت فروش الزامی است"),
  quantity: z.string().min(1, "تعداد الزامی است"),
  paidAmount: z.string().min(1, "مبلغ دریافتی الزامی است"),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export default function Sales() {
  const { data: purchases = [] } = usePurchases();
  const { data: sales = [] } = useSales();
  const createMutation = useCreateSale();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      date: new Date().toISOString().split('T')[0],
      model: selectedProduct?.model || "",
      serial: selectedProduct?.serial || "",
      color: selectedProduct?.color || "",
      salePrice: "",
      quantity: "1",
      paidAmount: "",
    },
  });

  const onSubmit = async (data: SaleFormValues) => {
    const totalPrice = (parseFloat(data.salePrice) * parseInt(data.quantity)).toString();
    const remainingAmount = (parseFloat(totalPrice) - parseFloat(data.paidAmount)).toString();

    await createMutation.mutateAsync({
      ...data,
      totalPrice,
      remainingAmount,
      quantity: parseInt(data.quantity),
    });
    
    // Show invoice
    setLastInvoice({
      customerName: data.customerName,
      phone: data.phone || "",
      date: data.date,
      items: [{
        model: data.model,
        serial: data.serial,
        color: data.color,
        quantity: parseInt(data.quantity),
        salePrice: parseFloat(data.salePrice),
        totalPrice: parseFloat(totalPrice),
      }],
      paidAmount: parseFloat(data.paidAmount),
      totalAmount: parseFloat(totalPrice),
      remainingAmount: parseFloat(remainingAmount),
    });

    form.reset();
    setSelectedProduct(null);
    setActiveTab("invoice");
  };

  const filteredProducts = (purchases as any[]).filter(p =>
    p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serial?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalesAmount = (sales as any[]).reduce((sum: number, s: any) => sum + parseFloat(s.totalPrice || 0), 0);

  return (
    <Layout title="فروش و صدور بل (POS)">
      <div className="grid gap-6 mb-8">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
          <p className="text-sm text-muted-foreground mb-1">کل فروش‌های ثبت‌شده</p>
          <p className="text-2xl font-bold text-emerald-600">
            ${totalSalesAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="shadow-xl border-t-4 border-t-primary cursor-pointer hover:shadow-2xl transition-shadow mb-8">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="w-5 h-5 text-primary" />
                ثبت فروش جدید
              </CardTitle>
            </CardHeader>
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">برای ثبت فروش و چاپ فاتورة کلیک کنید</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ثبت فروش جدید و صدور فاتورة</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">فرم ثبت فروش</TabsTrigger>
              <TabsTrigger value="invoice">فاتورة</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium mb-2 block">انتخاب محصول:</label>
                  <div className="relative mb-4">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="جستجو نام یا مدل..." 
                      className="pr-9" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {selectedProduct && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50 mb-4">
                      <p className="text-sm font-medium text-blue-600 mb-2">✓ محصول انتخاب‌شده:</p>
                      <div className="space-y-1">
                        <p className="font-bold">{selectedProduct.model}</p>
                        <p className="text-sm text-muted-foreground">رنگ: {selectedProduct.color}</p>
                        <p className="text-sm text-muted-foreground">سریال: {selectedProduct.serial}</p>
                        <p className="text-sm text-muted-foreground">موجودی: {selectedProduct.quantity}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {filteredProducts.map((product: any) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          form.setValue("model", product.model);
                          form.setValue("serial", product.serial);
                          form.setValue("color", product.color);
                        }}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedProduct?.id === product.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{product.model}</p>
                        <p className="text-xs text-muted-foreground">{product.color}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام مشتری</FormLabel>
                        <FormControl>
                          <Input placeholder="نام مشتری" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>شماره تماس</FormLabel>
                        <FormControl>
                          <Input placeholder="0799123456" {...field} />
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
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>قیمت فروش (واحد)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="قیمت را وارد کنید..." step="0.01" {...field} />
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
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">مجموع قابل پرداخت:</p>
                    <p className="text-2xl font-bold">
                      ${(
                        (parseFloat(form.watch("salePrice") || "0") * parseInt(form.watch("quantity") || "1"))
                      ).toFixed(2)}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="paidAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مبلغ دریافتی</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "درحال ثبت..." : "ثبت فروش و نمایش فاتورة"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="invoice" className="space-y-4">
              {lastInvoice ? (
                <Invoice {...lastInvoice} invoiceNo={`INV-${Date.now()}`} />
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>ابتدا فروش را ثبت کنید تا فاتورة نمایش داده شود</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>فروش‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            {(sales as any[]).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>هنوز فروشی ثبت نشده است</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right py-3 px-4">مشتری</th>
                    <th className="text-right py-3 px-4">محصول</th>
                    <th className="text-right py-3 px-4">مبلغ</th>
                    <th className="text-right py-3 px-4">تاریخ</th>
                    <th className="text-right py-3 px-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {(sales as any[]).slice(0, 10).map((sale: any) => (
                    <tr key={sale.id} className="border-t">
                      <td className="py-3 px-4 font-medium">{sale.customerName}</td>
                      <td className="py-3 px-4">{sale.model}</td>
                      <td className="py-3 px-4 font-bold">${parseFloat(sale.totalPrice || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{sale.date}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={parseFloat(sale.remainingAmount || 0) > 0 ? "destructive" : "default"}
                          className={parseFloat(sale.remainingAmount || 0) === 0 ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                          {parseFloat(sale.remainingAmount || 0) > 0 ? "باقی‌دار" : "تکمیل"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
