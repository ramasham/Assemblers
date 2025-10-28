"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockJobOrders, type JobOrder } from "@/lib/mock-data"
import { Calendar, Hash, Search, User } from "lucide-react"

interface AllJobOrdersProps {
  searchQuery?: string
}

export function AllJobOrders({ searchQuery = "" }: AllJobOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const effectiveSearch = searchQuery || searchTerm

  const filteredOrders = mockJobOrders.filter((order) => {
    const matchesSearch =
      order.jobNumber.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      order.deviceType.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      order.serialNumber.toLowerCase().includes(effectiveSearch.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: JobOrder["status"]) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "in-progress":
        return "default"
      case "delayed":
        return "destructive"
      case "pending":
        return "outline"
    }
  }

  const getPriorityColor = (priority: JobOrder["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Job Orders</CardTitle>
        <CardDescription>Monitor and track all manufacturing orders</CardDescription>
        {!searchQuery && (
          <div className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job number, device, or serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
          </div>
        )}
        {searchQuery && (
          <div className="pt-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No job orders found</p>
        ) : (
          filteredOrders.map((order) => {
            const progress = (order.completed / order.quantity) * 100
            return (
              <div key={order.id} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{order.jobNumber}</h4>
                      <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.deviceType}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {order.completed} / {order.quantity} units ({Math.round(progress)}%)
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    <span>{order.serialNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                  </div>
                  {order.assignedTo && (
                    <div className="flex items-center gap-1 col-span-2">
                      <User className="h-3 w-3" />
                      <span>Assigned to: {order.assignedTo}</span>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Note:</span> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
