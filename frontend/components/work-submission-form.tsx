"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { mockJobOrders } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock } from "lucide-react"

export function WorkSubmissionForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    jobOrderId: "",
    unitsCompleted: "",
    hoursWorked: "",
    delayReason: "",
    notes: "",
    issuesEncountered: "",
  })

  const userJobOrders = mockJobOrders.filter((order) => order.assignedTo === user?.name && order.status !== "completed")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Work Submitted Successfully",
      description: `Your work log for ${formData.unitsCompleted} units has been recorded.`,
    })

    // Reset form
    setFormData({
      jobOrderId: "",
      unitsCompleted: "",
      hoursWorked: "",
      delayReason: "",
      notes: "",
      issuesEncountered: "",
    })

    setIsSubmitting(false)
  }

  const selectedOrder = mockJobOrders.find((order) => order.id === formData.jobOrderId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Work Log</CardTitle>
        <CardDescription>Record your completed work and any issues encountered</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobOrder">Job Order *</Label>
            <Select
              value={formData.jobOrderId}
              onValueChange={(value) => setFormData({ ...formData, jobOrderId: value })}
            >
              <SelectTrigger id="jobOrder">
                <SelectValue placeholder="Select a job order" />
              </SelectTrigger>
              <SelectContent>
                {userJobOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.jobNumber} - {order.deviceType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedOrder && (
              <p className="text-xs text-muted-foreground">
                Progress: {selectedOrder.completed}/{selectedOrder.quantity} units completed
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unitsCompleted">Units Completed Today *</Label>
              <Input
                id="unitsCompleted"
                type="number"
                min="0"
                placeholder="0"
                value={formData.unitsCompleted}
                onChange={(e) => setFormData({ ...formData, unitsCompleted: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked *</Label>
              <Input
                id="hoursWorked"
                type="number"
                min="0"
                step="0.5"
                placeholder="8.0"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delayReason">Delay Reason (if applicable)</Label>
            <Select
              value={formData.delayReason}
              onValueChange={(value) => setFormData({ ...formData, delayReason: value })}
            >
              <SelectTrigger id="delayReason">
                <SelectValue placeholder="Select if there was a delay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Delay</SelectItem>
                <SelectItem value="materials">Waiting for Materials</SelectItem>
                <SelectItem value="equipment">Equipment Issues</SelectItem>
                <SelectItem value="quality">Quality Issues</SelectItem>
                <SelectItem value="technical">Technical Problems</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuesEncountered">Issues Encountered</Label>
            <Textarea
              id="issuesEncountered"
              placeholder="Describe any problems or challenges faced during production..."
              value={formData.issuesEncountered}
              onChange={(e) => setFormData({ ...formData, issuesEncountered: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information or observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !formData.jobOrderId || !formData.unitsCompleted || !formData.hoursWorked}
          >
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Work Log
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
