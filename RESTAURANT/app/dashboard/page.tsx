"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ROLE_LABELS } from "@/utils/types"

import { KPIBanner, AIInsightsPanel } from "@/components/dashboard/kpi-panel"
import { RevenueChart, OrdersChart } from "@/components/dashboard/charts"
import { RecentOrdersPanel, ActivityTimeline } from "@/components/dashboard/recent-panels"

export default function DashboardPage() {

  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) return null

  return (
    <div className="flex flex-col gap-6 p-6">

      <div>
        <h1 className="text-2xl font-bold">
          Welcome back {user?.email?.split("@")[0]}
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          {user?.role
            ? `${ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]} Dashboard`
            : "Dashboard"}
        </p>
      </div>

      <KPIBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OrdersChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentOrdersPanel />
        <AIInsightsPanel />
        <ActivityTimeline />
      </div>

    </div>
  )
}