export type UserRole = "owner" | "manager" | "chef" | "waiter" | "cashier" | "admin"

export interface User {
  email: string
  role: UserRole
  permissions: string[]
}

export interface Order {
  id: string
  table: number
  items: OrderItem[]
  status: "pending" | "sent_to_kitchen" | "preparing" | "ready" | "delivered" | "cancelled"
  priority: "low" | "medium" | "high"
  createdAt: string
  total: number
  waiter: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  image?: string
  description: string
  available: boolean
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  maxStock: number
  unit: string
  supplierReliability: number
  lastRestocked: string
}

export interface StaffMember {
  id: string
  name: string
  role: UserRole
  efficiencyScore: number
  ordersHandled: number
  shiftPerformance: number
  avatar?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  loyaltyScore: number
  totalOrders: number
  totalSpent: number
  isVIP: boolean
  lastVisit: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}

export interface ActivityLog {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: ["dashboard", "orders", "inventory", "staff", "menu", "customers", "settings", "ai_insights", "reports"],
  admin: ["dashboard", "orders", "inventory", "staff", "menu", "customers", "settings", "ai_insights", "reports"],
  manager: ["dashboard", "orders", "inventory", "staff", "menu", "customers", "ai_insights", "reports"],
  chef: ["dashboard", "orders", "menu"],
  waiter: ["dashboard", "orders", "menu", "customers"],
  cashier: ["dashboard", "orders", "customers"],
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  manager: "Manager",
  chef: "Chef",
  waiter: "Waiter",
  cashier: "Cashier",
}
