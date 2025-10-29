"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Package, TrendingUp, Bell } from "lucide-react"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"

export function PlannerSummaryCards() {
  const activeJobOrders = mockJobOrders.filter((order) => order.status === "in-progress").length

  const totalDevices = mockJobOrders.reduce((sum, order) => sum + order.quantity, 0)
  const completedDevices = mockJobOrders.reduce((sum, order) => sum + order.completed, 0)
  const inProgressDevices = totalDevices - completedDevices

  const avgProductivity =
    mockPerformanceMetrics.reduce((sum, metric) => sum + metric.productivity, 0) / mockPerformanceMetrics.length
  const avgEfficiency =
    mockPerformanceMetrics.reduce((sum, metric) => sum + metric.efficiency, 0) / mockPerformanceMetrics.length
  const avgUtilization =
    mockPerformanceMetrics.reduce((sum, metric) => sum + metric.utilization, 0) / mockPerformanceMetrics.length

  const criticalAlerts = 3 // Mock data

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Job Orders</CardTitle>
          <ClipboardList className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeJobOrders}</div>
          <p className="text-xs text-muted-foreground">{mockJobOrders.length} total orders</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Devices Status</CardTitle>
          <Package className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressDevices}</div>
          <p className="text-xs text-muted-foreground">{completedDevices} completed</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 border-chart-1/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgProductivity.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            {avgEfficiency.toFixed(0)}% efficiency · {avgUtilization.toFixed(0)}% utilization
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          <Bell className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{criticalAlerts}</div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
