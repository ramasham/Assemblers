"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockAlerts, type Alert } from "@/lib/mock-data"
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"

export function AlertsPanel() {
  const { user } = useAuth()

  const getFilteredAlerts = () => {
    if (!user?.currentRole) return []

    const department = getDepartmentFromRole(user.currentRole)
    const destination = getDestinationFromRole(user.currentRole)

    return mockAlerts.filter((alert) => {
      const departmentMatch = !alert.department || alert.department === department
      const destinationMatch = !alert.destination || alert.destination === destination

      return departmentMatch && destinationMatch
    })
  }

  const [alerts, setAlerts] = useState<Alert[]>(getFilteredAlerts())

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "default"
      case "success":
        return "secondary"
      case "info":
        return "outline"
    }
  }

  const unreadCount = alerts.filter((alert) => !alert.read).length

  const getDepartmentFromRole = (role: UserRole) => {
    if (role === "production-supervisor" || role === "production-worker") return "production"
    if (role === "test-supervisor" || role === "tester") return "test"
    if (role === "quality-supervisor" || role === "quality") return "quality"
    return null
  }

  const getDestinationFromRole = (role: UserRole) => {
    if (role === "engineer-planner") return "planner"
    if (role.includes("supervisor")) return "supervisor"
    return "technician"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Real-time notifications and updates</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 px-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${!alert.read ? "bg-accent/50" : "bg-card"}`}
            >
              <div
                className={cn(
                  "mt-0.5",
                  alert.type === "error" && "text-[hsl(var(--alert-error))]",
                  alert.type === "warning" && "text-[hsl(var(--alert-warning))]",
                  alert.type === "success" && "text-[hsl(var(--alert-success))]",
                  alert.type === "info" && "text-[hsl(var(--alert-info))]",
                )}
              >
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight">{alert.title}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
