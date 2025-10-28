"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { TrendingUp, Target, Clock } from "lucide-react"

interface DailyProgressProps {
  completedTasks: number
  totalTasks: number
  completedUnits: number
  targetUnits: number
  hoursWorked: number
  targetHours: number
}

export function DailyProgress({
  completedTasks,
  totalTasks,
  completedUnits,
  targetUnits,
  hoursWorked,
  targetHours,
}: DailyProgressProps) {
  const taskProgress = (completedTasks / totalTasks) * 100
  const unitProgress = (completedUnits / targetUnits) * 100
  const timeProgress = (hoursWorked / targetHours) * 100

  const getTrafficLight = (progress: number) => {
    if (progress >= 80)
      return {
        color: "text-[hsl(var(--alert-success))]",
        bg: "bg-[hsl(var(--alert-success))]",
        label: "On Track",
      }
    if (progress >= 50)
      return {
        color: "text-[hsl(var(--alert-warning))]",
        bg: "bg-[hsl(var(--alert-warning))]",
        label: "Behind Schedule",
      }
    return {
      color: "text-[hsl(var(--alert-error))]",
      bg: "bg-[hsl(var(--alert-error))]",
      label: "Urgent",
    }
  }

  const taskStatus = getTrafficLight(taskProgress)
  const unitStatus = getTrafficLight(unitProgress)
  const timeStatus = getTrafficLight(timeProgress)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tasks Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tasks Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {completedTasks}/{totalTasks}
              </span>
              <span className={cn("text-xs font-medium", taskStatus.color)}>{taskStatus.label}</span>
            </div>
          </div>
          <Progress value={taskProgress} className="h-2" indicatorClassName={taskStatus.bg} />
        </div>

        {/* Units Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Units Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {completedUnits}/{targetUnits}
              </span>
              <span className={cn("text-xs font-medium", unitStatus.color)}>{unitStatus.label}</span>
            </div>
          </div>
          <Progress value={unitProgress} className="h-2" indicatorClassName={unitStatus.bg} />
        </div>

        {/* Time Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Hours Worked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {hoursWorked}/{targetHours}h
              </span>
              <span className={cn("text-xs font-medium", timeStatus.color)}>{timeStatus.label}</span>
            </div>
          </div>
          <Progress value={timeProgress} className="h-2" indicatorClassName={timeStatus.bg} />
        </div>
      </CardContent>
    </Card>
  )
}
