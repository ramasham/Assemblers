"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { mockPerformanceMetrics, mockJobOrders } from "@/lib/mock-data"
import { Users } from "lucide-react"

export function ResourceAllocation() {
  // Calculate workload per technician
  const technicianWorkload = mockPerformanceMetrics.map((metric) => {
    const assignedOrders = mockJobOrders.filter(
      (order) => order.assignedTo === metric.technicianName && order.status !== "completed",
    )
    const totalUnits = assignedOrders.reduce((sum, order) => sum + (order.quantity - order.completed), 0)

    return {
      name: metric.technicianName,
      activeOrders: assignedOrders.length,
      remainingUnits: totalUnits,
      utilization: metric.utilization,
      efficiency: metric.efficiency,
    }
  })

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-destructive"
    if (utilization >= 70) return "text-primary"
    return "text-secondary"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
        <CardDescription>Technician workload and capacity overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {technicianWorkload.map((tech) => (
          <div key={tech.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tech.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{tech.activeOrders} active orders</Badge>
                <span className={`text-sm font-semibold ${getUtilizationColor(tech.utilization)}`}>
                  {tech.utilization}% utilized
                </span>
              </div>
            </div>
            <Progress value={tech.utilization} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{tech.remainingUnits} units remaining</span>
              <span>Efficiency: {tech.efficiency}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
