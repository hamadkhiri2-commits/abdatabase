import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { usePartners, useAnalyticsSummary, useCreatePartner } from "@/hooks/useApi";
import { Download, Users, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const partnerSchema = z.object({
  name: z.string().min(1, "نام شریک الزامی است"),
  sharePercent: z.string().min(1, "درصد سهم الزامی است"),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

export default function Partners() {
  const { data: partners = [], isLoading } = usePartners();
  const { data: analytics = {} } = useAnalyticsSummary();
  const createMutation = useCreatePartner();
  const [open, setOpen] = useState(false);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      sharePercent: "",
    },
  });

  const onSubmit = async (data: PartnerFormValues) => {
    await createMutation.mutateAsync({
      ...data,
      sharePercent: parseFloat(data.sharePercent),
    });
    form.reset();
    setOpen(false);
  };

  const totalProfit = parseFloat(analytics.totalProfit || 0);

  return (
    <Layout title="تقسیم عواید بین شرکا">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg opacity-90">سود خالص این ماه</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  ${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm opacity-80">پس از کسر تمامی مصارف</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    شرکا
                  </span>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        شریک جدید
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>افزودن شریک جدید</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>نام شریک</FormLabel>
                                <FormControl>
                                  <Input placeholder="نام کامل" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="sharePercent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>درصد سهم (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="50" min="0" max="100" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "درحال اضافه..." : "افزودن شریک"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  هنوز شریکی ثبت نشده است
                </CardContent>
              </Card>
            ) : (
              partners.map((partner: any) => {
                const sharePercent = parseFloat(partner.sharePercent || 0);
                const amount = (totalProfit * sharePercent) / 100;
                return (
                  <Card key={partner.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{partner.name}</CardTitle>
                          <CardDescription>شریک اصلی</CardDescription>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {sharePercent.toFixed(1)}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">سهم مبلغی:</span>
                          <span className="font-bold text-lg">
                            ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <Progress value={sharePercent} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">برداشت شده:</span>
                          <span className="text-rose-600 font-medium">
                            ${parseFloat(partner.totalPayments || 0).toFixed(2)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm font-medium">
                          <span>قابل برداشت:</span>
                          <span className="text-emerald-600">
                            ${(amount - parseFloat(partner.totalPayments || 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
