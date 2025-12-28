import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Sales from "@/pages/sales";
import Debts from "@/pages/debts";
import Partners from "@/pages/partners";
import Profit from "@/pages/profit";
import Reports from "@/pages/reports";
import Expenses from "@/pages/expenses";
import DailyExpenses from "@/pages/daily-expenses";
import DailyReports from "@/pages/daily-reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/sales" component={Sales} />
      <Route path="/debts" component={Debts} />
      <Route path="/partners" component={Partners} />
      <Route path="/profit" component={Profit} />
      <Route path="/reports" component={Reports} />
      <Route path="/daily-reports" component={DailyReports} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/daily-expenses" component={DailyExpenses} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
