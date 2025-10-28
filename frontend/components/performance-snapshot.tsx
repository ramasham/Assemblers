"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface PerformanceSnapshotProps {
  productivity: number
  efficiency: number
  utilization: number
}

export function PerformanceSnapshot({ productivity, efficiency, utilization }: PerformanceSnapshotProps) {
  const metrics = [
    {
      label: "Productivity",
      value: `${productivity.toFixed(1)} units/hr`,
      change: 8,
      trend: "up" as const,
    },
    {
      label: "Efficiency",
      value: `${efficiency}%`,
      change: -2,
      trend: "down" as const,
    },
    {
      label: "Utilization",
      value: `${utilization}%`,
      change: 0,
      trend: "neutral" as const,
    },
  ]

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-[hsl(var(--alert-success))]" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-[hsl(var(--alert-error))]" />
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-[hsl(var(--alert-success))]"
      case "down":
        return "text-[hsl(var(--alert-error))]"
      case "neutral":
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Snapshot</CardTitle>
        <CardDescription>Your metrics with recent trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-bold">{metric.value}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change > 0 ? "+" : ""}
                  {metric.change !== 0 ? `${metric.change}%` : "No change"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
