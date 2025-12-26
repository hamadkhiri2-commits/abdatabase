import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans" dir="rtl">
      <Sidebar />
      <main className="pr-64 min-h-screen transition-all duration-300">
        <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {title && (
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1 text-sm">سیستم مدیریت فروشگاه موبایل حاجی عبدالرحمن</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-sm">امروز</p>
                  <p className="text-muted-foreground text-xs font-mono">{new Date().toLocaleDateString('fa-IR')}</p>
                </div>
              </div>
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
