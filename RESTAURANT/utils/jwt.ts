export interface JWTPayload {
  sub?: string
  email: string
  role: string
  permissions?: string[]
  exp: number
  iat?: number
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4
  if (pad) {
    base64 += "=".repeat(4 - pad)
  }
  return atob(base64)
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = base64UrlDecode(parts[1])
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload) return true
  return Date.now() >= payload.exp * 1000
}

export function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("jwt_token")
}

export function setTokenInStorage(token: string): void {
  localStorage.setItem("jwt_token", token)
}

export function removeTokenFromStorage(): void {
  localStorage.removeItem("jwt_token")
}
