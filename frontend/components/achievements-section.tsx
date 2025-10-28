"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Gauge, Zap, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface AchievementsSectionProps {
  userName: string
  location: string
  productivity: number
  productivityTrend: number
  efficiency: number
  efficiencyTrend: number
  utilization: number
  utilizationTrend: number
}

export function AchievementsSection({
  userName,
  location,
  productivity,
  productivityTrend,
  efficiency,
  efficiencyTrend,
  utilization,
  utilizationTrend,
}: AchievementsSectionProps) {
  const getTrendDisplay = (trend: number) => {
    if (trend > 0) {
      return (
        <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
          <TrendingUp className="h-4 w-4" />
          <span>+{trend}%</span>
        </div>
      )
    } else if (trend < 0) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-sm font-semibold">
          <TrendingDown className="h-4 w-4" />
          <span>{trend}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-300 text-sm font-semibold">
          <Minus className="h-4 w-4" />
          <span>No change</span>
        </div>
      )
    }
  }

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
            <Gauge className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{productivity}</p>
            <p className="text-sm text-gray-200 font-semibold mb-1">Productivity</p>
            {getTrendDisplay(productivityTrend)}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-gray-500/10">
            <Zap className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{efficiency}%</p>
            <p className="text-sm text-gray-200 font-semibold mb-1">Efficiency</p>
            {getTrendDisplay(efficiencyTrend)}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-gray-500/10">
            <Activity className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{utilization}%</p>
            <p className="text-sm text-gray-200 font-semibold mb-1">Utilization</p>
            {getTrendDisplay(utilizationTrend)}
          </div>
        </div>
      </div>
    </div>
  )
}
