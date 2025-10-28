"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface UtilizationBarProps {
  productiveHours: number
  breakHours: number
  downtimeHours: number
  totalHours?: number
}

export function UtilizationBar({ productiveHours, breakHours, downtimeHours, totalHours = 8 }: UtilizationBarProps) {
  const utilizationPercentage = ((productiveHours / totalHours) * 100).toFixed(0)

  const productiveWidth = (productiveHours / totalHours) * 100
  const breakWidth = (breakHours / totalHours) * 100
  const downtimeWidth = (downtimeHours / totalHours) * 100

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Utilization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#8b5cf6]">{utilizationPercentage}%</span>
          <span className="text-sm text-muted-foreground">active</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {productiveHours}h productive / {totalHours}h available
            </span>
          </div>

          <div className="h-6 w-full rounded-lg overflow-hidden flex bg-muted/20">
            <div
              className="bg-[#6EE7B7] flex items-center justify-center text-xs font-medium text-background"
              style={{ width: `${productiveWidth}%` }}
            >
              {productiveHours > 0 && `${productiveHours}h`}
            </div>
            <div
              className="bg-[#FFB84C] flex items-center justify-center text-xs font-medium text-background"
              style={{ width: `${breakWidth}%` }}
            >
              {breakHours > 0 && `${breakHours}h`}
            </div>
            <div
              className="bg-[#FF4D8D] flex items-center justify-center text-xs font-medium text-background"
              style={{ width: `${downtimeWidth}%` }}
            >
              {downtimeHours > 0 && `${downtimeHours}h`}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#6EE7B7]" />
              <span className="text-muted-foreground">Productive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#FFB84C]" />
              <span className="text-muted-foreground">Breaks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#FF4D8D]" />
              <span className="text-muted-foreground">Downtime</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
