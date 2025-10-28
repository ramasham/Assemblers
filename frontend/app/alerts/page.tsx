"use client"

import { AlertTriangle, Clock, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"

export default function AlertsPage() {
  const delayedOrders = mockJobOrders.filter((jo) => jo.status === "delayed")
  const approachingDeadlines = mockJobOrders.filter((jo) => {
    const dueDate = new Date(jo.dueDate)
    const today = new Date()
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 3 && daysUntilDue > 0 && jo.status === "in-progress"
  })
  const lowPerformers = mockPerformanceMetrics.filter((m) => m.efficiency < 85)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alerts & Bottlenecks</h2>
        <p className="text-muted-foreground">Critical issues requiring immediate attention</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#FF4D8D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF4D8D]">{delayedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Behind schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approaching Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{approachingDeadlines.length}</div>
            <p className="text-xs text-muted-foreground">Due within 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Performers</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{lowPerformers.length}</div>
            <p className="text-xs text-muted-foreground">Below 85% efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Delayed Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FF4D8D]">
            <AlertTriangle className="h-5 w-5" />
            Delayed Job Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {delayedOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No delayed orders</p>
          ) : (
            delayedOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-[#FF4D8D]">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{order.jobNumber}</h4>
                        <p className="text-sm text-muted-foreground">{order.deviceType}</p>
                      </div>
                      <Badge variant="destructive">Delayed</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">
                          {order.completed}/{order.quantity} units
                        </span>
                      </div>
                      <Progress value={(order.completed / order.quantity) * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{new Date(order.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned To:</span>
                        <p className="font-medium">{order.assignedTo || "Unassigned"}</p>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="font-medium">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Approaching Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Clock className="h-5 w-5" />
            Approaching Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {approachingDeadlines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No approaching deadlines</p>
          ) : (
            approachingDeadlines.map((order) => {
              const daysUntilDue = Math.ceil(
                (new Date(order.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )
              return (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{order.jobNumber}</h4>
                    <p className="text-xs text-muted-foreground">{order.deviceType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} left
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.completed}/{order.quantity} units
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Low Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <TrendingDown className="h-5 w-5" />
            Low Performance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lowPerformers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No performance issues</p>
          ) : (
            lowPerformers.map((metric) => (
              <div key={metric.technicianId} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <h4 className="font-medium text-sm">{metric.technicianName}</h4>
                  <p className="text-xs text-muted-foreground">
                    {metric.completedUnits} units in {metric.workHours}h
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{metric.efficiency}%</p>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
