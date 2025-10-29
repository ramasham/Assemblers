"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockJobOrders, type JobOrder } from "@/lib/mock-data"
import { Calendar } from "lucide-react"

interface ActiveJobOrdersProps {
  userName: string
}

export function ActiveJobOrders({ userName }: ActiveJobOrdersProps) {
  const activeOrders = mockJobOrders.filter((order) => order.assignedTo === userName && order.status !== "completed")

  const getPriorityColor = (priority: JobOrder["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-[hsl(var(--alert-error))] text-white"
      case "medium":
        return "bg-[hsl(var(--alert-warning))] text-white"
      case "low":
        return "bg-[hsl(var(--alert-info))] text-white"
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>My Active Job Orders</CardTitle>
        <CardDescription>Current assignments and progress</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto space-y-3">
        {activeOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No active job orders</p>
        ) : (
          activeOrders.map((order) => {
            const progress = (order.completed / order.quantity) * 100
            const daysRemaining = getDaysRemaining(order.dueDate)

            return (
              <div key={order.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{order.jobNumber}</h4>
                      <Badge className={`${getPriorityColor(order.priority)} text-xs py-0 px-1.5`}>
                        {order.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.deviceType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{Math.round(progress)}%</p>
                    <p className="text-[10px] text-muted-foreground">Complete</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Due in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {order.completed} / {order.quantity} units
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
