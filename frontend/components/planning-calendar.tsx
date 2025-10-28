"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockJobOrders } from "@/lib/mock-data"
import { CalendarIcon } from "lucide-react"

export function PlanningCalendar() {
  // Group job orders by due date
  const ordersByDate = mockJobOrders.reduce(
    (acc, order) => {
      const date = new Date(order.dueDate).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(order)
      return acc
    },
    {} as Record<string, typeof mockJobOrders>,
  )

  const sortedDates = Object.keys(ordersByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Schedule</CardTitle>
        <CardDescription>Upcoming job orders organized by due date</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedDates.map((date) => {
          const orders = ordersByDate[date]
          const isOverdue = new Date(date) < new Date()

          return (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <h4 className={`font-semibold ${isOverdue ? "text-destructive" : ""}`}>
                  {date}
                  {isOverdue && " (Overdue)"}
                </h4>
                <Badge variant="outline" className="ml-auto">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="ml-6 space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{order.jobNumber}</span>
                          <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                            {order.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.deviceType}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.completed}/{order.quantity} units completed
                        </p>
                      </div>
                      <Badge variant={order.status === "completed" ? "secondary" : "outline"}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
