"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface GreetingHeaderProps {
  userName: string
  productivity?: number
  efficiency?: number
  utilization?: number
}

export function GreetingHeader({ userName, productivity, efficiency, utilization }: GreetingHeaderProps) {
  const [greeting, setGreeting] = useState("")
  const [dateTime, setDateTime] = useState("")

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) setGreeting("Good Morning")
      else if (hour < 18) setGreeting("Good Afternoon")
      else setGreeting("Good Evening")

      const date = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
      setDateTime(date.toLocaleDateString("en-US", options))
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 60000)

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (value: number, baseline = 80) => {
    if (value > baseline + 5) return <TrendingUp className="h-3 w-3 text-emerald-500" />
    if (value < baseline - 5) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{dateTime}</p>
        <h1 className="text-4xl font-bold tracking-tight">
          {greeting}! {userName},
        </h1>
      </div>

      {productivity !== undefined && efficiency !== undefined && utilization !== undefined && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Productivity</p>
              <p className="text-2xl font-bold">{productivity.toFixed(1)}</p>
            </div>
            {getTrendIcon(productivity * 20, 80)}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Efficiency</p>
              <p className="text-2xl font-bold">{efficiency}%</p>
            </div>
            {getTrendIcon(efficiency, 85)}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Utilization</p>
              <p className="text-2xl font-bold">{utilization}%</p>
            </div>
            {getTrendIcon(utilization, 80)}
          </div>
        </div>
      )}
    </div>
  )
}
