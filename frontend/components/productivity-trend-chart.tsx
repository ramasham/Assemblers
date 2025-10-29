"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function ProductivityTrendChart() {
  // Mock data for productivity trends over time
  const trendData = [
    { date: "Jan 20", productivity: 3.8, efficiency: 82, utilization: 78 },
    { date: "Jan 21", productivity: 4.0, efficiency: 85, utilization: 80 },
    { date: "Jan 22", productivity: 4.2, efficiency: 87, utilization: 83 },
    { date: "Jan 23", productivity: 3.9, efficiency: 84, utilization: 81 },
    { date: "Jan 24", productivity: 4.3, efficiency: 88, utilization: 85 },
    { date: "Jan 25", productivity: 4.5, efficiency: 90, utilization: 87 },
    { date: "Jan 26", productivity: 4.4, efficiency: 89, utilization: 86 },
    { date: "Jan 27", productivity: 4.2, efficiency: 88, utilization: 85 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Productivity, efficiency, and utilization over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="productivity" stroke="hsl(var(--primary))" name="Productivity (u/h)" />
            <Line type="monotone" dataKey="efficiency" stroke="hsl(142 76% 36%)" name="Efficiency (%)" />
            <Line type="monotone" dataKey="utilization" stroke="hsl(221 83% 53%)" name="Utilization (%)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
