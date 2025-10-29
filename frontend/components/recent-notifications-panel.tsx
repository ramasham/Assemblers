"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockNotifications } from "@/lib/mock-data"
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function RecentNotificationsPanel() {
  const recentNotifications = mockNotifications.slice(0, 5)

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "urgent":
        return <Bell className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            className={cn("flex gap-3 p-3 rounded-lg border", !notification.read && "bg-accent/50")}
          >
            <div className="mt-0.5">{getIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{new Date(notification.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
