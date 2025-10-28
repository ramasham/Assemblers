"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EfficiencyRingProps {
  value: number
}

export function EfficiencyRing({ value }: EfficiencyRingProps) {
  const getColor = () => {
    if (value >= 90) return "#6EE7B7"
    if (value >= 70) return "#FFB84C"
    return "#FF4D8D"
  }

  const getStatus = () => {
    if (value >= 90) return "Excellent"
    if (value >= 70) return "On Track"
    return "Needs Improvement"
  }

  const color = getColor()
  const status = getStatus()
  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Efficiency</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            <circle cx="70" cy="70" r="55" fill="none" stroke="hsl(var(--border))" strokeWidth="10" opacity="0.2" />
            <circle
              cx="70"
              cy="70"
              r="55"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color }}>
              {value}%
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Efficiency</span>
          </div>
        </div>
        <p className="text-xs font-medium mt-3" style={{ color }}>
          {status}
        </p>
      </CardContent>
    </Card>
  )
}
