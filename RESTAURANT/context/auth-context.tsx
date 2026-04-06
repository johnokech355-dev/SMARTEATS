"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  role: string | null
  email: string | null
  user: { role: string | null; email: string | null } | null
  login: (token: string, role: string, email?: string) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  role: null,
  email: null,
  user: null,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
})

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["dashboard","orders","inventory","menu","staff","customers","ai_insights","settings"],
  chef: ["dashboard","orders","menu","inventory"],
  cashier: ["dashboard","orders"],
  waiter: ["dashboard","orders","customers"],
  owner: ["dashboard","orders","inventory","menu","staff","customers","ai_insights","settings"]
  
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setRole(parsed.role)
        setEmail(parsed.email)
      } catch {
        localStorage.clear()
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token: string, role: string, userEmail?: string) => {
    const normalizedRole = role.replace("ROLE_", "").toLowerCase()
    const userObj = { token, role: normalizedRole, email: userEmail || null }

    localStorage.setItem("user", JSON.stringify(userObj))
    localStorage.setItem("token", token)

    setIsAuthenticated(true)
    setRole(normalizedRole)
    setEmail(userEmail || null)

    router.replace("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    setIsAuthenticated(false)
    setRole(null)
    setEmail(null)

    router.replace("/login")
  }

  const hasPermission = (permission: string) => {
    if (!role) return false
    return ROLE_PERMISSIONS[role]?.includes(permission) || false
  }

 const user = role
  ? { role, email }
  : null

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, role, email, user, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)