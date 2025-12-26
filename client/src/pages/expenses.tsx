import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenses, useCreateExpense, useDeleteExpense } from "@/hooks/useApi";
import { Plus, Trash2, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const expenseSchema = z.object({
  date: z.string().min(1, "تاریخ الزامی است"),
  description: z.string().min(1, "شرح الزامی است"),
  amount: z.string().min(1, "مبلغ الزامی است"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function Expenses() {
  const { data: expenses = [], isLoading } = useExpenses();
  const createMutation = useCreateExpense();
  const deleteMutation = useDeleteExpense();
  const [open, setOpen] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    await createMutation.mutateAsync(data);
    form.reset();
    setOpen(false);
  };

  const totalExpenses = expenses.reduce((sum, e: any) => sum + parseFloat(e.amount || 0), 0);

  return (
    <Layout title="مصارف روزانه">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">درحال بارگیری...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  کل مصارف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                  ${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">تعداد مصارف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">میانگین روزانه</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(totalExpenses / (expenses.length || 1)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mb-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  ثبت مصرف جدید
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ثبت مصرف جدید</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>شرح مصرف</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: اجاره دوکان، برق، آب و..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مبلغ</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "درحال ثبت..." : "ثبت مصرف"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>لیست مصارف</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-right">تاریخ</TableHead>
                      <TableHead className="text-right">شرح</TableHead>
                      <TableHead className="text-right">مبلغ</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          هنوز مصرفی ثبت نشده است
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense: any) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-mono text-sm">{expense.date}</TableCell>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell className="font-bold text-rose-600">
                            ${parseFloat(expense.amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-left">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(expense.id)}
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
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  );
}
