import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { toast } from "sonner";

// ============= PURCHASES =============
export function usePurchases() {
  return useQuery({
    queryKey: ["/api/purchases"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/purchases", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      toast.success("خرید ثبت شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/purchases/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      toast.success("خرید به‌روزرسانی شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/purchases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      toast.success("خرید حذف شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

// ============= SALES =============
export function useSales() {
  return useQuery({
    queryKey: ["/api/sales"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/sales", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast.success("فروش ثبت شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/sales/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast.success("فروش به‌روزرسانی شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/sales/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast.success("فروش حذف شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

// ============= CUSTOMERS =============
export function useCustomers() {
  return useQuery({
    queryKey: ["/api/customers"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/customers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast.success("مشتری افزوده شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/customers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast.success("مشتری به‌روزرسانی شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

// ============= PARTNERS =============
export function usePartners() {
  return useQuery({
    queryKey: ["/api/partners"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/partners", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast.success("شریک افزوده شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/partners/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast.success("شریک به‌روزرسانی شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

// ============= EXPENSES =============
export function useExpenses() {
  return useQuery({
    queryKey: ["/api/expenses"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/expenses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast.success("مصرف ثبت شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast.success("مصرف حذف شد");
    },
    onError: (error: any) => toast.error(error.message),
  });
}

// ============= ANALYTICS =============
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ["/api/analytics/summary"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}
