import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Clock, TrendingUp, Users } from "lucide-react"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { fetchJobOrderStats, fetchPerformanceMetrics } from "@/lib/api"
import { Package, Clock, Users, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function PlannerStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    totalUnits: 0,
    completedUnits: 0,
    avgProductivity: 0,
    activeTechnicians: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      const [jobStats, metrics] = await Promise.all([
        fetchJobOrderStats(),
        fetchPerformanceMetrics()
      ])
      
      const avgProductivity = metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.productivity, 0) / metrics.length
        : 0
      
      setStats({
        totalOrders: jobStats.total,
        pendingOrders: jobStats.pending,
        inProgressOrders: jobStats.inProgress,
        totalUnits: jobStats.totalUnits,
        completedUnits: jobStats.completedUnits,
        avgProductivity,
        activeTechnicians: metrics.length
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  const completionRate = stats.totalUnits > 0 
    ? Math.round((stats.completedUnits / stats.totalUnits) * 100) 
    : 0

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
