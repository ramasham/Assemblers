"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockWorkSubmissions } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function SubmissionHistoryPage() {
  const { user } = useAuth()
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof mockWorkSubmissions)[0] | null>(null)

  // Filter submissions for current user (in real app, filter by user.id)
  const userSubmissions = mockWorkSubmissions.filter((s) => s.technicianName === "Mike Davis")

  const pendingSubmissions = userSubmissions.filter((s) => s.status === "pending")
  const approvedSubmissions = userSubmissions.filter((s) => s.status === "approved")
  const rejectedSubmissions = userSubmissions.filter((s) => s.status === "rejected")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const SubmissionCard = ({ submission }: { submission: (typeof mockWorkSubmissions)[0] }) => (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{submission.tasksCompleted}</h4>
              <p className="text-sm text-muted-foreground">{new Date(submission.date).toLocaleDateString()}</p>
            </div>
            {getStatusBadge(submission.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Devices:</span>
              <p className="font-medium">{submission.devicesCompleted} units</p>
            </div>
            <div>
              <span className="text-muted-foreground">Hours:</span>
              <p className="font-medium">{submission.hoursWorked}h</p>
            </div>
          </div>

          {submission.reviewReason && (
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => setSelectedSubmission(submission)}
            >
              <Info className="h-4 w-4 mr-2" />
              View {submission.status === "approved" ? "Feedback" : "Reason"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Submission History</h2>
        <p className="text-muted-foreground">View your work submission status and feedback</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {userSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No submissions yet</p>
          ) : (
            userSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No pending submissions</p>
          ) : (
            pendingSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No approved submissions</p>
          ) : (
            approvedSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No rejected submissions</p>
          ) : (
            rejectedSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.status === "approved" ? "Supervisor Feedback" : "Rejection Reason"}
            </DialogTitle>
            <DialogDescription>
              Reviewed by {selectedSubmission?.reviewedBy} on{" "}
              {selectedSubmission?.reviewedAt && new Date(selectedSubmission.reviewedAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">{selectedSubmission?.reviewReason}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
