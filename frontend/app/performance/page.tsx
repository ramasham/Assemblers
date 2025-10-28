"use client"

import { BarChart3, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamPerformanceChart } from "@/components/team-performance-chart"
import { TechnicianPerformanceTable } from "@/components/technician-performance-table"
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
        <h2 className="text-3xl font-bold tracking-tight">Performance Metrics</h2>
        <p className="text-muted-foreground">Analyze team and individual performance data</p>
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

      <TeamPerformanceChart />

      <TechnicianPerformanceTable />

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Top Performers</h4>
              <ul className="space-y-2 text-sm">
                {mockPerformanceMetrics
                  .sort((a, b) => b.productivity - a.productivity)
                  .slice(0, 3)
                  .map((metric) => (
                    <li key={metric.technicianId} className="flex items-center justify-between">
                      <span className="text-green-800 dark:text-green-200">{metric.technicianName}</span>
                      <span className="font-medium text-green-900 dark:text-green-100">
                        {metric.productivity.toFixed(1)} units/h
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Needs Improvement</h4>
              <ul className="space-y-2 text-sm">
                {mockPerformanceMetrics
                  .sort((a, b) => a.efficiency - b.efficiency)
                  .slice(0, 3)
                  .map((metric) => (
                    <li key={metric.technicianId} className="flex items-center justify-between">
                      <span className="text-yellow-800 dark:text-yellow-200">{metric.technicianName}</span>
                      <span className="font-medium text-yellow-900 dark:text-yellow-100">{metric.efficiency}%</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
