"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockJobOrders } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function JobCompletionChart() {
  const chartData = mockJobOrders.map((order) => ({
    name: order.jobNumber,
    completed: order.completed,
    remaining: order.quantity - order.completed,
    total: order.quantity,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Order Completion Rates</CardTitle>
        <CardDescription>Progress comparison across all job orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
            <Bar dataKey="remaining" fill="hsl(var(--muted))" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
