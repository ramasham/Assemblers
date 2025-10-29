"use client"

import { useState } from "react"
import { ClipboardCheck, Check, X, Clock, Search, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockWorkSubmissions } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth, type Department } from "@/lib/auth-context"
import { RejectTaskDialog } from "@/components/reject-task-dialog"
import { TaskDetailsSheet } from "@/components/task-details-sheet"

export default function TaskReviewPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState(mockWorkSubmissions)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const { toast } = useToast()

  const getDepartmentFromRole = (role: string | null): Department | null => {
    if (role === "production-supervisor") return "production"
    if (role === "test-supervisor") return "test"
    if (role === "quality-supervisor") return "quality"
    return null
  }

  const department = getDepartmentFromRole(user?.currentRole || null)

  const departmentSubmissions = department ? submissions.filter((s) => s.department === department) : submissions

  const filteredSubmissions = departmentSubmissions.filter((submission) => {
    const matchesSearch =
      submission.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.tasksCompleted.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "approved" as const,
              reviewedBy: user?.name || "Supervisor",
              reviewedAt: new Date().toISOString(),
            }
          : s,
      ),
    )

    toast({
      title: "Submission Approved",
      description: "Work submission has been approved successfully.",
    })
  }

  const handleReject = (id: string, reason: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "rejected" as const,
              reviewReason: reason,
              reviewedBy: user?.name || "Supervisor",
              reviewedAt: new Date().toISOString(),
            }
          : s,
      ),
    )

    toast({
      title: "Submission Rejected",
      description: "Work submission has been rejected with feedback.",
      variant: "destructive",
    })
  }

  const handleRejectClick = (id: string) => {
    setSelectedSubmission(id)
    setIsRejectDialogOpen(true)
  }

  const handleViewDetails = (id: string) => {
    setSelectedSubmission(id)
    setIsDetailsSheetOpen(true)
  }

  const pendingCount = departmentSubmissions.filter((s) => s.status === "pending").length
  const approvedCount = departmentSubmissions.filter((s) => s.status === "approved").length
  const rejectedCount = departmentSubmissions.filter((s) => s.status === "rejected").length

  const getDepartmentLabel = (dept: Department | null) => {
    if (!dept) return "All Departments"
    return dept.charAt(0).toUpperCase() + dept.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Review</h1>
          <p className="text-muted-foreground">
            {getDepartmentLabel(department)} Department - Approve, reject, or give feedback on completed operations
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {getDepartmentLabel(department)} Department
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Needs correction</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
          <CardDescription>Search by technician name or filter by approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by technician name or task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Submitted Tasks
          </CardTitle>
          <CardDescription>
            {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No submissions found</p>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{submission.technicianName}</h4>
                        <p className="text-sm text-muted-foreground">{submission.date}</p>
                      </div>
                      <Badge
                        variant={
                          submission.status === "approved"
                            ? "default"
                            : submission.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>

                    <p className="text-sm">{submission.tasksCompleted}</p>

                    <p className="text-sm text-muted-foreground">
                      {submission.devicesCompleted} devices completed • {submission.minutesWorked} mins worked
                    </p>

                    <p className="text-sm text-muted-foreground italic">Note: {submission.notes}</p>

                    {submission.reviewReason && (
                      <div className="rounded-md bg-muted p-3">
                        <span className="font-medium text-sm">Review Feedback:</span>
                        <p className="text-sm text-muted-foreground mt-1">{submission.reviewReason}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {submission.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleApprove(submission.id)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectClick(submission.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => handleViewDetails(submission.id)}
                        variant="outline"
                        size="sm"
                        className={submission.status === "pending" ? "flex-1" : "w-full"}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <RejectTaskDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onReject={(reason) => {
          if (selectedSubmission) {
            handleReject(selectedSubmission, reason)
          }
        }}
      />

      <TaskDetailsSheet
        open={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        submissionId={selectedSubmission}
      />
    </div>
  )
}
