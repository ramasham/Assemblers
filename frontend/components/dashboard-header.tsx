"use client"

import type React from "react"

import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { LogOut, Factory, FlaskConical, CheckCircle2, ClipboardList, Calendar, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const roleConfig: Record<
  UserRole,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
  }
> = {
  "production-worker": {
    label: "Production",
    icon: Factory,
    color: "text-emerald-500",
  },
  tester: {
    label: "Testing",
    icon: FlaskConical,
    color: "text-blue-500",
  },
  quality: {
    label: "Quality",
    icon: CheckCircle2,
    color: "text-purple-500",
  },
  supervisor: {
    label: "Supervisor",
    icon: ClipboardList,
    color: "text-orange-500",
  },
  "engineer-planner": {
    label: "Engineer Planner",
    icon: Calendar,
    color: "text-cyan-500",
  },
}

export function DashboardHeader() {
  const { user, logout, switchRole } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role)
    router.refresh()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const currentRoleConfig = user?.currentRole ? roleConfig[user.currentRole] : null
  const CurrentRoleIcon = currentRoleConfig?.icon

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-lg font-semibold">Production Management</h1>
            {user && user.availableRoles.length > 1 && currentRoleConfig && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {CurrentRoleIcon && <CurrentRoleIcon className={cn("h-3 w-3", currentRoleConfig.color)} />}
                    <span>{currentRoleConfig.label}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.availableRoles
                    .filter((role) => role !== user.currentRole)
                    .map((role) => {
                      const config = roleConfig[role]
                      const Icon = config.icon
                      return (
                        <DropdownMenuItem key={role} onClick={() => handleRoleSwitch(role)}>
                          <Icon className={cn("mr-2 h-4 w-4", config.color)} />
                          <span>{config.label}</span>
                        </DropdownMenuItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {user && user.availableRoles.length === 1 && currentRoleConfig && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {CurrentRoleIcon && <CurrentRoleIcon className={cn("h-3 w-3", currentRoleConfig.color)} />}
                <span>{currentRoleConfig.label}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
