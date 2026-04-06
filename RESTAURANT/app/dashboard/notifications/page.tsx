"use client"

import { useState } from "react"
import { MOCK_NOTIFICATIONS } from "@/utils/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const TYPE_CONFIG = {
  info: { icon: Info, color: "text-primary bg-primary/10" },
  warning: { icon: AlertTriangle, color: "text-warning bg-warning/10" },
  success: { icon: CheckCircle2, color: "text-success bg-success/10" },
  error: { icon: XCircle, color: "text-destructive bg-destructive/10" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Center</h1>
          <p className="text-sm text-muted-foreground">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notif) => {
          const config = TYPE_CONFIG[notif.type]
          const Icon = config.icon
          return (
            <Card key={notif.id} className={cn("border-border/50 bg-card/80 backdrop-blur-sm transition-all", !notif.read && "border-l-4 border-l-primary")}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                    {!notif.read && <Badge className="bg-primary/10 text-primary text-[9px]">New</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
