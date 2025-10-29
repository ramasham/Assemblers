"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockPerformanceMetrics, mockJobOrders, type Department } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface AssignTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
}

export function AssignTaskDialog({ open, onOpenChange, department }: AssignTaskDialogProps) {
  const { toast } = useToast()
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [selectedTechnician, setSelectedTechnician] = useState("")
  const [selectedJobOrder, setSelectedJobOrder] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [dueDate, setDueDate] = useState("")

  const departmentTechnicians = department
    ? mockPerformanceMetrics.filter((metric) => metric.department === department)
    : mockPerformanceMetrics

  const departmentJobOrders = department
    ? mockJobOrders.filter((order) => order.department === department)
    : mockJobOrders

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskTitle || !selectedTechnician || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would make an API call to create the task
    toast({
      title: "Task Assigned Successfully",
      description: `Task "${taskTitle}" has been assigned to ${selectedTechnician}.`,
    })

    // Reset form
    setTaskTitle("")
    setTaskDescription("")
    setSelectedTechnician("")
    setSelectedJobOrder("")
    setPriority("medium")
    setDueDate("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Task to Technician</DialogTitle>
          <DialogDescription>Create and assign a new task to a technician in your department</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title *</Label>
            <Input
              id="task-title"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Task Description</Label>
            <Textarea
              id="task-description"
              placeholder="Enter detailed task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Assign To *</Label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician} required>
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {departmentTechnicians.map((tech) => (
                    <SelectItem key={tech.technicianId} value={tech.technicianName}>
                      {tech.technicianName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-order">Related Job Order (Optional)</Label>
              <Select value={selectedJobOrder} onValueChange={setSelectedJobOrder}>
                <SelectTrigger id="job-order">
                  <SelectValue placeholder="Select job order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departmentJobOrders.map((order) => (
                    <SelectItem key={order.id} value={order.jobNumber}>
                      {order.jobNumber} - {order.deviceType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)} required>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date *</Label>
              <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Assign Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
