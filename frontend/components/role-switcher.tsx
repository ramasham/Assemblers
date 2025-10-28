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
import { useAuth } from "@/lib/auth-context"

export function RoleSwitcher() {
  const { user, setUser } = useAuth()

  if (!user) return null

  const roles = [
    { id: "production", label: "Production Worker", color: "bg-primary" },
    { id: "tester", label: "Tester", color: "bg-[hsl(var(--alert-warning))]" },
    { id: "quality", label: "Quality", color: "bg-[#8b5cf6]" },
  ]

  const currentRole = roles.find((r) => r.id === user.role) || roles[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Role:</span>
          <Badge className={`${currentRole.color} text-white`}>{currentRole.label}</Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => setUser({ ...user, role: role.id })}
            className="cursor-pointer"
          >
            <Badge className={`${role.color} text-white mr-2`}>{role.label}</Badge>
            {role.id === user.role && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
