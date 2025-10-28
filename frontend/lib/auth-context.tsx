"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "engineer-planner" | "supervisor" | "production-worker" | "tester" | "quality"

export interface User {
  id: string
  name: string
  email: string
  availableRoles: UserRole[]
  currentRole: UserRole | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  selectRole: (role: UserRole) => void
  switchRole: (role: UserRole) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USERS: Record<string, { password: string; name: string; availableRoles: UserRole[] }> = {
  "planner@company.com": {
    password: "demo123",
    name: "John Smith",
    availableRoles: ["engineer-planner"],
  },
  "supervisor@company.com": {
    password: "demo123",
    name: "Sarah Johnson",
    availableRoles: ["supervisor"],
  },
  "worker@company.com": {
    password: "demo123",
    name: "Mike Davis",
    availableRoles: ["production-worker", "tester", "quality"],
  },
  "tester@company.com": {
    password: "demo123",
    name: "Emily Chen",
    availableRoles: ["tester", "quality"],
  },
  "quality@company.com": {
    password: "demo123",
    name: "David Lee",
    availableRoles: ["quality", "production-worker"],
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockUser = MOCK_USERS[email]
    if (mockUser && mockUser.password === password) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: mockUser.name,
        email,
        availableRoles: mockUser.availableRoles,
        currentRole: null, // Role will be selected after login
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    }
    return false
  }

  const selectRole = (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      const updatedUser = { ...user, currentRole: role }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const switchRole = (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      const updatedUser = { ...user, currentRole: role }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, selectRole, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
