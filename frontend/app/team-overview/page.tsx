"use client"

import { Users, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TechnicianPerformanceTable } from "@/components/technician-performance-table"
import { TeamPerformanceChart } from "@/components/team-performance-chart"
import { AllJobOrders } from "@/components/all-job-orders"
import { mockPerformanceMetrics, mockJobOrders } from "@/lib/mock-data"

export default function TeamOverviewPage() {
  const activeTechnicians = mockPerformanceMetrics.length
  const avgProductivity =
    mockPerformanceMetrics.reduce((sum, m) => sum + m.productivity, 0) / mockPerformanceMetrics.length
  const avgEfficiency = mockPerformanceMetrics.reduce((sum, m) => sum + m.efficiency, 0) / mockPerformanceMetrics.length
  const bottlenecks = mockJobOrders.filter((jo) => jo.status === "delayed").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Overview</h2>
        <p className="text-muted-foreground">Monitor team performance and identify bottlenecks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTechnicians}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProductivity.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Units per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bottlenecks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#FF4D8D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF4D8D]">{bottlenecks}</div>
            <p className="text-xs text-muted-foreground">Delayed job orders</p>
          </CardContent>
        </Card>
      </div>

      <TeamPerformanceChart />

      <TechnicianPerformanceTable />

      <AllJobOrders />
    </div>
  )
}
