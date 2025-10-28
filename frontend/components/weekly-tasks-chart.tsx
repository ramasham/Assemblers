"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const data = [
  { day: "Mo", hours: 7.5 },
  { day: "Tu", hours: 8.2 },
  { day: "We", hours: 7.8 },
  { day: "Th", hours: 8.5 },
  { day: "Fr", hours: 8.0 },
  { day: "Sa", hours: 6.5 },
]

export function WeeklyTasksChart() {
  const totalHours = data.reduce((sum, item) => sum + item.hours, 0)

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Worked Hours</CardTitle>
          <p className="text-3xl font-bold mt-2">{totalHours.toFixed(1)} hrs</p>
          <p className="text-xs text-muted-foreground">this week</p>
        </div>
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
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="hours" fill="#FF6B4A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
