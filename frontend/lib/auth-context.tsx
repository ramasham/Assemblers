"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole =
  | "engineer-planner"
  | "production-supervisor"
  | "test-supervisor"
  | "quality-supervisor"
  | "production-worker"
  | "tester"
  | "quality"
export type Department = "production" | "test" | "quality"

export interface User {
  id: string
  name: string
  email: string
  availableRoles: UserRole[]
  currentRole: UserRole | null
  department?: Department
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

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Map backend roles to frontend roles
function mapBackendRole(role: string): UserRole | null {
  const roleMap: Record<string, UserRole> = {
    'Engineer Planner': 'engineer-planner',
    'Production Supervisor': 'production-supervisor',
    'Testing Supervisor': 'test-supervisor',
    'Quality Supervisor': 'quality-supervisor',
    'Production Technician': 'production-worker',
    'Testing Technician': 'tester',
    'Quality Technician': 'quality',
  }
  return roleMap[role] || null
}

// Map frontend roles back to backend roles
function mapFrontendRole(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    'engineer-planner': 'Engineer Planner',
    'production-supervisor': 'Production Supervisor',
    'test-supervisor': 'Testing Supervisor',
    'quality-supervisor': 'Quality Supervisor',
    'production-worker': 'Production Technician',
    'tester': 'Testing Technician',
    'quality': 'Quality Technician',
  }
  return roleMap[role]
}

// Map backend department to frontend department
function mapBackendDepartment(dept: string): Department | undefined {
  const deptMap: Record<string, Department> = {
    'Production': 'production',
    'Testing': 'test',
    'Quality': 'quality',
  }
  return deptMap[dept]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call backend login API
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        console.error('Login failed:', response.statusText)
        return false
      }

      const data = await response.json()
      
      // Map backend user data to frontend format
      const mappedRoles = data.user.allowedRoles
        .map(mapBackendRole)
        .filter((role): role is UserRole => role !== null)
      
      const mappedCurrentRole = mapBackendRole(data.user.currentRole)
      const mappedDepartment = mapBackendDepartment(data.user.department)

      const user: User = {
        id: data.user.uid,
        name: data.user.name,
        email: data.user.email,
        availableRoles: mappedRoles,
        currentRole: mappedCurrentRole,
        department: mappedDepartment,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", data.token)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const selectRole = async (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      try {
        const token = localStorage.getItem("token")
        const backendRole = mapFrontendRole(role)
        
        // Call backend to switch role
        const response = await fetch(`${API_URL}/api/auth/switch-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: backendRole }),
        })

        if (response.ok) {
          const updatedUser = { ...user, currentRole: role }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error('Error switching role:', error)
      }
    }
  }

  const switchRole = async (role: UserRole) => {
    if (user && user.availableRoles.includes(role)) {
      try {
        const token = localStorage.getItem("token")
        const backendRole = mapFrontendRole(role)
        
        // Call backend to switch role
        const response = await fetch(`${API_URL}/api/auth/switch-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: backendRole }),
        })

        if (response.ok) {
          const updatedUser = { ...user, currentRole: role }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error('Error switching role:', error)
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
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
