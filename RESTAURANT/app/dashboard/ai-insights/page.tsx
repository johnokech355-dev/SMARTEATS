"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  BrainCircuit,
  TrendingUp,
  Target,
  Zap,
  Users,
  Package,
  Clock,
  DollarSign,
} from "lucide-react"

const EFFICIENCY_DATA = [
  { name: "Mon", score: 88 },
  { name: "Tue", score: 91 },
  { name: "Wed", score: 87 },
  { name: "Thu", score: 93 },
  { name: "Fri", score: 95 },
  { name: "Sat", score: 92 },
  { name: "Sun", score: 94 },
]

const CATEGORY_REVENUE = [
  { name: "Mains", value: 35 },
  { name: "Seafood", value: 28 },
  { name: "Pasta", value: 18 },
  { name: "Desserts", value: 12 },
  { name: "Other", value: 7 },
]

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export default function AIInsightsPage() {
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    const fetchData = async () => {
      try {
        const [revRes, hourRes, aiRes] = await Promise.all([
          fetch("http://localhost:8080/api/analytics/weekly-revenue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/analytics/hourly-orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/ai/insights", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const rev = await revRes.json()
        const hour = await hourRes.json()
        const ai = aiRes.ok ? await aiRes.json() : []

        setRevenueData(rev)
        setHourlyData(hour)
        setInsights(ai)
      } catch (err) {
        console.error("AI page error:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">AI Business Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered predictions, trends, and operational insights.
        </p>
      </div>

      {/* 🔥 REAL AI INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BrainCircuit className="h-4 w-4 text-primary" />
            Real AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No insights available yet
            </p>
          ) : (
            insights.map((insight, i) => (
              <div key={i} className="text-xs p-2 rounded bg-muted/40">
                {insight}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="revenue" stroke="hsl(var(--primary))" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Kitchen Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EFFICIENCY_DATA}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line dataKey="score" stroke="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_REVENUE} dataKey="value">
                    {CATEGORY_REVENUE.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}