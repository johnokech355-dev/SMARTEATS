"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Flame, CheckCircle2, ChefHat, Clock, AlertTriangle } from "lucide-react"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"

export default function KitchenPage() {

  const [orders,setOrders] = useState<any[]>([])
  const [role,setRole] = useState("")

  const mapOrder = (order:any)=>({
    id:order.id,
    table:order.tableNumber,
    items:order.items || [],
    status:order.status?.toLowerCase(),
    priority:order.priority,
    createdAt:order.createdAt,
    waiter:order.waiterName,
    total:order.totalAmount
  })

  const fetchOrders = async ()=>{

    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:8080/api/orders",{
      headers:{Authorization:`Bearer ${token}`}
    })

    const data = await res.json()

    setOrders(data.map(mapOrder))
  }

  const updateStatus = async (id:number,status:string)=>{

    const token = localStorage.getItem("token")

    await fetch(
      `http://localhost:8080/api/orders/${id}/status?status=${status}`,
      {
        method:"PUT",
        headers:{Authorization:`Bearer ${token}`}
      }
    )
  }

  const getMinutes = (createdAt:string)=>
    (Date.now() - new Date(createdAt).getTime()) / 60000

  const getTimerColor = (minutes:number)=>{
    if(minutes < 5) return "text-green-500"
    if(minutes < 10) return "text-yellow-500"
    return "text-red-500"
  }

  const getUrgency = (minutes:number)=>{
    if(minutes < 5) return "fresh"
    if(minutes < 10) return "waiting"
    return "critical"
  }

  useEffect(()=>{

    setRole(localStorage.getItem("role") || "")

    fetchOrders()

    const socket = new SockJS("http://localhost:8080/ws")

    const client = new Client({
      webSocketFactory:()=>socket as any,
      reconnectDelay:5000
    })

    client.onConnect = ()=>{

      client.subscribe("/topic/orders",(msg)=>{

        const event = JSON.parse(msg.body)
        const order = event.order || event

        setOrders(prev=>{

          const exists = prev.find(o=>o.id === order.id)

          if(exists){
            return prev.map(o => o.id === order.id ? mapOrder(order) : o)
          }

          return [...prev,mapOrder(order)]

        })

      })

    }

    client.activate()

    return ()=>{ client.deactivate().catch(()=>{}) }

  },[])

  const activeOrders = orders.filter(o =>
    ["pending","preparing","ready"].includes(o.status) // ✅ include ready
  )

  const sortedOrders = [...activeOrders].sort((a,b)=>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const OrderCard = ({order}:any)=>{

    const minutes = getMinutes(order.createdAt)

    const progress =
      order.status === "pending" ? 20 :
      order.status === "preparing" ? 70 :
      order.status === "ready" ? 90 : 100

    const urgency = getUrgency(minutes)

    return(

      <Card
        className={cn(
          "bg-card border-border",
          urgency === "critical" && "border-l-4 border-l-red-500",
          urgency === "waiting" && "border-l-4 border-l-yellow-500"
        )}
      >

        <CardContent className="p-4 flex flex-col gap-3">

          <div className="flex justify-between">

            <div>
              <p className="font-bold">
                Table {order.table}
              </p>

              <p className="text-xs text-muted-foreground">
                {order.waiter}
              </p>
            </div>

            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold",
              getTimerColor(minutes)
            )}>
              <Clock className="h-3 w-3"/>
              {Math.floor(minutes)}m
            </div>

          </div>

          {urgency === "critical" && (
            <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
              <AlertTriangle className="h-3 w-3"/>
              Critical delay
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {order.items?.map((item:any,i:number)=>(
              <Badge key={i} variant="secondary" className="text-[10px]">
                {item.quantity}x {item.name}
              </Badge>
            ))}
          </div>

          <Progress value={progress} className="h-1.5"/>

          <div className="flex gap-2">

            {/* CHEF ACTIONS */}
            {role === "CHEF" && order.status === "pending" && (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white flex gap-1"
                onClick={()=>updateStatus(order.id,"PREPARING")}
              >
                <ChefHat className="h-3 w-3"/>
                Start
              </Button>
            )}

            {role === "CHEF" && order.status === "preparing" && (
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white flex gap-1"
                onClick={()=>updateStatus(order.id,"READY")}
              >
                <CheckCircle2 className="h-3 w-3"/>
                Ready
              </Button>
            )}

            {/* ✅ CASHIER ACTION (NEW) */}
            {role === "CASHIER" && order.status === "ready" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex gap-1"
                onClick={()=>updateStatus(order.id,"COMPLETED")}
              >
                <CheckCircle2 className="h-3 w-3"/>
                Complete
              </Button>
            )}

          </div>

        </CardContent>

      </Card>

    )

  }

  const queued = orders.filter(o=>o.status==="pending")
  const preparing = orders.filter(o=>o.status==="preparing")
  const ready = orders.filter(o=>o.status==="ready")

  return(

    <div className="flex flex-col gap-6 p-6">

      <div className="flex justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Smart Kitchen
          </h1>

          <p className="text-sm text-muted-foreground">
            Real-time kitchen display system
          </p>
        </div>

        <div className="flex items-center gap-2 text-green-500 text-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
          Live
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4 flex gap-2 items-center">
            <ChefHat className="h-5 w-5 text-yellow-500"/>
            <div>
              <p className="font-bold text-lg">{queued.length}</p>
              <p className="text-xs text-muted-foreground">In Queue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-2 items-center">
            <Flame className="h-5 w-5 text-orange-500"/>
            <div>
              <p className="font-bold text-lg">{preparing.length}</p>
              <p className="text-xs text-muted-foreground">Preparing</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-2 items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500"/>
            <div>
              <p className="font-bold text-lg">{ready.length}</p>
              <p className="text-xs text-muted-foreground">Ready</p>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {sortedOrders.map(order=>(
          <OrderCard key={order.id} order={order}/>
        ))}

      </div>

    </div>

  )

}