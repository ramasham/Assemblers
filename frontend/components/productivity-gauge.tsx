"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProductivityGaugeProps {
  value: number
  target?: number
  trend?: number
}

export function ProductivityGauge({ value, target = 5.0, trend = 0 }: ProductivityGaugeProps) {
  const percentage = Math.min((value / target) * 100, 100)
  const isPositiveTrend = trend >= 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Productivity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#FF6B4A]">{value.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">units/hr</span>
        </div>

        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-xs ${isPositiveTrend ? "text-[#6EE7B7]" : "text-[#FF4D8D]"}`}>
            {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="font-medium">
              {isPositiveTrend ? "+" : ""}
              {trend}% vs yesterday
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Target Progress</span>
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">Target: {target} units/hr</p>
        </div>
      </CardContent>
    </Card>
  )
}
