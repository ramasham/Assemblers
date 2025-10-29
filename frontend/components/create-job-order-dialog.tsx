"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { JobOrder } from "@/lib/mock-data"

interface CreateJobOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJobOrderCreated?: (jobOrder: JobOrder) => void
}

export function CreateJobOrderDialog({ open, onOpenChange, onJobOrderCreated }: CreateJobOrderDialogProps) {
  const [formData, setFormData] = useState({
    deviceModel: "",
    quantity: "",
    assignedTechnician: "",
    startDate: "",
    dueDate: "",
    priority: "medium",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newJobOrder: JobOrder = {
      id: `jo-${Date.now()}`,
      jobNumber: `JO-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      deviceType: formData.deviceModel,
      serialNumber: `SN-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 9000) + 1000}`,
      quantity: Number.parseInt(formData.quantity),
      completed: 0,
      status: "pending",
      priority: formData.priority as "low" | "medium" | "high",
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTechnician || undefined,
      notes: formData.notes || undefined,
    }

    console.log("[v0] Creating job order:", newJobOrder)

    if (onJobOrderCreated) {
      onJobOrderCreated(newJobOrder)
    }

    onOpenChange(false)

    // Reset form
    setFormData({
      deviceModel: "",
      quantity: "",
      assignedTechnician: "",
      startDate: "",
      dueDate: "",
      priority: "medium",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Order</DialogTitle>
          <DialogDescription>Fill in the details to create a new production job order</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceModel">Device Model *</Label>
              <Input
                id="deviceModel"
                placeholder="e.g., Sensor Module A"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="e.g., 50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTechnician">Assigned Technician</Label>
            <Select
              value={formData.assignedTechnician}
              onValueChange={(value) => setFormData({ ...formData, assignedTechnician: value })}
            >
              <SelectTrigger id="assignedTechnician">
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test-department">Test Department</SelectItem>
                <SelectItem value="quality-department">Quality Department</SelectItem>
                <SelectItem value="production-department">Production Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Job Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
