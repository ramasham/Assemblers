"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, User } from "lucide-react"
import { useAuth, type UserRole } from "@/lib/auth-context"

// Map frontend role IDs to UserRole types
const roleMap: Record<string, { role: UserRole; label: string; color: string }> = {
  "production-worker": { role: "production-worker", label: "Production Worker", color: "bg-primary" },
  "tester": { role: "tester", label: "Tester", color: "bg-[hsl(var(--alert-warning))]" },
  "quality": { role: "quality", label: "Quality", color: "bg-[#8b5cf6]" },
}

export function RoleSwitcher() {
  const { user, switchRole } = useAuth()

  if (!user) return null
  
  // Only show role switcher if user has multiple roles
  if (!user.availableRoles || user.availableRoles.length <= 1) return null

  // Filter available roles to only show the ones user can switch to
  const availableRoleOptions = user.availableRoles
    .map(role => roleMap[role])
    .filter(Boolean)

  if (availableRoleOptions.length === 0) return null

  const currentRole = user.currentRole ? roleMap[user.currentRole] : availableRoleOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Role:</span>
          <Badge className={`${currentRole?.color || "bg-primary"} text-white`}>
            {currentRole?.label || "Select Role"}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoleOptions.map((roleOption) => (
          <DropdownMenuItem
            key={roleOption.role}
            onClick={() => switchRole(roleOption.role)}
            className="cursor-pointer"
          >
            <Badge className={`${roleOption.color} text-white mr-2`}>{roleOption.label}</Badge>
            {roleOption.role === user.currentRole && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
