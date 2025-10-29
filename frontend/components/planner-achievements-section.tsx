"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClipboardList, TrendingUp, Gauge } from "lucide-react"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"

interface PlannerAchievementsSectionProps {
  userName: string
  location: string
}

export function PlannerAchievementsSection({ userName, location }: PlannerAchievementsSectionProps) {
  const totalOrders = mockJobOrders.length
  const inProgressOrders = mockJobOrders.filter((order) => order.status === "in-progress").length

  const totalUnits = mockJobOrders.reduce((sum, order) => sum + order.quantity, 0)
  const completedUnits = mockJobOrders.reduce((sum, order) => sum + order.completed, 0)
  const overallProgress = Math.round((completedUnits / totalUnits) * 100)

  const avgProductivity =
    mockPerformanceMetrics.reduce((sum, metric) => sum + metric.productivity, 0) / mockPerformanceMetrics.length

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xl">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg text-white">{userName}</h3>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-gray-500/10">
            <ClipboardList className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{totalOrders}</p>
            <p className="text-sm text-gray-200 font-semibold mb-1">Total Orders</p>
            <div className="flex items-center gap-1 text-gray-300 text-sm font-semibold">
              <span>{inProgressOrders} active</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-gray-500/10">
            <Gauge className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{overallProgress}%</p>
            <p className="text-sm text-gray-200 font-semibold mb-1">Progress</p>
            <div className="flex items-center gap-1 text-gray-300 text-sm font-semibold">
              <span>
                {completedUnits}/{totalUnits} units
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-gray-500/10">
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{avgProductivity.toFixed(1)}</p>
            <p className="text-sm text-gray-200 font-semibold mb-1">Avg Productivity</p>
            <div className="flex items-center gap-1 text-gray-300 text-sm font-semibold">
              <span>units/hour</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
