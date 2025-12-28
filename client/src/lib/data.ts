import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  PieChart, 
  Users, 
  TrendingUp,
  Receipt,
  BarChart3
} from "lucide-react";

export const menuItems = [
  { icon: LayoutDashboard, label: "داشبورد", href: "/" },
  { icon: Package, label: "گدام (انبار)", href: "/inventory" },
  { icon: ShoppingCart, label: "فروش و بیجک", href: "/sales" },
  { icon: TrendingUp, label: "سود خالص", href: "/profit" },
  { icon: CreditCard, label: "باقیات (قرض)", href: "/debts" },
  { icon: Receipt, label: "مصارف روزمره", href: "/daily-expenses" },
  { icon: BarChart3, label: "گزارش مفصل", href: "/daily-reports" },
  { icon: PieChart, label: "گزارشات عمومی", href: "/reports" },
  { icon: Users, label: "شرکا و تقسیم", href: "/partners" },
];

export interface Product {
  id: string;
  name: string;
  model: string;
  color: string;
  serial: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  supplier: string;
  dateAdded: string;
}

export const mockInventory: Product[] = [
  { id: "1", name: "iPhone 15 Pro", model: "256GB", color: "Titanium", serial: "SN839210", buyPrice: 950, sellPrice: 1100, stock: 5, supplier: "Dubai Mobile", dateAdded: "2024-03-01" },
  { id: "2", name: "Samsung S24 Ultra", model: "512GB", color: "Black", serial: "SN112233", buyPrice: 900, sellPrice: 1050, stock: 3, supplier: "Herat Trade", dateAdded: "2024-03-05" },
  { id: "3", name: "Xiaomi 14", model: "256GB", color: "Green", serial: "SN445566", buyPrice: 600, sellPrice: 700, stock: 10, supplier: "China Import", dateAdded: "2024-03-10" },
  { id: "4", name: "AirPods Pro 2", model: "Type-C", color: "White", serial: "SN778899", buyPrice: 180, sellPrice: 220, stock: 15, supplier: "Dubai Mobile", dateAdded: "2024-03-12" },
];

export interface Sale {
  id: string;
  customerName: string;
  items: { productId: string; productName: string; qty: number; price: number }[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  date: string;
  status: "Completed" | "Debt";
}

export const mockSales: Sale[] = [
  { id: "INV-1001", customerName: "Ahmad Reshad", items: [{ productId: "1", productName: "iPhone 15 Pro", qty: 1, price: 1100 }], totalAmount: 1100, paidAmount: 1100, remainingAmount: 0, date: "2024-03-15", status: "Completed" },
  { id: "INV-1002", customerName: "Mahmood Khan", items: [{ productId: "3", productName: "Xiaomi 14", qty: 2, price: 1400 }], totalAmount: 1400, paidAmount: 1000, remainingAmount: 400, date: "2024-03-16", status: "Debt" },
];
