"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockPerformanceMetrics } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"

export function LeadersPanel() {
  const topPerformers = [...mockPerformanceMetrics].sort((a, b) => b.efficiency - a.efficiency).slice(0, 4)

  return (
    <Card className="bg-card border-border">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Leaders</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {topPerformers.map((performer, index) => (
            <div
              key={performer.technicianId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                  {performer.technicianName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{performer.technicianName}</p>
                <p className="text-xs text-muted-foreground">Production Worker</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-primary">{performer.completedUnits * 100}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
