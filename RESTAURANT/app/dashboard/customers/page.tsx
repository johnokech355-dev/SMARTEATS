"use client"

import { MOCK_CUSTOMERS } from "@/utils/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Heart, Crown, TrendingUp, Users, Star } from "lucide-react"

export default function CustomersPage() {
  const vipCount = MOCK_CUSTOMERS.filter((c) => c.isVIP).length
  const avgLoyalty = Math.round(MOCK_CUSTOMERS.reduce((a, c) => a + c.loyaltyScore, 0) / MOCK_CUSTOMERS.length)
  const totalRevenue = MOCK_CUSTOMERS.reduce((a, c) => a + c.totalSpent, 0)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Intelligence Hub</h1>
        <p className="text-sm text-muted-foreground">Track loyalty metrics, order frequency, and VIP customer insights.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{MOCK_CUSTOMERS.length}</p>
              <p className="text-xs text-muted-foreground">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Crown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{vipCount}</p>
              <p className="text-xs text-muted-foreground">VIP Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Heart className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{avgLoyalty}%</p>
              <p className="text-xs text-muted-foreground">Avg Loyalty</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10">
              <TrendingUp className="h-5 w-5 text-chart-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Customer Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Loyalty</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Return Probability</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CUSTOMERS.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {customer.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{customer.name}</p>
                        <p className="text-[10px] text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.isVIP ? (
                      <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">
                        <Crown className="mr-0.5 h-3 w-3" /> VIP
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Regular</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={customer.loyaltyScore} className="h-1.5 w-16" />
                      <span className="text-xs font-semibold text-foreground">{customer.loyaltyScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{customer.totalOrders}</TableCell>
                  <TableCell className="text-xs font-semibold">${customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={cn("h-3 w-3", i < Math.round(customer.loyaltyScore / 20) ? "fill-warning text-warning" : "text-muted")} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{customer.lastVisit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
