"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { mockWorkSubmissions } from "@/lib/mock-data"
import { User, Calendar, Clock, Package, FileText, MessageSquare } from "lucide-react"

interface TaskDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submissionId: string | null
}

export function TaskDetailsSheet({ open, onOpenChange, submissionId }: TaskDetailsSheetProps) {
  const submission = submissionId ? mockWorkSubmissions.find((sub) => sub.id === submissionId) : null

  if (!submission) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div>{submission.technicianName}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {new Date(submission.date).toLocaleDateString()}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>Complete information about this task submission</DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Operation Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Technician</p>
                  <p className="font-semibold">{submission.technicianName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Submission Date</p>
                  <p className="font-semibold">{new Date(submission.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Minutes Worked</p>
                  <p className="font-semibold">{submission.minutesWorked} mins</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Devices Completed</p>
                  <p className="font-semibold">{submission.devicesCompleted} units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tasks Completed</h3>
            <p className="text-sm">{submission.tasksCompleted}</p>
          </div>

          {/* Serial Numbers */}
          {submission.serialNumbers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Serial Numbers</h3>
              <div className="flex flex-wrap gap-2">
                {submission.serialNumbers.map((sn) => (
                  <Badge key={sn} variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {sn}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Technician Notes */}
          {submission.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Technician Notes
              </h3>
              <p className="text-sm text-muted-foreground">{submission.notes}</p>
            </div>
          )}

          {submission.reviewReason && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Supervisor Feedback
              </h3>
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-4">
                <p className="text-sm">{submission.reviewReason}</p>
                {submission.reviewedBy && (
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-yellow-500/20">
                    Reviewed by {submission.reviewedBy} on {new Date(submission.reviewedAt!).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
