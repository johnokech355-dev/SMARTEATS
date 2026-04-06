"use client"

import { MOCK_ACTIVITY } from "@/utils/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ActivityPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground">Complete timeline of all restaurant operations and events.</p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {MOCK_ACTIVITY.map((activity, i) => (
              <div key={activity.id} className="relative flex gap-4 pl-6">
                {i < MOCK_ACTIVITY.length - 1 && (
                  <div className="absolute left-[11px] top-8 h-full w-px bg-border" />
                )}
                <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-background" />
                <div className="flex flex-1 items-start justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{activity.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.details}</p>
                    <p className="mt-1 text-xs text-muted-foreground">By {activity.user}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
