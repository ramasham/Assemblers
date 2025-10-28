"use client"

import { AlertTriangle, Clock, TrendingDown, AlertCircle, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
  id: string
  type: "delay" | "performance" | "idle" | "discrepancy"
  severity: "critical" | "warning" | "info"
  title: string
  message: string
  destination: "technician" | "supervisor" | "planner"
  timestamp: string
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "delay",
    severity: "critical",
    title: "Task Exceeds Due Time",
    message: "JO-2025-001 is 2 hours behind schedule",
    destination: "supervisor",
    timestamp: "5 min ago",
  },
  {
    id: "2",
    type: "performance",
    severity: "warning",
    title: "Low Efficiency Alert",
    message: "Current efficiency at 75% (below 80% threshold)",
    destination: "technician",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "idle",
    severity: "warning",
    title: "No Updates Detected",
    message: "No activity logged for 35 minutes",
    destination: "supervisor",
    timestamp: "35 min ago",
  },
  {
    id: "4",
    type: "performance",
    severity: "warning",
    title: "Output Below Target",
    message: "Daily output at 65% of target",
    destination: "technician",
    timestamp: "1 hour ago",
  },
  {
    id: "5",
    type: "delay",
    severity: "critical",
    title: "Job Order Overdue",
    message: "JO-2025-003 missed deadline without completion",
    destination: "planner",
    timestamp: "2 hours ago",
  },
]

const alertIcons = {
  delay: AlertTriangle,
  performance: TrendingDown,
  idle: Clock,
  discrepancy: AlertCircle,
}

const severityColors = {
  critical: "text-red-400 bg-red-500/10",
  warning: "text-yellow-400 bg-yellow-500/10",
  info: "text-blue-400 bg-blue-500/10",
}

const destinationColors = {
  technician: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  supervisor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  planner: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
}

export function RealTimeAlerts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-white">Real-Time Alerts</h2>
        </div>
        <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
          {mockAlerts.filter((a) => a.severity === "critical").length} Critical
        </Badge>
      </div>

      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const Icon = alertIcons[alert.type]
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${severityColors[alert.severity]} border-gray-700/50 hover:border-gray-600/50 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{alert.title}</h3>
                      <Badge variant="outline" className={`text-xs ${destinationColors[alert.destination]}`}>
                        {alert.destination}
                      </Badge>
                    </div>
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
              Delays: {mockAlerts.filter((a) => a.type === "delay").length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              Performance: {mockAlerts.filter((a) => a.type === "performance").length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              Idle: {mockAlerts.filter((a) => a.type === "idle").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
