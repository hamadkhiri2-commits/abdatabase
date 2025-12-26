import { Layout } from "@/components/layout/layout";
import { usePurchases, useSales, useCreateSale, useUpdateSale } from "@/hooks/useApi";
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
  const [cart, setCart] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      date: new Date().toISOString().split('T')[0],
      model: selectedProduct?.model || "",
      serial: selectedProduct?.serial || "",
      color: selectedProduct?.color || "",
      salePrice: selectedProduct?.unitPrice || "",
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
    form.reset();
    setSelectedProduct(null);
    setOpen(false);
  };

  const filteredProducts = purchases.filter(p =>
    p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serial?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = sales.reduce((sum, s: any) => sum + parseFloat(s.totalPrice || 0), 0);

  return (
    <Layout title="فروش و صدور بل (POS)">
      <div className="grid gap-6 mb-8">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
          <p className="text-sm text-muted-foreground mb-1">کل فروش‌های ثبت‌شده</p>
          <p className="text-2xl font-bold text-emerald-600">
            ${totalSales.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Product Selection */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col shadow-sm border-0 bg-muted/30">
            <CardHeader className="pb-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="جستجو جنس (نام، مدل، سریال)..." 
                  className="pr-9 bg-background" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProducts.map((product: any) => (
                    <div 
                      key={product.id} 
                      className={`bg-background border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group ${selectedProduct?.id === product.id ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {product.quantity} موجود
                        </Badge>
                        <span className="font-bold text-lg">${parseFloat(product.unitPrice || 0).toFixed(2)}</span>
                      </div>
                      <h3 className="font-medium truncate">{product.model}</h3>
                      <p className="text-sm text-muted-foreground">{product.color} - {product.supplier}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Checkout */}
        <div className="w-full lg:w-[400px]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Card className="shadow-xl border-t-4 border-t-primary cursor-pointer hover:shadow-2xl transition-shadow h-full">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    ثبت فروش جدید
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium">برای ثبت فروش کلیک کنید</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ثبت فروش جدید</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {selectedProduct && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                      <p className="text-sm font-medium text-blue-600 mb-1">محصول انتخاب‌شده:</p>
                      <p className="font-bold">{selectedProduct.model} - {selectedProduct.color}</p>
                      <p className="text-sm text-muted-foreground">قیمت خرید: ${parseFloat(selectedProduct.unitPrice || 0).toFixed(2)}</p>
                    </div>
                  )}

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
                        <FormLabel>قیمت فروش</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
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

                  <FormField
                    control={form.control}
                    name="paidAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مبلغ دریافتی</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "درحال ثبت..." : "ثبت فروش"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
