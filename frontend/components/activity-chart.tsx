"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const activityData = [
  { day: "M", hours: 1.5 },
  { day: "T", hours: 2.2 },
  { day: "W", hours: 2.8 },
  { day: "T", hours: 1.8 },
  { day: "F", hours: 2.5 },
  { day: "S", hours: 0.5 },
  { day: "S", hours: 0 },
]

export function ActivityChart() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Activity</h2>
        <Select defaultValue="hours">
          <SelectTrigger className="w-24 h-8 bg-[#3d1a5f] border-[#4d2a6f] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#3d1a5f] border-[#4d2a6f] text-white">
            <SelectItem value="hours">Hours</SelectItem>
            <SelectItem value="tasks">Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4d2a6f" opacity={0.5} />
            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#3d1a5f",
                border: "1px solid #4d2a6f",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              labelStyle={{ color: "#ffffff" }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
