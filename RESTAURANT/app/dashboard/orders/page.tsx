"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MenuItem{
  id:number
  name:string
  price:number
}

interface OrderItem{
  menuItemId:number
  name:string
  price:number
  quantity:number
}

export default function CreateOrderPage(){

  const [menuItems,setMenuItems] = useState<MenuItem[]>([])
  const [orderItems,setOrderItems] = useState<OrderItem[]>([])
  const [tableNumber,setTableNumber] = useState("")
  const [role,setRole] = useState("")
  const [readyOrders,setReadyOrders] = useState<any[]>([])

  useEffect(()=>{
    fetchMenu()
    loadUserRole()
    fetchReadyOrders()
  },[])

  // ✅ FIXED ROLE LOADING
  const loadUserRole = ()=>{
    try{
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      setRole(user.role || "")
      console.log("ROLE:", user.role) // debug
    }catch{
      setRole("")
    }
  }

  const fetchMenu = async ()=>{

    const token = localStorage.getItem("token")

    const res = await fetch(
      "http://localhost:8080/api/menu",
      {headers:{Authorization:`Bearer ${token}`}}
    )

    const data = await res.json()
    setMenuItems(data)
  }

  // ✅ FETCH READY ORDERS
  const fetchReadyOrders = async ()=>{

    const token = localStorage.getItem("token")

    const res = await fetch(
      "http://localhost:8080/api/orders",
      {headers:{Authorization:`Bearer ${token}`}}
    )

    const data = await res.json()

    const ready = data.filter((o:any)=>
      o.status?.toLowerCase() === "ready"
    )

    setReadyOrders(ready)
  }

  const updateStatus = async (id:number)=>{

    const token = localStorage.getItem("token")

    await fetch(
      `http://localhost:8080/api/orders/${id}/status?status=COMPLETED`,
      {
        method:"PUT",
        headers:{Authorization:`Bearer ${token}`}
      }
    )

    fetchReadyOrders()
  }

  const addItem = (item:MenuItem)=>{

    const existing = orderItems.find(i=>i.menuItemId === item.id)

    if(existing){

      setOrderItems(
        orderItems.map(i=>
          i.menuItemId===item.id
          ? {...i,quantity:i.quantity+1}
          : i
        )
      )

    }else{

      setOrderItems([
        ...orderItems,
        {
          menuItemId:item.id,
          name:item.name,
          price:item.price,
          quantity:1
        }
      ])

    }

  }

  const removeItem = (id:number)=>{
    setOrderItems(orderItems.filter(i=>i.menuItemId!==id))
  }

  const changeQty = (id:number,qty:number)=>{

    setOrderItems(
      orderItems.map(i=>
        i.menuItemId===id
        ? {...i,quantity:qty}
        : i
      )
    )

  }

  const total = orderItems.reduce(
    (sum,item)=>sum + item.price * item.quantity,
    0
  )

  const createOrder = async ()=>{

    if(!tableNumber){
      alert("Enter table number")
      return
    }

    if(orderItems.length === 0){
      alert("Add at least one item")
      return
    }

    const token = localStorage.getItem("token")

    const payload ={
      tableNumber,
      items:orderItems.map(i=>({
        menuItemId:i.menuItemId,
        quantity:i.quantity
      }))
    }

    const res = await fetch(
      "http://localhost:8080/api/orders",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(payload)
      }
    )

    if(res.ok){
      alert("Order created!")
      setOrderItems([])
      setTableNumber("")
    }

  }

  return(

    <div className="p-6 space-y-6">

      {/* ORIGINAL UI */}
      <div className="grid grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4">

              {menuItems.map(item=>(

                <div
                  key={item.id}
                  onClick={()=>addItem(item)}
                  className="cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-800 transition"
                >
                  <div className="text-3xl mb-2">🍽️</div>

                  <p className="font-semibold text-center">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-400">
                    ${item.price}
                  </p>
                </div>

              ))}

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Order</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <Input
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e)=>setTableNumber(e.target.value)}
            />

            {orderItems.map(item=>(
              <div
                key={item.menuItemId}
                className="flex justify-between items-center"
              >

                <span>{item.name}</span>

                <Input
                  type="number"
                  value={item.quantity}
                  className="w-16"
                  onChange={(e)=>
                    changeQty(item.menuItemId,Number(e.target.value))
                  }
                />

                <Button
                  variant="destructive"
                  onClick={()=>removeItem(item.menuItemId)}
                >
                  Remove
                </Button>

              </div>
            ))}

            <div className="font-bold text-lg">
              Total: ${total}
            </div>

            <Button className="w-full" onClick={createOrder}>
              Send To Kitchen
            </Button>

          </CardContent>
        </Card>

      </div>

      {/* ✅ CASHIER PANEL */}
      {role === "cashier" && (

        <Card className="border-green-500 border-2">
          <CardHeader>
            <CardTitle className="text-green-600">
              💰 Cashier - Ready Orders
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            {readyOrders.length === 0 && (
              <p className="text-sm text-gray-400">
                No ready orders
              </p>
            )}

            {readyOrders.map(order=>(

              <div
                key={order.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >

                <div>
                  <p className="font-semibold">
                    Table {order.tableNumber}
                  </p>
                  <p className="text-xs text-gray-400">
                    ${order.totalAmount}
                  </p>
                </div>

                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={()=>updateStatus(order.id)}
                >
                  Complete
                </Button>

              </div>

            ))}

          </CardContent>
        </Card>

      )}

    </div>

  )

}