import type { Order, MenuItem, InventoryItem, StaffMember, Customer, Notification, ActivityLog } from "@/utils/types"

export const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", table: 5, items: [{ name: "Grilled Salmon", quantity: 2, price: 28.5 }, { name: "Caesar Salad", quantity: 1, price: 12 }], status: "preparing", priority: "high", createdAt: new Date(Date.now() - 900000).toISOString(), total: 69, waiter: "Sarah M." },
  { id: "ORD-002", table: 12, items: [{ name: "Margherita Pizza", quantity: 3, price: 18 }, { name: "Tiramisu", quantity: 2, price: 10 }], status: "pending", priority: "medium", createdAt: new Date(Date.now() - 300000).toISOString(), total: 74, waiter: "James K." },
  { id: "ORD-003", table: 3, items: [{ name: "Wagyu Steak", quantity: 1, price: 65 }, { name: "Red Wine", quantity: 2, price: 15 }], status: "sent_to_kitchen", priority: "high", createdAt: new Date(Date.now() - 600000).toISOString(), total: 95, waiter: "Emily R." },
  { id: "ORD-004", table: 8, items: [{ name: "Pasta Carbonara", quantity: 2, price: 22 }], status: "ready", priority: "low", createdAt: new Date(Date.now() - 1800000).toISOString(), total: 44, waiter: "Mike D." },
  { id: "ORD-005", table: 1, items: [{ name: "Lobster Bisque", quantity: 4, price: 16 }, { name: "Bread Basket", quantity: 1, price: 8 }], status: "delivered", priority: "medium", createdAt: new Date(Date.now() - 3600000).toISOString(), total: 72, waiter: "Sarah M." },
  { id: "ORD-006", table: 15, items: [{ name: "Chicken Alfredo", quantity: 1, price: 20 }], status: "cancelled", priority: "low", createdAt: new Date(Date.now() - 7200000).toISOString(), total: 20, waiter: "James K." },
  { id: "ORD-007", table: 7, items: [{ name: "Sushi Platter", quantity: 1, price: 45 }, { name: "Miso Soup", quantity: 2, price: 8 }], status: "preparing", priority: "high", createdAt: new Date(Date.now() - 450000).toISOString(), total: 61, waiter: "Emily R." },
  { id: "ORD-008", table: 9, items: [{ name: "Fish & Chips", quantity: 3, price: 16 }], status: "pending", priority: "medium", createdAt: new Date(Date.now() - 120000).toISOString(), total: 48, waiter: "Mike D." },
]

export const MOCK_MENU: MenuItem[] = [
  { id: "M01", name: "Grilled Salmon", category: "Seafood", price: 28.5, description: "Atlantic salmon with herb butter", available: true },
  { id: "M02", name: "Wagyu Steak", category: "Mains", price: 65, description: "A5 Wagyu with truffle jus", available: true },
  { id: "M03", name: "Margherita Pizza", category: "Pizza", price: 18, description: "San Marzano tomatoes, fresh mozzarella", available: true },
  { id: "M04", name: "Caesar Salad", category: "Salads", price: 12, description: "Romaine, parmesan, house croutons", available: true },
  { id: "M05", name: "Pasta Carbonara", category: "Pasta", price: 22, description: "Guanciale, pecorino, egg yolk", available: true },
  { id: "M06", name: "Lobster Bisque", category: "Soups", price: 16, description: "Rich lobster broth with cream", available: true },
  { id: "M07", name: "Sushi Platter", category: "Seafood", price: 45, description: "12-piece chef selection", available: false },
  { id: "M08", name: "Tiramisu", category: "Desserts", price: 10, description: "Classic Italian coffee dessert", available: true },
  { id: "M09", name: "Chicken Alfredo", category: "Pasta", price: 20, description: "Creamy parmesan chicken pasta", available: true },
  { id: "M10", name: "Fish & Chips", category: "Mains", price: 16, description: "Beer-battered cod, tartar sauce", available: true },
]

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: "INV01", name: "Atlantic Salmon", category: "Seafood", currentStock: 12, maxStock: 30, unit: "kg", supplierReliability: 95, lastRestocked: "2026-02-26" },
  { id: "INV02", name: "Wagyu Beef A5", category: "Meat", currentStock: 3, maxStock: 15, unit: "kg", supplierReliability: 88, lastRestocked: "2026-02-25" },
  { id: "INV03", name: "Fresh Mozzarella", category: "Dairy", currentStock: 8, maxStock: 20, unit: "kg", supplierReliability: 92, lastRestocked: "2026-02-27" },
  { id: "INV04", name: "San Marzano Tomatoes", category: "Produce", currentStock: 25, maxStock: 40, unit: "cans", supplierReliability: 97, lastRestocked: "2026-02-24" },
  { id: "INV05", name: "Olive Oil (EV)", category: "Pantry", currentStock: 5, maxStock: 12, unit: "liters", supplierReliability: 90, lastRestocked: "2026-02-20" },
  { id: "INV06", name: "Romaine Lettuce", category: "Produce", currentStock: 2, maxStock: 15, unit: "heads", supplierReliability: 78, lastRestocked: "2026-02-27" },
  { id: "INV07", name: "Red Wine (House)", category: "Beverages", currentStock: 18, maxStock: 24, unit: "bottles", supplierReliability: 94, lastRestocked: "2026-02-22" },
  { id: "INV08", name: "Flour (00)", category: "Pantry", currentStock: 30, maxStock: 50, unit: "kg", supplierReliability: 99, lastRestocked: "2026-02-23" },
]

export const MOCK_STAFF: StaffMember[] = [
  { id: "S01", name: "Sarah Mitchell", role: "waiter", efficiencyScore: 94, ordersHandled: 187, shiftPerformance: 96 },
  { id: "S02", name: "James Kim", role: "waiter", efficiencyScore: 88, ordersHandled: 162, shiftPerformance: 90 },
  { id: "S03", name: "Emily Rodriguez", role: "waiter", efficiencyScore: 91, ordersHandled: 175, shiftPerformance: 93 },
  { id: "S04", name: "Mike Davis", role: "waiter", efficiencyScore: 82, ordersHandled: 145, shiftPerformance: 85 },
  { id: "S05", name: "Chef Antonio", role: "chef", efficiencyScore: 97, ordersHandled: 340, shiftPerformance: 98 },
  { id: "S06", name: "Chef Yuki", role: "chef", efficiencyScore: 95, ordersHandled: 312, shiftPerformance: 96 },
  { id: "S07", name: "Lisa Chen", role: "cashier", efficiencyScore: 90, ordersHandled: 420, shiftPerformance: 92 },
  { id: "S08", name: "Tom Brown", role: "manager", efficiencyScore: 93, ordersHandled: 0, shiftPerformance: 95 },
]

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "C01", name: "Alexandra Rivera", email: "alex@example.com", loyaltyScore: 95, totalOrders: 48, totalSpent: 3240, isVIP: true, lastVisit: "2026-02-27" },
  { id: "C02", name: "Benjamin Foster", email: "ben@example.com", loyaltyScore: 82, totalOrders: 32, totalSpent: 1850, isVIP: true, lastVisit: "2026-02-26" },
  { id: "C03", name: "Clara Wang", email: "clara@example.com", loyaltyScore: 71, totalOrders: 15, totalSpent: 890, isVIP: false, lastVisit: "2026-02-20" },
  { id: "C04", name: "David Patel", email: "david@example.com", loyaltyScore: 90, totalOrders: 42, totalSpent: 2980, isVIP: true, lastVisit: "2026-02-28" },
  { id: "C05", name: "Elena Kowalski", email: "elena@example.com", loyaltyScore: 45, totalOrders: 6, totalSpent: 340, isVIP: false, lastVisit: "2026-02-10" },
  { id: "C06", name: "Frank Nguyen", email: "frank@example.com", loyaltyScore: 88, totalOrders: 38, totalSpent: 2450, isVIP: true, lastVisit: "2026-02-25" },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "N01", title: "Low Stock Alert", message: "Romaine Lettuce stock critically low (2 heads remaining)", type: "warning", read: false, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "N02", title: "New VIP Customer", message: "David Patel has reached VIP status", type: "success", read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "N03", title: "Order Rush Detected", message: "15 orders in the last 30 minutes - consider staffing", type: "info", read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "N04", title: "Supplier Delay", message: "Wagyu Beef delivery delayed by 2 days", type: "error", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
]

export const MOCK_ACTIVITY: ActivityLog[] = [
  { id: "A01", action: "Order Created", user: "Sarah M.", timestamp: new Date(Date.now() - 120000).toISOString(), details: "Table 5 - ORD-001" },
  { id: "A02", action: "Stock Updated", user: "Tom B.", timestamp: new Date(Date.now() - 300000).toISOString(), details: "Restocked Atlantic Salmon (+10kg)" },
  { id: "A03", action: "Menu Updated", user: "Chef Antonio", timestamp: new Date(Date.now() - 900000).toISOString(), details: "Sushi Platter marked unavailable" },
  { id: "A04", action: "Staff Shift Started", user: "System", timestamp: new Date(Date.now() - 1800000).toISOString(), details: "Evening shift - 6 staff members" },
  { id: "A05", action: "Payment Received", user: "Lisa C.", timestamp: new Date(Date.now() - 2400000).toISOString(), details: "Table 1 - $72.00" },
  { id: "A06", action: "VIP Customer Arrived", user: "James K.", timestamp: new Date(Date.now() - 3000000).toISOString(), details: "David Patel - Table 9" },
]

export const REVENUE_DATA = [
  { day: "Mon", revenue: 4200, orders: 58 },
  { day: "Tue", revenue: 3800, orders: 52 },
  { day: "Wed", revenue: 5100, orders: 71 },
  { day: "Thu", revenue: 4700, orders: 65 },
  { day: "Fri", revenue: 6800, orders: 94 },
  { day: "Sat", revenue: 8200, orders: 112 },
  { day: "Sun", revenue: 7100, orders: 98 },
]

export const HOURLY_DATA = [
  { hour: "11am", orders: 8 },
  { hour: "12pm", orders: 22 },
  { hour: "1pm", orders: 18 },
  { hour: "2pm", orders: 10 },
  { hour: "3pm", orders: 5 },
  { hour: "4pm", orders: 7 },
  { hour: "5pm", orders: 12 },
  { hour: "6pm", orders: 25 },
  { hour: "7pm", orders: 32 },
  { hour: "8pm", orders: 28 },
  { hour: "9pm", orders: 20 },
  { hour: "10pm", orders: 12 },
]
