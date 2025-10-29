"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Home,
  Calendar,
  ClipboardList,
  ClipboardCheck,
  FolderKanban,
  BarChart3,
  FileText,
  Settings,
  Clipboard,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navItems: NavItem[] = [
  // All roles
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  // Technicians (production-worker, tester, quality)
  {
    title: "My Tasks",
    href: "/technician-tasks",
    icon: Clipboard,
    roles: ["production-worker", "tester", "quality"],
  },
  {
    title: "Daily Task Input",
    href: "/submit-work",
    icon: ClipboardList,
    roles: ["production-worker", "tester", "quality"],
  },
  {
    title: "Submission History",
    href: "/submission-history",
    icon: History,
    roles: ["production-worker", "tester", "quality"],
  },
  {
    title: "Operations",
    href: "/supervisor/operations",
    icon: ClipboardList,
    roles: ["production-supervisor", "test-supervisor", "quality-supervisor"],
  },
  {
    title: "Task Review",
    href: "/supervisor/task-review",
    icon: ClipboardCheck,
    roles: ["production-supervisor", "test-supervisor", "quality-supervisor"],
  },
  // Planner
  {
    title: "Job Orders",
    href: "/job-orders",
    icon: FolderKanban,
    roles: ["engineer-planner"],
  },
  {
    title: "Performance",
    href: "/performance",
    icon: BarChart3,
    roles: ["engineer-planner"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["engineer-planner"],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return user && user.currentRole && item.roles.includes(user.currentRole)
  })

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-border/50">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">PM</span>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto flex flex-col items-center">
          <TooltipProvider delayDuration={0}>
            <div className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center h-12 w-full transition-all duration-200 relative group",
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                        <div
                          className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200",
                            isActive ? "bg-primary/10" : "group-hover:bg-accent",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
        </nav>

        <div className="border-t border-border/50 py-4 flex items-center justify-center">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center h-12 w-full text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg group-hover:bg-accent transition-all duration-200">
                    <Settings className="h-5 w-5" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  )
}
