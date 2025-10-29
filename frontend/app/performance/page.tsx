"use client"

import { BarChart3, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TechnicianStatisticsGrid } from "@/components/technician-statistics-grid"
import { mockPerformanceMetrics } from "@/lib/mock-data"

export default function PerformancePage() {
  const totalTechnicians = mockPerformanceMetrics.length
  const avgProductivity =
    mockPerformanceMetrics.reduce((sum, m) => sum + m.productivity, 0) / mockPerformanceMetrics.length
  const avgEfficiency = mockPerformanceMetrics.reduce((sum, m) => sum + m.efficiency, 0) / mockPerformanceMetrics.length
  const avgUtilization =
    mockPerformanceMetrics.reduce((sum, m) => sum + m.utilization, 0) / mockPerformanceMetrics.length
  const totalUnits = mockPerformanceMetrics.reduce((sum, m) => sum + m.completedUnits, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <p className="text-muted-foreground">Comprehensive metrics and trends for production performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUtilization.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Resource usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground">Units completed today</p>
          </CardContent>
        </Card>
      </div>

      <TechnicianStatisticsGrid />
    </div>
  )
}
