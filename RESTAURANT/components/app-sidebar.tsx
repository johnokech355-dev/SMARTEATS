"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useTheme } from "next-themes"
import { ROLE_LABELS } from "@/utils/types"
import { MOCK_NOTIFICATIONS } from "@/utils/mock-data"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  UtensilsCrossed,
  Heart,
  BrainCircuit,
  MessageSquareText,
  Bell,
  Settings,
  LogOut,
  ChefHat,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  Search,
  Activity
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  permission: string
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { label: "Orders", href: "/dashboard/orders", icon: ClipboardList, permission: "orders", badge: 3 },
  { label: "Kitchen", href: "/dashboard/kitchen", icon: ChefHat, permission: "orders" },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package, permission: "inventory" },
  { label: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed, permission: "menu" },
  { label: "Staff", href: "/dashboard/staff", icon: Users, permission: "staff" },
  { label: "Customers", href: "/dashboard/customers", icon: Heart, permission: "customers" },
  { label: "AI Insights", href: "/dashboard/ai-insights", icon: BrainCircuit, permission: "ai_insights" },
  { label: "AI Assistant", href: "/dashboard/ai-assistant", icon: MessageSquareText, permission: "dashboard" },
  { label: "Activity", href: "/dashboard/activity", icon: Activity, permission: "dashboard" }
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const { user, logout, hasPermission, isLoading } = useAuth()

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  // ✅ Prevent empty sidebar after refresh
  const filteredNav = useMemo(() => {
    if (isLoading || !user) return []
    return NAV_ITEMS.filter((item) => hasPermission(item.permission))
  }, [isLoading, user, hasPermission])

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center border-b border-sidebar-border px-3 py-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ChefHat className="h-4 w-4 text-primary-foreground" />
            </div>

            {!collapsed && (
              <span className="text-sm font-bold text-sidebar-foreground">
                RestaurantAI
              </span>
            )}
          </Link>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 py-2">
            <button className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent">
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
              <kbd className="ml-auto rounded border px-1.5 py-0.5 text-[10px]">K</kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="flex flex-col gap-1">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>

                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 min-w-5 justify-center px-1 text-[10px] bg-primary text-primary-foreground"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col gap-1 border-t border-sidebar-border p-2">

          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "justify-center"
            )}
          >
            <div className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[8px] text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </div>

            {!collapsed && <span>Notifications</span>}
          </Link>

          {/* Settings */}
          {hasPermission("settings") && (
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center"
              )}
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span>Settings</span>}
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "justify-center"
            )}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* User Info */}
          {user && (
            <div className={cn(
              "flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2",
              collapsed && "justify-center"
            )}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {user.email?.charAt(0).toUpperCase() || "?"}
              </div>

              {!collapsed && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-xs font-medium">
                    {user.email}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
{user?.role && ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}                  </span>
                </div>
              )}

              <button
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}