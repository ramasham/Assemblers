"use client"

import { useAuth } from "@/lib/auth-context"
import { DailyTaskForm } from "@/components/daily-task-form"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function SubmitWorkPage() {
  const { user } = useAuth()

  if (!user) return null

  const currentDate = new Date()
  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" })
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{dayName}</h2>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Daily Task Submission</h2>
        <p className="text-muted-foreground">Log your assembly operations for today</p>
      </div>

      <DailyTaskForm />
    </div>
  )
}
