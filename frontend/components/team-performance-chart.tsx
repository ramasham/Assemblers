"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { mockPerformanceMetrics } from "@/lib/mock-data"

export function TeamPerformanceChart() {
  const chartData = mockPerformanceMetrics.map((metric) => ({
    name: metric.technicianName.split(" ")[0],
    productivity: metric.productivity,
    efficiency: metric.efficiency,
    utilization: metric.utilization,
  }))

  const chartConfig = {
    productivity: {
      label: "Productivity (units/hr)",
      color: "hsl(var(--chart-1))",
    },
    efficiency: {
      label: "Efficiency (%)",
      color: "hsl(var(--chart-2))",
    },
    utilization: {
      label: "Utilization (%)",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance Overview</CardTitle>
        <CardDescription>Productivity, efficiency, and utilization metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="productivity" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="efficiency" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="utilization" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
