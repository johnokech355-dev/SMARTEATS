import { getTokenFromStorage } from "@/utils/jwt"

const BASE_URL = "http://localhost:8080"

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getTokenFromStorage()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, role: string) =>
      request<{ token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      }),
  },
  orders: {
    list: () => request("/orders"),
    get: (id: string) => request(`/orders/${id}`),
    create: (data: unknown) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  inventory: {
    list: () => request("/inventory"),
    update: (id: string, data: unknown) => request(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  menu: {
    list: () => request("/menu"),
    create: (data: unknown) => request("/menu", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request(`/menu/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/menu/${id}`, { method: "DELETE" }),
  },
  staff: {
    list: () => request("/staff"),
    get: (id: string) => request(`/staff/${id}`),
  },
  customers: {
    list: () => request("/customers"),
    get: (id: string) => request(`/customers/${id}`),
  },
}
