"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { mockPerformanceMetrics, mockJobOrders } from "@/lib/mock-data"
import type { Department } from "@/lib/auth-context"
import { Calendar, User, Package, Clock } from "lucide-react"

interface AssignOperationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  operationId: string | null
  department: Department | null
}

export function AssignOperationDialog({ open, onOpenChange, operationId, department }: AssignOperationDialogProps) {
  const [selectedTechnician, setSelectedTechnician] = useState("")
  const [quantity, setQuantity] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  const operation = operationId ? mockJobOrders.find((order) => order.id === operationId) : null

  const departmentTechnicians = department
    ? mockPerformanceMetrics.filter((metric) => metric.department === department)
    : mockPerformanceMetrics

  const handleAssign = () => {
    console.log("[v0] Assigning operation:", {
      operationId,
      technician: selectedTechnician,
      quantity,
      dueDate,
      notes,
    })
    onOpenChange(false)
    setSelectedTechnician("")
    setQuantity("")
    setDueDate("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Operation to Technician</DialogTitle>
          <DialogDescription>
            Select a technician and specify the details for this operation assignment
          </DialogDescription>
        </DialogHeader>

        {operation && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h3 className="font-semibold">{operation.jobNumber}</h3>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Device:</span>
                  <span className="font-medium">{operation.deviceType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due:</span>
                  <span className="font-medium">{new Date(operation.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="technician">
                  <User className="inline h-4 w-4 mr-1" />
                  Technician Name
                </Label>
                <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                  <SelectTrigger id="technician">
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentTechnicians.map((tech) => (
                      <SelectItem key={tech.technicianId} value={tech.technicianName}>
                        <div className="flex items-center justify-between w-full">
                          <span>{tech.technicianName}</span>
                          <span className="text-xs text-muted-foreground ml-4">Efficiency: {tech.efficiency}%</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  <Package className="inline h-4 w-4 mr-1" />
                  Quantity / Devices
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter number of devices"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  max={operation.quantity - operation.completed}
                />
                <p className="text-xs text-muted-foreground">
                  Available: {operation.quantity - operation.completed} units
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  max={operation.dueDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Optional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes for the technician..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign} disabled={!selectedTechnician || !quantity || !dueDate}>
                Assign Operation
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
