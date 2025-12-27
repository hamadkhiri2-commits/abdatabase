import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// جداول دیتابیس

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplier: text("supplier").notNull(),
  date: date("date").notNull(),
  billNo: varchar("bill_no").notNull(),
  model: text("model").notNull(),
  serial: varchar("serial").notNull(),
  color: text("color").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
});

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNo: varchar("invoice_no").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: varchar("phone"),
  date: date("date").notNull(),
  model: text("model").notNull(),
  serial: varchar("serial").notNull(),
  color: text("color").notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  costPrice: numeric("cost_price", { precision: 12, scale: 2 }).default("0"),
  netProfit: numeric("net_profit", { precision: 12, scale: 2 }).default("0"),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).default("0"),
  remainingAmount: numeric("remaining_amount", { precision: 12, scale: 2 }).default("0"),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: varchar("phone").notNull().unique(),
  debts: numeric("debts", { precision: 12, scale: 2 }).default("0"),
});

export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sharePercent: numeric("share_percent", { precision: 5, scale: 2 }).notNull(),
  totalPayments: numeric("total_payments", { precision: 12, scale: 2 }).default("0"),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});

export const profits = pgTable("profits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull(),
  purchaseId: varchar("purchase_id").notNull(),
  profitAmount: numeric("profit_amount", { precision: 12, scale: 2 }).notNull(),
  date: date("date").notNull(),
});

// Zod schemas برای validation

export const insertPurchaseSchema = createInsertSchema(purchases);
export const insertSaleSchema = createInsertSchema(sales);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertPartnerSchema = createInsertSchema(partners);
export const insertExpenseSchema = createInsertSchema(expenses);

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Profit = typeof profits.$inferSelect;
