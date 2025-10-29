"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockJobOrders } from "@/lib/mock-data"
import { Lightbulb } from "lucide-react"
import Link from "next/link"

export function PlannerJobOrdersOverview() {
  const inProgressOrders = mockJobOrders.filter((order) => order.status === "in-progress")
  const upcomingOrders = mockJobOrders.filter((order) => order.status === "pending")
  const completedOrders = mockJobOrders.filter((order) => order.status === "completed")

  const renderJobCard = (order: (typeof mockJobOrders)[0]) => {
    const progress = Math.round((order.completed / order.quantity) * 100)
    return (
      <Card key={order.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm truncate">{order.jobNumber}</h3>
                <span className="text-xs text-muted-foreground">
                  {order.completed}/{order.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{order.deviceModel}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="in-progress" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="in-progress">In progress</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <Link href="/job-orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            More
            <span>→</span>
          </Link>
        </div>

        <TabsContent value="in-progress" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">{inProgressOrders.slice(0, 4).map(renderJobCard)}</div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">{upcomingOrders.slice(0, 4).map(renderJobCard)}</div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">{completedOrders.slice(0, 4).map(renderJobCard)}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
