"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { JobOrder } from "@/lib/mock-data"
import { Calendar, Hash, Search, User } from "lucide-react"

interface AllJobOrdersProps {
  statusFilter?: "all" | "in-progress" | "completed" | "delayed" | "pending"
  jobOrders: JobOrder[]
}

export function AllJobOrders({ statusFilter = "all", jobOrders }: AllJobOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState(statusFilter)

  useEffect(() => {
    setActiveTab(statusFilter)
  }, [statusFilter])

  const getFilteredOrders = (status: string) => {
    return jobOrders.filter((order) => {
      const matchesSearch =
        order.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = status === "all" || order.status === status

      return matchesSearch && matchesStatus
    })
  }

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

  const renderJobOrders = (orders: JobOrder[]) => {
    if (orders.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-8">No job orders found</p>
    }

    return orders.map((order) => {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Job Orders</CardTitle>
        <CardDescription>Monitor and track all manufacturing orders</CardDescription>
        <div className="pt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job number, device, or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {renderJobOrders(getFilteredOrders("all"))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4 mt-4">
            {renderJobOrders(getFilteredOrders("in-progress"))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {renderJobOrders(getFilteredOrders("completed"))}
          </TabsContent>

          <TabsContent value="delayed" className="space-y-4 mt-4">
            {renderJobOrders(getFilteredOrders("delayed"))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {renderJobOrders(getFilteredOrders("pending"))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
