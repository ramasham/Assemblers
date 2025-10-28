"use client"

import { useState } from "react"
import { FolderKanban, Plus, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AllJobOrders } from "@/components/all-job-orders"
import { mockJobOrders } from "@/lib/mock-data"

export default function JobOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const totalOrders = mockJobOrders.length
  const activeOrders = mockJobOrders.filter((jo) => jo.status === "in-progress").length
  const completedOrders = mockJobOrders.filter((jo) => jo.status === "completed").length
  const delayedOrders = mockJobOrders.filter((jo) => jo.status === "delayed").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Order Management</h2>
          <p className="text-muted-foreground">Track and manage all production job orders</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Job Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All job orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FolderKanban className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <FolderKanban className="h-4 w-4 text-[#FF4D8D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF4D8D]">{delayedOrders}</div>
            <p className="text-xs text-muted-foreground">Behind schedule</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job number, device type, or serial number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <AllJobOrders searchQuery={searchQuery} />
    </div>
  )
}
