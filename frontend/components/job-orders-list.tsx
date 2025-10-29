"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockJobOrders, type JobOrder } from "@/lib/mock-data"
import { Calendar, Hash } from "lucide-react"

interface JobOrdersListProps {
  assignedTo?: string
  limit?: number
}

export function JobOrdersList({ assignedTo, limit }: JobOrdersListProps) {
  let orders = assignedTo ? mockJobOrders.filter((order) => order.assignedTo === assignedTo) : mockJobOrders

  if (limit) {
    orders = orders.slice(0, limit)
  }

  const getStatusColor = (status: JobOrder["status"]) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "in-progress":
        return "default"
      case "delayed":
        return "destructive"
      case "pending":
        return "outline"
    }
  }

  const getPriorityColor = (priority: JobOrder["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Orders</CardTitle>
        <CardDescription>Active manufacturing orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No job orders assigned</p>
        ) : (
          orders.map((order) => {
            const progress = (order.completed / order.quantity) * 100
            return (
              <div key={order.id} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{order.jobNumber}</h4>
                      <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.deviceType}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {order.completed} / {order.quantity} units ({Math.round(progress)}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    <span>{order.serialNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Note:</span> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
