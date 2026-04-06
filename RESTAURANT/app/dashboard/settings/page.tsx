"use client"

import { useAuth } from "@/context/auth-context"
import { ROLE_LABELS } from "@/utils/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Shield, User, Bell } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and restaurant configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-primary" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user?.email}</p>
                <Badge variant="secondary">{user ? ROLE_LABELS[user.role] : ""}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-primary" /> Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user?.permissions.map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Prefs */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="h-4 w-4 text-primary" /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Notification preferences will be configurable when connected to the backend.</p>
          </CardContent>
        </Card>

        {/* System */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Settings className="h-4 w-4 text-primary" /> System
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">Backend URL: http://localhost:8080</p>
            <p className="text-xs text-muted-foreground">Frontend: Next.js + TypeScript + Tailwind</p>
            <p className="text-xs text-muted-foreground">Auth: JWT (manual decode)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
