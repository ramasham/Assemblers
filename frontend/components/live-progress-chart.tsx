"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockJobOrders } from "@/lib/mock-data"

export function LiveProgressChart() {
  const activeOrders = mockJobOrders.filter((order) => order.status === "in-progress" || order.status === "delayed")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Job Order Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeOrders.map((order) => {
          const progress = Math.round((order.completed / order.quantity) * 100)
          const isDelayed = order.status === "delayed"

          return (
            <div key={order.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.jobNumber}</span>
                  <span className="text-muted-foreground">- {order.deviceType}</span>
                  {isDelayed && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Delayed</span>}
                </div>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {order.completed} / {order.quantity} units
                </span>
                <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
