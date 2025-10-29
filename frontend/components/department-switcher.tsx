"use client"

import { useAuth, type Department } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Factory, FlaskConical, CheckCircle2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const departmentConfig: Record<
  Department,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
  }
> = {
  production: {
    label: "Production",
    icon: Factory,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  test: {
    label: "Testing",
    icon: FlaskConical,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  quality: {
    label: "Quality",
    icon: CheckCircle2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
  },
}

export function DepartmentSwitcher() {
  const { user, switchDepartment } = useAuth()
  const router = useRouter()

  // Only show if user has multiple departments
  if (!user || !user.departments || user.departments.length <= 1) {
    return null
  }

  const currentDept = user.department || user.departments[0]
  const currentConfig = departmentConfig[currentDept]
  const CurrentIcon = currentConfig.icon

  const handleDepartmentSwitch = async (department: Department) => {
    await switchDepartment(department)
    // Refresh the page to load department-specific data
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "gap-2 border-2 transition-all",
            currentConfig.bgColor
          )}
        >
          <CurrentIcon className={cn("h-4 w-4", currentConfig.color)} />
          <span className="font-medium">{currentConfig.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Switch Department</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.departments.map((dept) => {
          const config = departmentConfig[dept]
          const Icon = config.icon
          const isActive = dept === currentDept
          
          return (
            <DropdownMenuItem
              key={dept}
              onClick={() => handleDepartmentSwitch(dept)}
              disabled={isActive}
              className={cn(
                "cursor-pointer",
                isActive && "bg-accent"
              )}
            >
              <Icon className={cn("mr-2 h-4 w-4", config.color)} />
              <span>{config.label}</span>
              {isActive && (
                <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
