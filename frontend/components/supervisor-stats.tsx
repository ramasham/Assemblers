import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ClipboardList, AlertTriangle, CheckCircle } from "lucide-react"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"

export function SupervisorStats() {
  const totalTechnicians = mockPerformanceMetrics.length
  const totalJobOrders = mockJobOrders.length
  const delayedOrders = mockJobOrders.filter((order) => order.status === "delayed").length
  const completedOrders = mockJobOrders.filter((order) => order.status === "completed").length

  const avgEfficiency =
    mockPerformanceMetrics.reduce((sum, metric) => sum + metric.efficiency, 0) / mockPerformanceMetrics.length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTechnicians}</div>
          <p className="text-xs text-muted-foreground">Team members working</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Job Orders</CardTitle>
          <ClipboardList className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobOrders}</div>
          <p className="text-xs text-muted-foreground">Active manufacturing orders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedOrders}</div>
          <p className="text-xs text-muted-foreground">Successfully finished</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Orders</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{delayedOrders}</div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
