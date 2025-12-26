import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import { insertPurchaseSchema, insertSaleSchema, insertCustomerSchema, insertPartnerSchema, insertExpenseSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ============= PURCHASES =============
  app.post("/api/purchases", async (req, res) => {
    try {
      const data = insertPurchaseSchema.parse(req.body);
      const result = await storage.createPurchase(data);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getAllPurchases();
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/purchases/:id", async (req, res) => {
    try {
      const purchase = await storage.getPurchaseById(req.params.id);
      res.json(purchase[0] || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/purchases/:id", async (req, res) => {
    try {
      const result = await storage.updatePurchase(req.params.id, req.body);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/purchases/:id", async (req, res) => {
    try {
      await storage.deletePurchase(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= SALES =============
  app.post("/api/sales", async (req, res) => {
    try {
      const data = insertSaleSchema.parse(req.body);
      const result = await storage.createSale(data);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/sales", async (req, res) => {
    try {
      const sales = await storage.getAllSales();
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sales/:id", async (req, res) => {
    try {
      const sale = await storage.getSaleById(req.params.id);
      res.json(sale[0] || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/sales/:id", async (req, res) => {
    try {
      const result = await storage.updateSale(req.params.id, req.body);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/sales/:id", async (req, res) => {
    try {
      await storage.deleteSale(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= CUSTOMERS =============
  app.post("/api/customers", async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const result = await storage.createCustomer(data);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id);
      res.json(customer[0] || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const result = await storage.updateCustomer(req.params.id, req.body);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      await storage.deleteCustomer(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= PARTNERS =============
  app.post("/api/partners", async (req, res) => {
    try {
      const data = insertPartnerSchema.parse(req.body);
      const result = await storage.createPartner(data);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/partners/:id", async (req, res) => {
    try {
      const partner = await storage.getPartnerById(req.params.id);
      res.json(partner[0] || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/partners/:id", async (req, res) => {
    try {
      const result = await storage.updatePartner(req.params.id, req.body);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/partners/:id", async (req, res) => {
    try {
      await storage.deletePartner(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= EXPENSES =============
  app.post("/api/expenses", async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      const result = await storage.createExpense(data);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getAllExpenses();
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/expenses/:id", async (req, res) => {
    try {
      const expense = await storage.getExpenseById(req.params.id);
      res.json(expense[0] || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const result = await storage.updateExpense(req.params.id, req.body);
      res.json(result[0]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      await storage.deleteExpense(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ANALYTICS =============
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const totalSales = await storage.getTotalSales();
      const totalExpenses = await storage.getTotalExpenses();
      const totalDebts = await storage.getTotalDebts();
      const totalProfit = await storage.calculateTotalProfit();

      res.json({
        totalSales,
        totalExpenses,
        totalDebts,
        totalProfit,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
