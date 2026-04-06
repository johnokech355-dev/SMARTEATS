"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MOCK_ORDERS, MOCK_ACTIVITY } from "@/utils/mock-data"
import { cn } from "@/lib/utils"
import { Clock, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  sent_to_kitchen: "bg-primary/10 text-primary border-primary/20",
  preparing: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  ready: "bg-success/10 text-success border-success/20",
  delivered: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  sent_to_kitchen: "In Queue",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export function RecentOrdersPanel() {
  const recent = MOCK_ORDERS.slice(0, 5)
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-primary" />
          Live Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-2">
          <div className="flex flex-col gap-2">
            {recent.map((order) => (
              <div key={order.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  T{order.table}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{order.id}</span>
                    <Badge variant="outline" className={cn("text-[10px] border", STATUS_COLORS[order.status])}>
                      {STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-foreground">${order.total}</p>
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: false })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function ActivityTimeline() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-2">
          <div className="flex flex-col gap-3">
            {MOCK_ACTIVITY.map((activity, i) => (
              <div key={activity.id} className="relative flex gap-3 pl-4">
                {i < MOCK_ACTIVITY.length - 1 && (
                  <div className="absolute left-[7px] top-6 h-full w-px bg-border" />
                )}
                <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-background" />
                <div className="flex-1 pb-3">
                  <p className="text-xs font-medium text-foreground">{activity.action}</p>
                  <p className="text-[11px] text-muted-foreground">{activity.details}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {activity.user} - {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 