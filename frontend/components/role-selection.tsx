"use client"

import type React from "react"

import { useAuth, type UserRole } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, FlaskConical, CheckCircle2, ClipboardList, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const roleConfig: Record<
  UserRole,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    description: string
  }
> = {
  "production-worker": {
    label: "Production",
    icon: Factory,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
    description: "Assembly line and manufacturing tasks",
  },
  tester: {
    label: "Testing",
    icon: FlaskConical,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
    description: "Quality testing and validation",
  },
  quality: {
    label: "Quality",
    icon: CheckCircle2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
    description: "Quality assurance and inspection",
  },
  supervisor: {
    label: "Supervisor",
    icon: ClipboardList,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20",
    description: "Team oversight and task approval",
  },
  "engineer-planner": {
    label: "Engineer Planner",
    icon: Calendar,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20",
    description: "Job planning and resource allocation",
  },
}

export function RoleSelection() {
  const { user, selectRole } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Your Role</CardTitle>
          <CardDescription>Welcome back, {user.name}! Choose a role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.availableRoles.map((role) => {
              const config = roleConfig[role]
              const Icon = config.icon
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={cn(
                    "p-6 rounded-lg border-2 transition-all duration-200 text-left",
                    "hover:scale-105 hover:shadow-lg",
                    config.bgColor,
                  )}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={cn("p-3 rounded-full bg-background/50", config.color)}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{config.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
