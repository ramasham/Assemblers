"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockPerformanceMetrics } from "@/lib/mock-data"
import { Trophy } from "lucide-react"

export function Leaderboard() {
  const topPerformers = [...mockPerformanceMetrics].sort((a, b) => b.efficiency - a.efficiency).slice(0, 3)

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500"
      case 1:
        return "text-gray-400"
      case 2:
        return "text-amber-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top performers this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {topPerformers.map((performer, index) => (
          <div
            key={performer.technicianId}
            className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
          >
            <div className={`text-2xl font-bold ${getMedalColor(index)}`}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/20 text-primary">
                {performer.technicianName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{performer.technicianName}</p>
              <p className="text-xs text-muted-foreground">Efficiency: {performer.efficiency}%</p>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {performer.completedUnits} units
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
