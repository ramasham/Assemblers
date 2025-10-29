"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockWorkSubmissions } from "@/lib/mock-data"
import { XCircle } from "lucide-react"

interface RejectTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submissionId: string | null
}

export function RejectTaskDialog({ open, onOpenChange, submissionId }: RejectTaskDialogProps) {
  const [feedback, setFeedback] = useState("")

  const submission = submissionId ? mockWorkSubmissions.find((sub) => sub.id === submissionId) : null

  const handleReject = () => {
    console.log("[v0] Rejecting submission:", submissionId, "with feedback:", feedback)
    onOpenChange(false)
    setFeedback("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Reject Task Submission
          </DialogTitle>
          <DialogDescription>
            Provide feedback to help the technician understand what needs to be corrected
          </DialogDescription>
        </DialogHeader>

        {submission && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h3 className="font-semibold">{submission.technicianName}</h3>
              <p className="text-sm text-muted-foreground">{submission.tasksCompleted}</p>
              <p className="text-sm">
                {submission.devicesCompleted} devices • {submission.hoursWorked} hours
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Rejection Reason *</Label>
              <Textarea
                id="feedback"
                placeholder="Explain what needs to be corrected or improved..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This feedback will be sent to the technician and the task will return to their queue
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={!feedback.trim()}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Task
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
