"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PRODUCTION_OPERATIONS, QUALITY_OPERATIONS, TESTER_OPERATIONS } from "@/lib/mock-data"

interface Operation {
  id: string
  operation: string
  serialNumber: string
  startTime: string
  endTime: string
}

export function DailyTaskForm() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [additionalNotes, setAdditionalNotes] = useState("")

  const [operations, setOperations] = useState<Operation[]>([
    {
      id: "1",
      operation: "",
      serialNumber: "",
      startTime: "",
      endTime: "",
    },
  ])

  const getOperationsList = () => {
    switch (user?.currentRole) {
      case "production-worker":
        return PRODUCTION_OPERATIONS
      case "quality":
        return QUALITY_OPERATIONS
      case "tester":
        return TESTER_OPERATIONS
      default:
        return []
    }
  }

  const operationsList = getOperationsList()

  const addOperation = () => {
    setOperations([
      ...operations,
      {
        id: Date.now().toString(),
        operation: "",
        serialNumber: "",
        startTime: "",
        endTime: "",
      },
    ])
  }

  const removeOperation = (id: string) => {
    if (operations.length > 1) {
      setOperations(operations.filter((op) => op.id !== id))
    }
  }

  const updateOperation = (id: string, field: keyof Operation, value: string) => {
    setOperations(operations.map((op) => (op.id === id ? { ...op, [field]: value } : op)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const isValid = operations.every((op) => op.operation && op.serialNumber && op.startTime && op.endTime)

    if (!isValid) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields for each operation.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)

    toast({
      title: "Tasks Submitted Successfully",
      description: "Your daily tasks have been sent to the supervisor for review.",
    })

    setIsSubmitting(false)
  }

  const resetForm = () => {
    setOperations([
      {
        id: Date.now().toString(),
        operation: "",
        serialNumber: "",
        startTime: "",
        endTime: "",
      },
    ])
    setAdditionalNotes("")
    setIsSubmitted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operations Log</CardTitle>
        <CardDescription>Record each assembly operation with start/end times and serial numbers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Operation</TableHead>
                  <TableHead className="w-1/4">Serial Number</TableHead>
                  <TableHead className="w-1/5">Start Time</TableHead>
                  <TableHead className="w-1/5">End Time</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((operation, index) => (
                  <TableRow key={operation.id}>
                    <TableCell className="p-2">
                      <Select
                        value={operation.operation}
                        onValueChange={(value) => updateOperation(operation.id, "operation", value)}
                        disabled={isSubmitted}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          {operationsList.map((op) => (
                            <SelectItem key={op} value={op}>
                              {op}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="e.g., SN-12345"
                        value={operation.serialNumber}
                        onChange={(e) => updateOperation(operation.id, "serialNumber", e.target.value)}
                        disabled={isSubmitted}
                        required
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="time"
                        value={operation.startTime}
                        onChange={(e) => updateOperation(operation.id, "startTime", e.target.value)}
                        disabled={isSubmitted}
                        required
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="time"
                        value={operation.endTime}
                        onChange={(e) => updateOperation(operation.id, "endTime", e.target.value)}
                        disabled={isSubmitted}
                        required
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      {!isSubmitted && operations.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOperation(operation.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!isSubmitted && (
            <Button type="button" variant="outline" onClick={addOperation} className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Operation
            </Button>
          )}

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Other tasks not directly assigned to your role or any additional comments..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              disabled={isSubmitted}
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            {!isSubmitted ? (
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit to Supervisor
                  </>
                )}
              </Button>
            ) : (
              <Button type="button" onClick={resetForm} className="flex-1">
                Submit New Tasks
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
