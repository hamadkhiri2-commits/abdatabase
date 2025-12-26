import { Layout } from "@/components/layout/layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales, useUpdateSale } from "@/hooks/useApi";
import { Wallet, Search, Phone, History, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const paymentSchema = z.object({
  paidAmount: z.string().min(1, "مبلغ الزامی است"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function Debts() {
  const { data: sales = [], isLoading } = useSales();
  const updateMutation = useUpdateSale();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paidAmount: "",
    },
  });

  const onPaymentSubmit = async (data: PaymentFormValues) => {
    if (!selectedSale) return;
    
    const newPaidAmount = (parseFloat(selectedSale.paidAmount || 0) + parseFloat(data.paidAmount)).toString();
    const newRemainingAmount = (parseFloat(selectedSale.totalPrice || 0) - parseFloat(newPaidAmount)).toString();

    await updateMutation.mutateAsync({
      id: selectedSale.id,
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
      },
    });
    form.reset();
    setPaymentOpen(false);
  };

  const debtors = sales.filter((s: any) => parseFloat(s.remainingAmount || 0) > 0);
  const totalDebts = debtors.reduce((sum, d: any) => sum + parseFloat(d.remainingAmount || 0), 0);

  const filteredDebtors = debtors.filter((d: any) =>
    d.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone?.includes(searchTerm)
  );

  return (
    <Layout title="مدیریت باقیات (قرض مشتریان)">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-rose-600 dark:text-rose-400">مجموع کل باقیات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                  ${totalDebts.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-rose-600/60 mt-1">نیاز به پیگیری فوری</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">تعداد بدهکاران</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{debtors.length} نفر</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">میانگین قرض</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(totalDebts / (debtors.length || 1)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="جستجو نام یا شماره..." 
                className="pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">نام مشتری</TableHead>
                  <TableHead className="text-right">شماره تماس</TableHead>
                  <TableHead className="text-right">محصول</TableHead>
                  <TableHead className="text-right">مبلغ دریافتی</TableHead>
                  <TableHead className="text-right">مبلغ باقی</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebtors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      تمام قرض‌ها تسویه شده است
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDebtors.map((debtor: any) => (
                    <TableRow key={debtor.id}>
                      <TableCell className="font-medium">{debtor.customerName}</TableCell>
                      <TableCell className="font-mono text-sm dir-ltr text-right">{debtor.phone}</TableCell>
                      <TableCell className="text-sm">{debtor.model}</TableCell>
                      <TableCell className="text-sm font-bold text-emerald-600">
                        ${parseFloat(debtor.paidAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-rose-600">
                        ${parseFloat(debtor.remainingAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">{debtor.date}</TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-end gap-2">
                          <Dialog open={paymentOpen && selectedSale?.id === debtor.id} onOpenChange={(open) => {
                            setPaymentOpen(open);
                            if (open) setSelectedSale(debtor);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="دریافت">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>دریافت پرداخت - {debtor.customerName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">مبلغ باقی‌مانده:</p>
                                  <p className="text-xl font-bold">${parseFloat(debtor.remainingAmount || 0).toFixed(2)}</p>
                                </div>
                              </div>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onPaymentSubmit)} className="space-y-4">
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
                                  <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? "درحال پردازش..." : "ثبت دریافت"}
                                  </Button>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
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
