"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PerformanceDonutChartProps {
  productivity: number
  efficiency: number
  utilization: number
}

export function TaskDonutChart({ productivity, efficiency, utilization }: PerformanceDonutChartProps) {
  const data = [
    { name: "Productivity", value: productivity, color: "#FF6B4A", unit: "units/hr" }, // Orange
    { name: "Efficiency", value: efficiency, color: "#3EE9D1", unit: "%" }, // Cyan
    { name: "Utilization", value: utilization, color: "#8b5cf6", unit: "%" }, // Purple
  ]

  const averageScore = Math.round((efficiency + utilization) / 2)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#6EE7B7" // Mint green for good performance
    if (score >= 60) return "#FFB84C" // Amber for medium performance
    return "#FF4D8D" // Magenta for low performance
  }

  const scoreColor = getScoreColor(averageScore)

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Performance Metrics</CardTitle>
        <Select defaultValue="week">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="flex flex-col items-center justify-center rounded-full p-6"
                style={{ backgroundColor: `${scoreColor}20`, border: `2px solid ${scoreColor}` }}
              >
                <p className="text-4xl font-bold" style={{ color: scoreColor }}>
                  {averageScore}%
                </p>
                <p className="text-xs font-medium" style={{ color: scoreColor }}>
                  AVG SCORE
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">
                    {item.value}
                    {item.unit}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
