"use client"

import { AlertTriangle, Clock, TrendingDown, AlertCircle, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
  id: string
  type: "delay" | "performance" | "idle" | "completion"
  severity: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: string
}

const mockPlannerAlerts: Alert[] = [
  {
    id: "1",
    type: "delay",
    severity: "critical",
    title: "Job Order Behind Schedule",
    message: "JO-2025-001 is 2 hours behind schedule",
    timestamp: "5 min ago",
  },
  {
    id: "2",
    type: "completion",
    severity: "info",
    title: "Device Completed",
    message: "SN-12345 completed all operations",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "idle",
    severity: "warning",
    title: "Technician Idle",
    message: "Mike Davis has no active tasks for 30 minutes",
    timestamp: "30 min ago",
  },
  {
    id: "4",
    type: "performance",
    severity: "warning",
    title: "Low Team Efficiency",
    message: "Team efficiency dropped to 78%",
    timestamp: "1 hour ago",
  },
]

const alertIcons = {
  delay: AlertTriangle,
  performance: TrendingDown,
  idle: Clock,
  completion: AlertCircle,
}

const severityColors = {
  critical: "text-red-400 bg-red-500/10",
  warning: "text-yellow-400 bg-yellow-500/10",
  info: "text-blue-400 bg-blue-500/10",
}

export function PlannerRealTimeAlerts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-white">Real-Time Alerts</h2>
        </div>
        <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
          {mockPlannerAlerts.filter((a) => a.severity === "critical").length} Critical
        </Badge>
      </div>

      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {mockPlannerAlerts.map((alert) => {
            const Icon = alertIcons[alert.type]
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${severityColors[alert.severity]} border-gray-700/50 hover:border-gray-600/50 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1">{alert.title}</h3>
                    <p className="text-xs text-gray-400 mb-1">{alert.message}</p>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="pt-2 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              Delays: {mockPlannerAlerts.filter((a) => a.type === "delay").length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              Performance: {mockPlannerAlerts.filter((a) => a.type === "performance").length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              Idle: {mockPlannerAlerts.filter((a) => a.type === "idle").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
