import { Link, useLocation } from "wouter";
import { menuItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Smartphone, LogOut } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="h-screen w-64 bg-sidebar border-l border-sidebar-border flex flex-col fixed right-0 top-0 overflow-y-auto z-50 shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-sidebar-foreground">موبایل حاجی</h1>
          <p className="text-xs text-muted-foreground">مدیریت فروشگاه</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-x-[-2px]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-5 h-5" />
          خروج از سیستم
        </button>
      </div>
    </div>
  );
}
