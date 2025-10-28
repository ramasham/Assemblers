"use client"

import { useEffect, useState } from "react"
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Notification } from "@/lib/mock-data"

interface NotificationPopupProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationPopup({ notifications, onDismiss }: NotificationPopupProps) {
  const [visible, setVisible] = useState<string[]>([])

  useEffect(() => {
    const urgentNotifications = notifications.filter((n) => n.urgent && !n.read)
    if (urgentNotifications.length > 0) {
      setVisible(urgentNotifications.map((n) => n.id))
    }
  }, [notifications])

  const handleDismiss = (id: string) => {
    setVisible((prev) => prev.filter((nid) => nid !== id))
    onDismiss(id)
  }

  const visibleNotifications = notifications.filter((n) => visible.includes(n.id))

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-md">
      {visibleNotifications.map((notification) => {
        const Icon =
          notification.type === "urgent"
            ? AlertCircle
            : notification.type === "warning"
              ? AlertTriangle
              : notification.type === "success"
                ? CheckCircle
                : Info

        return (
          <Card
            key={notification.id}
            className={cn(
              "p-4 shadow-lg border-l-4 animate-in slide-in-from-right",
              notification.type === "urgent" && "border-l-[hsl(var(--alert-error))] bg-[hsl(var(--alert-error))]/10",
              notification.type === "warning" &&
                "border-l-[hsl(var(--alert-warning))] bg-[hsl(var(--alert-warning))]/10",
              notification.type === "info" && "border-l-[hsl(var(--alert-info))] bg-[hsl(var(--alert-info))]/10",
              notification.type === "success" &&
                "border-l-[hsl(var(--alert-success))] bg-[hsl(var(--alert-success))]/10",
            )}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={cn(
                  "h-5 w-5 mt-0.5",
                  notification.type === "urgent" && "text-[hsl(var(--alert-error))]",
                  notification.type === "warning" && "text-[hsl(var(--alert-warning))]",
                  notification.type === "info" && "text-[hsl(var(--alert-info))]",
                  notification.type === "success" && "text-[hsl(var(--alert-success))]",
                )}
              />
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => handleDismiss(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
