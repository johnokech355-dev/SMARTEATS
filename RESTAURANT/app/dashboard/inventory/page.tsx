"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Package, AlertTriangle, TrendingDown, Shield } from "lucide-react"

interface UIInventoryItem {
  id: number
  name: string
  category: string
  currentStock: number
  maxStock: number
  supplierReliability: number
  lastRestocked: string
  unit: string
}

interface PurchaseOrder {
  id: number
  inventoryItemId: number
  quantityOrdered: number
  supplier: string
  status: "PENDING" | "RECEIVED"
  createdAt: string
}

function getStockHealth(current: number, max: number) {
  const pct = max === 0 ? 0 : (current / max) * 100

  if (pct <= 20) return { label: "Critical", color: "text-destructive" }
  if (pct <= 40) return { label: "Low", color: "text-warning" }
  if (pct <= 70) return { label: "Moderate", color: "text-chart-3" }
  return { label: "Healthy", color: "text-success" }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<UIInventoryItem[]>([])
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)

  const [supplier, setSupplier] = useState("")
  const [quantity, setQuantity] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  const token = localStorage.getItem("token")

  // Fetch inventory and purchase orders
  const fetchInventory = async () => {
    try {
      const [inventoryRes, ordersRes] = await Promise.all([
        fetch("http://localhost:8080/api/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8080/api/purchase-orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const inventoryData = await inventoryRes.json()
      const ordersData = await ordersRes.json()

      setOrders(ordersData)

      const transformed = inventoryData.map((item: any) => {
        const relatedOrders = ordersData.filter(
          (o: any) => o.inventoryItemId === item.id
        )

        const receivedOrders = relatedOrders.filter(
          (o: any) => o.status === "RECEIVED"
        )

        const reliability =
          relatedOrders.length === 0
            ? 100
            : Math.round((receivedOrders.length / relatedOrders.length) * 100)

        const lastOrder = receivedOrders.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]

        return {
          id: item.id,
          name: item.name,
          category: item.category,
          currentStock: item.quantity ?? 0,
          maxStock: item.reorderLevel ?? 1,
          supplierReliability: reliability,
          lastRestocked: lastOrder
            ? new Date(lastOrder.createdAt).toLocaleDateString()
            : "Never",
          unit: item.unit ?? "",
        }
      })

      setInventory(transformed)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  // Create purchase order
  const createPurchaseOrder = async () => {
    if (!selectedItem || !supplier || quantity <= 0) {
      alert("Please enter supplier email and quantity.")
      return
    }

    try {
      const res = await fetch("http://localhost:8080/api/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inventoryItemId: selectedItem,
          quantityOrdered: quantity,
          supplier: supplier,
        }),
      })

      if (!res.ok) throw new Error("Failed to create order")

      const newOrder = await res.json()
      setOrders((prev) => [...prev, newOrder])

      setSupplier("")
      setQuantity(0)
      setSelectedItem(null)

      alert("Purchase order created and email sent to supplier!")

      fetchInventory()
    } catch (error) {
      console.error("Failed to create order", error)
      alert("Failed to create purchase order")
    }
  }

  // ✅ Optimistic Receive Order
  const receiveOrder = async (orderId: number) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const itemIndex = inventory.findIndex((i) => i.id === order.inventoryItemId)
    if (itemIndex === -1) return

    // Optimistically update inventory & order status
    setInventory((prev) => {
      const newInventory = [...prev]
      newInventory[itemIndex] = {
        ...newInventory[itemIndex],
        currentStock: newInventory[itemIndex].currentStock + order.quantityOrdered,
        lastRestocked: new Date().toLocaleDateString(),
      }
      return newInventory
    })

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "RECEIVED" } : o
      )
    )

    try {
      const res = await fetch(
        `http://localhost:8080/api/purchase-orders/${orderId}/receive`,
        {
          method: "PUT", // ✅ Matches backend
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) throw new Error("Failed to receive order")

      const updatedOrder = await res.json()
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "RECEIVED" } : o
        )
      )
    } catch (error) {
      console.error(error)
      alert("Failed to receive order, rolling back changes.")

      // Rollback if backend fails
      setInventory((prev) => {
        const newInventory = [...prev]
        newInventory[itemIndex] = {
          ...newInventory[itemIndex],
          currentStock: newInventory[itemIndex].currentStock - order.quantityOrdered,
        }
        return newInventory
      })

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "PENDING" } : o
        )
      )
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading inventory...</div>
  }

  const criticalItems = inventory.filter(
    (i) => (i.currentStock / i.maxStock) * 100 <= 20
  )

  const lowItems = inventory.filter((i) => {
    const p = (i.currentStock / i.maxStock) * 100
    return p > 20 && p <= 40
  })

  const avgReliability =
    inventory.length === 0
      ? 0
      : Math.round(
          inventory.reduce((a, i) => a + i.supplierReliability, 0) /
            inventory.length
        )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Inventory Command Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor stock levels, supplier reliability, and depletion forecasts.
        </p>
      </div>

      {criticalItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Critical Stock Alert
            </p>
            <p className="text-xs text-muted-foreground">
              {criticalItems.map((i) => i.name).join(", ")}{" "}
              {criticalItems.length === 1 ? "is" : "are"} critically low.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{inventory.length}</p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-lg font-bold">{criticalItems.length}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingDown className="h-5 w-5 text-warning" />
            <div>
              <p className="text-lg font-bold">{lowItems.length}</p>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-success" />
            <div>
              <p className="text-lg font-bold">{avgReliability}%</p>
              <p className="text-xs text-muted-foreground">Avg Reliability</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inventory.map((item) => {
          const stockPct =
            item.maxStock === 0
              ? 0
              : Math.round((item.currentStock / item.maxStock) * 100)

          const health = getStockHealth(item.currentStock, item.maxStock)

          // Only show pending orders for this item
          const pendingOrders = orders.filter(
            (o) => o.inventoryItemId === item.id && o.status === "PENDING"
          )

          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>

                  <Badge variant="outline" className={health.color}>
                    {health.label}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>
                      {item.currentStock} / {item.maxStock} {item.unit}
                    </span>
                    <span className={health.color}>{stockPct}%</span>
                  </div>

                  <Progress value={stockPct} className="mt-1 h-2" />
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Supplier: {item.supplierReliability}%
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    Restocked: {item.lastRestocked}
                  </span>
                </div>

                {/* Restock & Receive Buttons */}
                <div className="mt-3 flex flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedItem(item.id)}
                      >
                        Create Purchase Order
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Purchase Order</DialogTitle>
                      </DialogHeader>

                      <div className="flex flex-col gap-3">
                        <Input
                          type="email"
                          placeholder="Supplier Email"
                          value={supplier}
                          onChange={(e) => setSupplier(e.target.value)}
                        />

                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Number(e.target.value))
                          }
                        />

                        <Button onClick={createPurchaseOrder}>
                          Create Order
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* ✅ Receive Buttons: only pending orders */}
                  {pendingOrders.map((order) => (
                    <Button
                      key={order.id}
                      size="sm"
                      variant="outline"
                      onClick={() => receiveOrder(order.id)}
                    >
                      Receive {order.quantityOrdered} {item.unit}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}