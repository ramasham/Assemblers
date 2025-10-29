"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockPerformanceMetrics } from "@/lib/mock-data"
import Link from "next/link"

export function TopPerformersPanel() {
  const topPerformers = [...mockPerformanceMetrics].sort((a, b) => b.efficiency - a.efficiency).slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Performers</CardTitle>
          <Link href="/performance" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((performer, index) => (
            <div key={performer.technicianName} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={`text-sm font-semibold ${
                    index === 0
                      ? "bg-gradient-to-br from-purple-500 to-purple-600"
                      : index === 1
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : index === 2
                          ? "bg-gradient-to-br from-cyan-500 to-cyan-600"
                          : "bg-gradient-to-br from-gray-500 to-gray-600"
                  } text-white`}
                >
                  {performer.technicianName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{performer.technicianName}</p>
                <p className="text-xs text-muted-foreground">Production Worker</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{performer.completedUnits * 100}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
