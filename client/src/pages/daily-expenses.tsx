import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDailyExpenses, useCreateDailyExpense, useUpdateDailyExpense, useDeleteDailyExpense } from "@/hooks/useApi";
import { Plus, Trash2, Edit2, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const dailyExpenseSchema = z.object({
  date: z.string().min(1, "تاریخ الزامی است"),
  description: z.string().min(1, "شرح الزامی است"),
  amount: z.string().min(1, "مبلغ الزامی است"),
});

type DailyExpenseFormValues = z.infer<typeof dailyExpenseSchema>;

export default function DailyExpenses() {
  const { data: dailyExpenses = [], isLoading } = useDailyExpenses();
  const createMutation = useCreateDailyExpense();
  const updateMutation = useUpdateDailyExpense();
  const deleteMutation = useDeleteDailyExpense();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<DailyExpenseFormValues>({
    resolver: zodResolver(dailyExpenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
    },
  });

  const onSubmit = async (data: DailyExpenseFormValues) => {
    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data,
      });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(data);
    }
    form.reset();
    setOpen(false);
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense.id);
    form.setValue("date", expense.date);
    form.setValue("description", expense.description);
    form.setValue("amount", expense.amount);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این مصرف اطمینان دارید؟")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const totalDailyExpenses = (dailyExpenses as any[]).reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );

  // Group by date for summary
  const expensesByDate: { [key: string]: number } = {};
  (dailyExpenses as any[]).forEach((exp) => {
    const date = exp.date;
    if (!expensesByDate[date]) expensesByDate[date] = 0;
    expensesByDate[date] += parseFloat(exp.amount || 0);
  });

  const sortedDates = Object.entries(expensesByDate)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 10);

  return (
    <Layout title="مصارف روزمره">
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
                  مجموع مصارف روزمره
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                  ${totalDailyExpenses.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">تعداد ردیف‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailyExpenses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">میانگین هر ردیف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(totalDailyExpenses / (dailyExpenses.length || 1)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mb-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="gap-2 shadow-lg shadow-primary/20"
                  onClick={() => {
                    setEditingId(null);
                    form.reset({
                      date: new Date().toISOString().split('T')[0],
                      description: "",
                      amount: "",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  ثبت مصرف جدید
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "ویرایش مصرف" : "ثبت مصرف جدید"}
                  </DialogTitle>
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
                            <Input placeholder="مثال: اجاره، برق، آب و..." {...field} />
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
                            <Input type="number" placeholder="0.00" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending 
                        ? "درحال ثبت..." 
                        : editingId ? "به‌روزرسانی" : "ثبت"
                      }
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>لیست مصارف روزمره</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-right">تاریخ</TableHead>
                      <TableHead className="text-right">شرح</TableHead>
                      <TableHead className="text-right">مبلغ</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          هنوز مصرفی ثبت نشده است
                        </TableCell>
                      </TableRow>
                    ) : (
                      (dailyExpenses as any[]).map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="text-sm text-muted-foreground">{expense.date}</TableCell>
                          <TableCell className="text-sm font-medium">{expense.description}</TableCell>
                          <TableCell className="text-sm font-bold">
                            ${parseFloat(expense.amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(expense)}
                                className="text-blue-500 hover:text-blue-700 transition"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {sortedDates.length > 0 && (
            <Card className="mt-8 shadow-sm">
              <CardHeader>
                <CardTitle>خلاصة مصارف به تفکیک روز</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedDates.map(([date, total]) => (
                    <div key={date} className="flex justify-between p-3 bg-muted/30 rounded">
                      <span className="font-medium">{date}</span>
                      <span className="font-bold text-rose-600">
                        ${parseFloat(total.toString()).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Layout>
  );
}
