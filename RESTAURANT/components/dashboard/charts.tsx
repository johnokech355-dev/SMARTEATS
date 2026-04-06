"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts"

export function RevenueChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch("http://localhost:8080/api/analytics/weekly-revenue", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Weekly Revenue</CardTitle>
        <p className="text-xs text-muted-foreground">
          Revenue trend across the week
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={28}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function OrdersChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch("http://localhost:8080/api/analytics/hourly-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Peak Hours</CardTitle>
        <p className="text-xs text-muted-foreground">
          Order volume by hour
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorOrders)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}