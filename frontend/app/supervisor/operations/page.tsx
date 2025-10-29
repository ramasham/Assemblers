"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth, type Department } from "@/lib/auth-context"
import { mockJobOrders, mockPerformanceMetrics } from "@/lib/mock-data"
import { Search, Plus, Calendar, User, AlertCircle } from "lucide-react"
import { AssignOperationDialog } from "@/components/assign-operation-dialog"
import { cn } from "@/lib/utils"

export default function OperationsManagementPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [technicianFilter, setTechnicianFilter] = useState<string>("all")
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const getDepartmentFromRole = (role: string | null): Department | null => {
    if (role === "production-supervisor") return "production"
    if (role === "test-supervisor") return "test"
    if (role === "quality-supervisor") return "quality"
    return null
  }

  const department = getDepartmentFromRole(user?.currentRole || null)

  const departmentJobOrders = department
    ? mockJobOrders.filter((order) => order.department === department)
    : mockJobOrders

  const departmentTechnicians = department
    ? mockPerformanceMetrics.filter((metric) => metric.department === department)
    : mockPerformanceMetrics

  const filteredOrders = departmentJobOrders.filter((order) => {
    const matchesSearch =
      order.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deviceType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesTechnician = technicianFilter === "all" || order.assignedTo === technicianFilter
    return matchesSearch && matchesStatus && matchesTechnician
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-500"
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "delayed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")
  }

  const handleAssignOperation = (orderId: string) => {
    setSelectedOperation(orderId)
    setIsAssignDialogOpen(true)
  }

  const getDepartmentLabel = (dept: Department | null) => {
    if (!dept) return "All Departments"
    return dept.charAt(0).toUpperCase() + dept.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Operations Management</h1>
          <p className="text-muted-foreground">
            {getDepartmentLabel(department)} Department - Manage all operations assigned to this department
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {getDepartmentLabel(department)} Department
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Operations</CardTitle>
          <CardDescription>Search and filter operations by status, technician, or due date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by job number or device type..."
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
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {departmentTechnicians.map((tech) => (
                  <SelectItem key={tech.technicianId} value={tech.technicianName}>
                    {tech.technicianName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Operations List</CardTitle>
              <CardDescription>
                {filteredOrders.length} operation{filteredOrders.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="rounded-lg border">
                <div className={cn("h-2 rounded-t-lg", getStatusColor(order.status))} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{order.jobNumber}</h3>
                        <Badge variant="outline" className={cn("text-white", getStatusColor(order.status))}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        {order.priority === "high" && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            High Priority
                          </Badge>
                        )}
                      </div>

                      <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-muted-foreground">Device Type</p>
                          <p className="font-medium">{order.deviceType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Serial Number</p>
                          <p className="font-medium">{order.serialNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">
                            {order.completed} / {order.quantity} units
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {order.assignedTo && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Assigned to:</span>
                          <span className="font-medium">{order.assignedTo}</span>
                        </div>
                      )}

                      {order.notes && (
                        <div className="rounded-md bg-muted p-3 text-sm">
                          <p className="text-muted-foreground">Notes:</p>
                          <p>{order.notes}</p>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        Progress: {Math.round((order.completed / order.quantity) * 100)}%
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => handleAssignOperation(order.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {order.assignedTo ? "Reassign" : "Assign"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No operations found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AssignOperationDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        operationId={selectedOperation}
        department={department}
      />
    </div>
  )
}
