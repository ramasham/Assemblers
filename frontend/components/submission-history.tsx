"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Package, AlertCircle } from "lucide-react"

interface WorkSubmission {
  id: string
  date: string
  jobOrder: string
  unitsCompleted: number
  hoursWorked: number
  delayReason?: string
  notes?: string
}

const mockSubmissions: WorkSubmission[] = [
  {
    id: "1",
    date: "2025-01-27",
    jobOrder: "JO-2025-001",
    unitsCompleted: 15,
    hoursWorked: 8,
    notes: "Completed assembly without issues",
  },
  {
    id: "2",
    date: "2025-01-26",
    jobOrder: "JO-2025-001",
    unitsCompleted: 12,
    hoursWorked: 8,
    delayReason: "materials",
    notes: "Delayed due to component shortage in the morning",
  },
  {
    id: "3",
    date: "2025-01-25",
    jobOrder: "JO-2025-002",
    unitsCompleted: 18,
    hoursWorked: 8,
    notes: "Exceeded daily target",
  },
]

export function SubmissionHistory() {
  const getDelayLabel = (reason?: string) => {
    if (!reason) return null
    const labels: Record<string, string> = {
      materials: "Materials Delay",
      equipment: "Equipment Issues",
      quality: "Quality Issues",
      technical: "Technical Problems",
      other: "Other Delay",
    }
    return labels[reason] || reason
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission History</CardTitle>
        <CardDescription>Your recent work log submissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockSubmissions.map((submission) => (
          <div key={submission.id} className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">{submission.jobOrder}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(submission.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{submission.hoursWorked} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span>{submission.unitsCompleted} units</span>
                  </div>
                </div>
              </div>
              {submission.delayReason && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getDelayLabel(submission.delayReason)}
                </Badge>
              )}
            </div>
            {submission.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{submission.notes}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
