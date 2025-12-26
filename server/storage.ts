import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { eq, desc } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not configured");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// ============= PURCHASES =============
export async function createPurchase(data: schema.InsertPurchase) {
  return db.insert(schema.purchases).values(data).returning();
}

export async function getAllPurchases() {
  return db.select().from(schema.purchases).orderBy(desc(schema.purchases.date));
}

export async function getPurchaseById(id: string) {
  return db.select().from(schema.purchases).where(eq(schema.purchases.id, id));
}

export async function updatePurchase(id: string, data: Partial<schema.InsertPurchase>) {
  return db.update(schema.purchases).set(data).where(eq(schema.purchases.id, id)).returning();
}

export async function deletePurchase(id: string) {
  return db.delete(schema.purchases).where(eq(schema.purchases.id, id)).returning();
}

// ============= SALES =============
export async function createSale(data: schema.InsertSale) {
  return db.insert(schema.sales).values(data).returning();
}

export async function getAllSales() {
  return db.select().from(schema.sales).orderBy(desc(schema.sales.date));
}

export async function getSaleById(id: string) {
  return db.select().from(schema.sales).where(eq(schema.sales.id, id));
}

export async function updateSale(id: string, data: Partial<schema.InsertSale>) {
  return db.update(schema.sales).set(data).where(eq(schema.sales.id, id)).returning();
}

export async function deleteSale(id: string) {
  return db.delete(schema.sales).where(eq(schema.sales.id, id)).returning();
}

// ============= CUSTOMERS =============
export async function createCustomer(data: schema.InsertCustomer) {
  return db.insert(schema.customers).values(data).returning();
}

export async function getAllCustomers() {
  return db.select().from(schema.customers).orderBy(schema.customers.name);
}

export async function getCustomerById(id: string) {
  return db.select().from(schema.customers).where(eq(schema.customers.id, id));
}

export async function getCustomerByPhone(phone: string) {
  return db.select().from(schema.customers).where(eq(schema.customers.phone, phone));
}

export async function updateCustomer(id: string, data: Partial<schema.InsertCustomer>) {
  return db.update(schema.customers).set(data).where(eq(schema.customers.id, id)).returning();
}

export async function deleteCustomer(id: string) {
  return db.delete(schema.customers).where(eq(schema.customers.id, id)).returning();
}

// ============= PARTNERS =============
export async function createPartner(data: schema.InsertPartner) {
  return db.insert(schema.partners).values(data).returning();
}

export async function getAllPartners() {
  return db.select().from(schema.partners).orderBy(schema.partners.name);
}

export async function getPartnerById(id: string) {
  return db.select().from(schema.partners).where(eq(schema.partners.id, id));
}

export async function updatePartner(id: string, data: Partial<schema.InsertPartner>) {
  return db.update(schema.partners).set(data).where(eq(schema.partners.id, id)).returning();
}

export async function deletePartner(id: string) {
  return db.delete(schema.partners).where(eq(schema.partners.id, id)).returning();
}

// ============= EXPENSES =============
export async function createExpense(data: schema.InsertExpense) {
  return db.insert(schema.expenses).values(data).returning();
}

export async function getAllExpenses() {
  return db.select().from(schema.expenses).orderBy(desc(schema.expenses.date));
}

export async function getExpenseById(id: string) {
  return db.select().from(schema.expenses).where(eq(schema.expenses.id, id));
}

export async function updateExpense(id: string, data: Partial<schema.InsertExpense>) {
  return db.update(schema.expenses).set(data).where(eq(schema.expenses.id, id)).returning();
}

export async function deleteExpense(id: string) {
  return db.delete(schema.expenses).where(eq(schema.expenses.id, id)).returning();
}

// ============= ANALYTICS =============
// Note: Analytics functions calculate totals from database queries
// These will be fully implemented in future iterations

export async function getTotalSales(): Promise<number> {
  const sales = await getAllSales();
  return sales.reduce((sum, sale) => sum + parseFloat(sale.totalPrice || "0"), 0);
}

export async function getTotalExpenses(): Promise<number> {
  const expenses = await getAllExpenses();
  return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || "0"), 0);
}

export async function getTotalDebts(): Promise<number> {
  const sales = await getAllSales();
  return sales.reduce((sum, sale) => sum + parseFloat(sale.remainingAmount || "0"), 0);
}

export async function calculateTotalProfit(): Promise<number> {
  const totalSales = await getTotalSales();
  const totalExpenses = await getTotalExpenses();
  return totalSales - totalExpenses;
}
