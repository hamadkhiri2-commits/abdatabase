import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, trendValue, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <span className="text-emerald-600 font-medium">↑ {trendValue}</span>}
            {trend === "down" && <span className="text-rose-600 font-medium">↓ {trendValue}</span>}
            <span className="opacity-80">{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
