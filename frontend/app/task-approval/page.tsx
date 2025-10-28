"use client"

import { useState } from "react"
import { ClipboardCheck, Check, X, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockWorkSubmissions } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function TaskApprovalPage() {
  const [submissions, setSubmissions] = useState(mockWorkSubmissions)
  const { toast } = useToast()

  const handleApprove = (id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" as const } : s)))
    toast({
      title: "Submission Approved",
      description: "Work submission has been approved successfully.",
    })
  }

  const handleReject = (id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" as const } : s)))
    toast({
      title: "Submission Rejected",
      description: "Work submission has been rejected.",
      variant: "destructive",
    })
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "pending")
  const reviewedSubmissions = submissions.filter((s) => s.status !== "pending")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Task Approval</h2>
        <p className="text-muted-foreground">Review and approve daily work submissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviewedSubmissions.filter((s) => s.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-[#FF4D8D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviewedSubmissions.filter((s) => s.status === "rejected").length}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Pending Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No pending submissions</p>
          ) : (
            pendingSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{submission.technicianName}</h4>
                        <p className="text-sm text-muted-foreground">{submission.date}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>

                    <div className="grid gap-3 text-sm">
                      <div>
                        <span className="font-medium">Tasks Completed:</span>
                        <p className="text-muted-foreground">{submission.tasksCompleted}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Devices:</span>
                          <p className="text-muted-foreground">{submission.devicesCompleted} units</p>
                        </div>
                        <div>
                          <span className="font-medium">Hours:</span>
                          <p className="text-muted-foreground">{submission.hoursWorked}h</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Serial Numbers:</span>
                        <p className="text-muted-foreground">{submission.serialNumbers.join(", ")}</p>
                      </div>
                      <div>
                        <span className="font-medium">Notes:</span>
                        <p className="text-muted-foreground">{submission.notes}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleApprove(submission.id)} className="flex-1">
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button onClick={() => handleReject(submission.id)} variant="destructive" className="flex-1">
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {reviewedSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Reviewed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewedSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <h4 className="font-medium text-sm">{submission.technicianName}</h4>
                  <p className="text-xs text-muted-foreground">{submission.date}</p>
                </div>
                <Badge variant={submission.status === "approved" ? "default" : "destructive"}>
                  {submission.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
