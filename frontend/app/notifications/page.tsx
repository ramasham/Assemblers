"use client"

import { useState } from "react"
import { Bell, Check, Trash2, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockNotifications, type Notification } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all")

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "urgent") return n.urgent
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "h-5 w-5"
    switch (type) {
      case "urgent":
        return <Bell className={cn(iconClass, "text-[#FF4D8D]")} />
      case "warning":
        return <Bell className={cn(iconClass, "text-yellow-600 dark:text-yellow-400")} />
      case "success":
        return <Bell className={cn(iconClass, "text-green-600 dark:text-green-400")} />
      default:
        return <Bell className={cn(iconClass, "text-blue-600 dark:text-blue-400")} />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with your alerts and messages</p>
        </div>
        <Button onClick={markAllAsRead} variant="outline" size="sm">
          <Check className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="urgent">Urgent Only</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {filteredNotifications.filter((n) => !n.read).length} unread
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications to display</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn("transition-colors", !notification.read && "border-l-4 border-l-primary bg-accent/50")}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      {notification.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
