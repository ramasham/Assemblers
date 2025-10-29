"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchJobOrderStats, fetchPerformanceMetrics } from "@/lib/api"
import { ClipboardList, Clock, TrendingUp, Users } from "lucide-react"
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

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Job Orders</CardTitle>
          <ClipboardList className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingOrders} pending, {stats.inProgressOrders} in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Clock className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedUnits} / {stats.totalUnits} units
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Productivity</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgProductivity.toFixed(1)} u/hr</div>
          <p className="text-xs text-muted-foreground">Team average output</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          <Users className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeTechnicians}</div>
          <p className="text-xs text-muted-foreground">Working on production</p>
        </CardContent>
      </Card>
    </div>
  )
}
