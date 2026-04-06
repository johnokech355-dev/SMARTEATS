"use client"

import { useEffect, useState } from "react"
import { ROLE_LABELS } from "@/utils/types"
import type { UserRole } from "@/utils/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Users, Award, TrendingUp, Clock, Plus } from "lucide-react"

// ------------------ Types ------------------
type StaffMember = {
  id: number
  name: string
  role: UserRole
  efficiencyScore: number
  shiftPerformance: number
  ordersHandled: number
}

// ------------------ Helpers ------------------
function getScoreColor(score: number) {
  if (score >= 90) return "text-success"
  if (score >= 75) return "text-primary"
  if (score >= 60) return "text-warning"
  return "text-destructive"
}

const normalizeRole = (role: string): UserRole =>
  role.replace("ROLE_", "").toLowerCase() as UserRole

const mapUser = (u: any, i: number): StaffMember => ({
  id: u.id,
  name: u.email.split("@")[0],
  role: normalizeRole(u.role),
  efficiencyScore: 70 + (i % 30),
  shiftPerformance: 60 + (i % 40),
  ordersHandled: 10 + i * 2,
})

// ------------------ Component ------------------
export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [role, setRole] = useState<UserRole | "">("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 🔥 Add staff state
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newRole, setNewRole] = useState<UserRole>("waiter")
  const [loading, setLoading] = useState(false)

  // ------------------ Fetch ------------------
  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) return

      const data = await res.json()
      setStaff(data.map(mapUser))
    } catch (err) {
      console.error(err)
    }
  }

  // ------------------ Add Staff ------------------
  const addStaff = async () => {
    if (!email || !password) return alert("Fill all fields")

    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:8080/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
          role: newRole.toUpperCase(), // 🔥 important
        }),
      })

      if (!res.ok) {
        console.error("Create failed:", res.status)
        return
      }

      // refresh list
      await fetchStaff()

      // reset form
      setEmail("")
      setPassword("")
      setNewRole("waiter")
      setShowForm(false)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ------------------ Delete ------------------
  const deleteUser = async (id: number) => {
    if (!window.confirm("Delete this user?")) return

    try {
      setDeletingId(id)
      const token = localStorage.getItem("token")

      const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) return

      setStaff(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  // ------------------ Init ------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setRole(normalizeRole(parsed.role))
    }

    fetchStaff()
  }, [])

  // ------------------ Stats ------------------
  const avgEfficiency =
    staff.length > 0
      ? Math.round(staff.reduce((a, s) => a + s.efficiencyScore, 0) / staff.length)
      : 0

  const topPerformer =
    staff.length > 0
      ? staff.reduce((best, s) =>
          s.efficiencyScore > best.efficiencyScore ? s : best,
        staff[0])
      : null

  // ------------------ UI ------------------
  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Staff Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Monitor team performance
          </p>
        </div>

        {role === "owner" && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Staff
          </Button>
        )}
      </div>

      {/* 🔥 Add Staff Form */}
      {showForm && (
        <Card>
          <CardContent className="p-4 flex flex-col gap-3">

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={addStaff} disabled={loading}>
              {loading ? "Adding..." : "Create Staff"}
            </Button>

          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">Total: {staff.length}</CardContent></Card>
        <Card><CardContent className="p-4">Avg: {avgEfficiency}%</CardContent></Card>
        <Card><CardContent className="p-4">Top: {topPerformer?.name || "-"}</CardContent></Card>
        <Card><CardContent className="p-4">
          Orders: {staff.reduce((a, s) => a + s.ordersHandled, 0)}
        </CardContent></Card>
      </div>

      {/* Staff Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map(user => (
          <Card key={user.id}>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="font-semibold">{user.name}</p>
                <Badge>{ROLE_LABELS[user.role]}</Badge>
              </div>

              {role === "owner" && (
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 text-xs"
                >
                  {deletingId === user.id ? "..." : "Delete"}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}