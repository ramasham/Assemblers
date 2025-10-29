"use client"

import { useState } from "react"
import { FolderKanban, Plus, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AllJobOrders } from "@/components/all-job-orders"
import { CreateJobOrderDialog } from "@/components/create-job-order-dialog"
import { mockJobOrders } from "@/lib/mock-data"

type StatusFilter = "all" | "in-progress" | "completed" | "delayed" | "pending"

export default function JobOrdersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all")
  const [jobOrders, setJobOrders] = useState(mockJobOrders)

  const totalOrders = jobOrders.length
  const activeOrders = jobOrders.filter((jo) => jo.status === "in-progress").length
  const completedOrders = jobOrders.filter((jo) => jo.status === "completed").length
  const delayedOrders = jobOrders.filter((jo) => jo.status === "delayed").length
  const pendingOrders = jobOrders.filter((jo) => jo.status === "pending").length

  const handleJobOrderCreated = (newJobOrder: any) => {
    setJobOrders([newJobOrder, ...jobOrders])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Order Management</h2>
          <p className="text-muted-foreground">Track and manage all production job orders</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Job Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setActiveStatus("all")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All job orders</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setActiveStatus("in-progress")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setActiveStatus("completed")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FolderKanban className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setActiveStatus("delayed")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <FolderKanban className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{delayedOrders}</div>
            <p className="text-xs text-muted-foreground">Behind schedule</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setActiveStatus("pending")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting start</p>
          </CardContent>
        </Card>
      </div>

      <AllJobOrders statusFilter={activeStatus} jobOrders={jobOrders} />

      <CreateJobOrderDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onJobOrderCreated={handleJobOrderCreated}
      />
    </div>
  )
}
