import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Clock, TrendingUp, Users } from "lucide-react"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"

export function PlannerStats() {
  const totalOrders = mockJobOrders.length
  const pendingOrders = mockJobOrders.filter((order) => order.status === "pending").length
  const inProgressOrders = mockJobOrders.filter((order) => order.status === "in-progress").length

  const totalUnits = mockJobOrders.reduce((sum, order) => sum + order.quantity, 0)
  const completedUnits = mockJobOrders.reduce((sum, order) => sum + order.completed, 0)
  const overallProgress = Math.round((completedUnits / totalUnits) * 100)

  const avgProductivity =
    mockPerformanceMetrics.reduce((sum, metric) => sum + metric.productivity, 0) / mockPerformanceMetrics.length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Job Orders</CardTitle>
          <ClipboardList className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {pendingOrders} pending, {inProgressOrders} in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Clock className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallProgress}%</div>
          <p className="text-xs text-muted-foreground">
            {completedUnits} / {totalUnits} units
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Productivity</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgProductivity.toFixed(1)} u/hr</div>
          <p className="text-xs text-muted-foreground">Team average output</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          <Users className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockPerformanceMetrics.length}</div>
          <p className="text-xs text-muted-foreground">Working on production</p>
        </CardContent>
      </Card>
    </div>
  )
}
