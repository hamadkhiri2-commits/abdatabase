import { Layout } from "@/components/layout/layout";
import { usePurchases, useSales, useCreateSale } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Invoice } from "@/components/sales/invoice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const itemSchema = z.object({
  model: z.string().min(1, "مدل الزامی است"),
  serial: z.string().min(1, "سریال الزامی است"),
  color: z.string().min(1, "رنگ الزامی است"),
  salePrice: z.string().min(1, "قیمت فروش الزامی است"),
  costPrice: z.string().min(1, "قیمت آمد الزامی است"),
  quantity: z.string().min(1, "تعداد الزامی است"),
});

const saleSchema = z.object({
  customerName: z.string().min(1, "نام مشتری الزامی است"),
  phone: z.string().optional(),
  date: z.string().min(1, "تاریخ الزامی است"),
  paidAmount: z.string().min(1, "مبلغ دریافتی الزامی است"),
});

type ItemFormValues = z.infer<typeof itemSchema>;
type SaleFormValues = z.infer<typeof saleSchema>;

export default function Sales() {
  const { data: purchases = [] } = usePurchases();
  const { data: sales = [] } = useSales();
  const createMutation = useCreateSale();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<(ItemFormValues & { id: string })[]>([]);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  const itemForm = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      model: "",
      serial: "",
      color: "",
      salePrice: "",
      costPrice: "",
      quantity: "1",
    },
  });

  const saleForm = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      date: new Date().toISOString().split('T')[0],
      paidAmount: "",
    },
  });

  const filteredProducts = (purchases as any[]).filter(p =>
    p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serial?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = async (data: ItemFormValues) => {
    const newItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSelectedItems([...selectedItems, newItem]);
    itemForm.reset();
    setSearchTerm("");
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    return selectedItems.reduce(
      (acc, item) => {
        const qty = parseInt(item.quantity);
        const salePrice = parseFloat(item.salePrice);
        const costPrice = parseFloat(item.costPrice);
        const itemTotal = salePrice * qty;
        const itemCost = costPrice * qty;
        const itemProfit = itemTotal - itemCost;

        return {
          totalAmount: acc.totalAmount + itemTotal,
          totalCost: acc.totalCost + itemCost,
          totalProfit: acc.totalProfit + itemProfit,
        };
      },
      { totalAmount: 0, totalCost: 0, totalProfit: 0 }
    );
  };

  const onSubmit = async (data: SaleFormValues) => {
    if (selectedItems.length === 0) {
      alert("حداقل یک جنس اضافه کنید");
      return;
    }

    const totals = calculateTotals();
    const remainingAmount = totals.totalAmount - parseFloat(data.paidAmount);
    const invoiceNo = `INV-${Date.now()}`;

    try {
      // Save first item as primary sale record
      const firstItem = selectedItems[0];
      await createMutation.mutateAsync({
        invoiceNo,
        customerName: data.customerName,
        phone: data.phone || "",
        date: data.date,
        model: firstItem.model,
        serial: firstItem.serial,
        color: firstItem.color,
        salePrice: firstItem.salePrice,
        quantity: parseInt(firstItem.quantity),
        totalPrice: totals.totalAmount.toString(),
        costPrice: totals.totalCost.toString(),
        netProfit: totals.totalProfit.toString(),
        paidAmount: data.paidAmount,
        remainingAmount: remainingAmount.toString(),
      });

      setLastInvoice({
        invoiceNo,
        customerName: data.customerName,
        phone: data.phone || "",
        date: data.date,
        items: selectedItems.map(item => ({
          model: item.model,
          serial: item.serial,
          color: item.color,
          quantity: parseInt(item.quantity),
          salePrice: parseFloat(item.salePrice),
          costPrice: parseFloat(item.costPrice),
          totalPrice: parseFloat(item.salePrice) * parseInt(item.quantity),
          totalCost: parseFloat(item.costPrice) * parseInt(item.quantity),
          netProfit: (parseFloat(item.salePrice) - parseFloat(item.costPrice)) * parseInt(item.quantity),
        })),
        paidAmount: parseFloat(data.paidAmount),
        totalAmount: totals.totalAmount,
        totalCost: totals.totalCost,
        totalProfit: totals.totalProfit,
        remainingAmount,
      });

      setSelectedItems([]);
      saleForm.reset();
      itemForm.reset();
      setActiveTab("invoice");
    } catch (error) {
      console.error(error);
    }
  };

  const totals = calculateTotals();
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
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ثبت فروش جدید و صدور فاتورة (چند قلمی)</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">فرم ثبت فروش</TabsTrigger>
              <TabsTrigger value="invoice">فاتورة</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-6">
              {/* Add Items Section */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  افزودن اجناس
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">جستجو محصول:</label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="جستجو نام یا سریال..." 
                        className="pr-9" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 max-h-32 overflow-y-auto">
                      {filteredProducts.slice(0, 10).map((product: any) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            itemForm.setValue("model", product.model);
                            itemForm.setValue("serial", product.serial);
                            itemForm.setValue("color", product.color);
                          }}
                          className="p-2 rounded border hover:border-primary text-left text-sm"
                        >
                          <p className="font-medium">{product.model}</p>
                          <p className="text-xs text-muted-foreground">{product.color}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Form {...itemForm}>
                    <form onSubmit={itemForm.handleSubmit(addItem)} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={itemForm.control}
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">مدل</FormLabel>
                              <FormControl>
                                <Input placeholder="مدل" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={itemForm.control}
                          name="serial"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">سریال</FormLabel>
                              <FormControl>
                                <Input placeholder="سریال" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={itemForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">رنگ</FormLabel>
                            <FormControl>
                              <Input placeholder="رنگ" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <FormField
                          control={itemForm.control}
                          name="costPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">قیمت آمد</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0.00" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={itemForm.control}
                          name="salePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">قیمت فروش</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0.00" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={itemForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">تعداد</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" size="sm" className="w-full">
                        افزودن جنس
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">اجناس انتخاب‌شده ({selectedItems.length})</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium">{item.model}</p>
                          <p className="text-sm text-muted-foreground">{item.color} × {item.quantity}</p>
                          <p className="text-xs">آمد: ${parseFloat(item.costPrice).toFixed(2)} | فروش: ${parseFloat(item.salePrice).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/30 rounded space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>کل فروش:</span>
                      <span className="font-bold">${totals.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>کل آمد:</span>
                      <span className="font-bold">${totals.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-emerald-600 font-semibold">فایده خالص:</span>
                      <span className="font-bold text-emerald-600">${totals.totalProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">اطلاعات مشتری</h3>
                <Form {...saleForm}>
                  <form onSubmit={saleForm.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={saleForm.control}
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
                      control={saleForm.control}
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

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={saleForm.control}
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
                        control={saleForm.control}
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
                    </div>

                    {parseFloat(saleForm.watch("paidAmount") || "0") < totals.totalAmount && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-sm text-orange-700">
                          باقی‌مانده: ${(totals.totalAmount - parseFloat(saleForm.watch("paidAmount") || "0")).toFixed(2)}
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={selectedItems.length === 0 || createMutation.isPending}>
                      {createMutation.isPending ? "درحال ثبت..." : "ثبت فروش و نمایش فاتورة"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="invoice">
              {lastInvoice ? (
                <Invoice {...lastInvoice} />
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
                    <th className="text-right py-3 px-4">شماره فاتورة</th>
                    <th className="text-right py-3 px-4">مشتری</th>
                    <th className="text-right py-3 px-4">مبلغ فروش</th>
                    <th className="text-right py-3 px-4">فایده خالص</th>
                    <th className="text-right py-3 px-4">تاریخ</th>
                    <th className="text-right py-3 px-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {(sales as any[]).slice(0, 10).map((sale: any) => (
                    <tr key={sale.id} className="border-t">
                      <td className="py-3 px-4 font-mono text-xs">{sale.invoiceNo}</td>
                      <td className="py-3 px-4 font-medium">{sale.customerName}</td>
                      <td className="py-3 px-4">${parseFloat(sale.totalPrice || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">${parseFloat(sale.netProfit || 0).toFixed(2)}</td>
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
