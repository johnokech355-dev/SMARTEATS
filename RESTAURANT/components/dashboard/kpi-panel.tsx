"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  BrainCircuit,
} from "lucide-react"

export function KPIBanner() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch("http://localhost:8080/api/analytics/dashboard-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) return null

  // ✅ MONEY FORMATTER (SAFE)
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val)

  // ✅ CLEAN KPI DATA
  const KPI_DATA = [
    {
      label: "Today's Revenue",
      value: formatMoney(Number(data.revenue || 0)),
      icon: DollarSign,
    },
    {
      label: "Active Orders",
      value: data.activeOrders ?? 0,
      icon: ShoppingCart,
    },
    {
      label: "Guests Served",
      value: data.tableOccupancy ?? 0,
      icon: Users,
    },
    {
      label: "Avg. Order Value",
      value: formatMoney(Number(data.averageOrderValue || 0)),
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPI_DATA.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold">{kpi.value}</p>
              </div>

              <Badge className="text-[10px] bg-success/10 text-success">
                <TrendingUp className="mr-0.5 h-3 w-3" />
                Live
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/* ✅ KEEP THIS — REQUIRED EXPORT */
export function AIInsightsPanel() {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          "http://localhost:8080/api/ai/insights",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const data = await res.json()
        setInsights(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">

        {/* 🔄 LOADING STATE */}
        {loading && (
          <p className="text-xs text-muted-foreground">
            Generating insights...
          </p>
        )}

        {/* ❌ EMPTY STATE */}
        {!loading && insights.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No insights available yet
          </p>
        )}

        {/* ✅ INSIGHTS LIST */}
        {insights.map((insight, index) => {

          // 🔥 small styling logic based on content
          const isPositive = insight.includes("🔥") || insight.includes("💰")
          const isWarning = insight.includes("📉") || insight.includes("⚠️")

          return (
            <div
              key={index}
              className={`
                p-2 rounded-md text-xs border
                ${isPositive ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                ${isWarning ? "bg-red-500/10 text-red-600 border-red-500/20" : ""}
                ${!isPositive && !isWarning ? "bg-muted" : ""}
              `}
            >
              {insight}
            </div>
          )
        })}

      </CardContent>
    </Card>
  )
}