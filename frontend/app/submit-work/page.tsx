"use client"

import { useAuth } from "@/lib/auth-context"
import { WorkSubmissionForm } from "@/components/work-submission-form"
import { SubmissionHistory } from "@/components/submission-history"
import { QuickStatsSummary } from "@/components/quick-stats-summary"

export default function SubmitWorkPage() {
  const { user } = useAuth()

  if (!user) return null

  // Mock weekly stats
  const weeklyStats = {
    weeklyUnits: 45,
    weeklyHours: 40,
    avgProductivity: 4.5,
    weeklyTarget: 50,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Work Submission</h2>
        <p className="text-muted-foreground">Log your daily work and track your progress</p>
      </div>

      <QuickStatsSummary {...weeklyStats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkSubmissionForm />
        <SubmissionHistory />
      </div>
    </div>
  )
}
