"use client"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockJobOrders } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function TechnicianTasksPage() {
  const { user } = useAuth()
  const [jobOrders, setJobOrders] = useState(mockJobOrders)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())

  if (!user) return null

  const userOrders = jobOrders.filter((order) => order.assignedTo === user.name)
  const inProgress = userOrders.filter((order) => order.status === "in-progress")
  const allNewTasks = jobOrders.filter((order) => order.status === "pending")
  const completed = userOrders.filter((order) => order.status === "completed")

  const handleTaskSelection = (orderId: string, checked: boolean) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(orderId)
      } else {
        newSet.delete(orderId)
      }
      return newSet
    })

    if (checked) {
      setJobOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "in-progress" as const, assignedTo: user.name } : order,
        ),
      )
    }
  }

  const getIconColor = (index: number) => {
    const colors = [
      "bg-yellow-400/20 text-yellow-400",
      "bg-blue-400/20 text-blue-400",
      "bg-pink-400/20 text-pink-400",
      "bg-emerald-400/20 text-emerald-400",
      "bg-purple-400/20 text-purple-400",
      "bg-orange-400/20 text-orange-400",
    ]
    return colors[index % colors.length]
  }

  const getIconEmoji = (index: number) => {
    const emojis = ["💡", "🎨", "🎬", "📚", "🔧", "⚡"]
    return emojis[index % emojis.length]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const renderJobCard = (order: (typeof mockJobOrders)[0], index: number, isNewTask = false) => {
    const dueDate = new Date(order.dueDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })

    return (
      <Card key={order.id} className="p-5 hover:shadow-lg transition-all">
        <div className="space-y-4">
          {isNewTask && (
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <Checkbox
                id={`task-${order.id}`}
                checked={selectedTasks.has(order.id)}
                onCheckedChange={(checked) => handleTaskSelection(order.id, checked as boolean)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor={`task-${order.id}`} className="text-sm font-medium text-foreground cursor-pointer flex-1">
                Select this task
              </label>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className={`w-14 h-14 rounded-full ${getIconColor(index)} flex items-center justify-center text-2xl`}>
              {getIconEmoji(index)}
            </div>
            <Badge variant="outline" className={getPriorityColor(order.priority)}>
              {order.priority}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-base mb-1">{order.deviceType}</h3>
            <p className="text-xs text-muted-foreground">Job #{order.jobNumber}</p>
            {isNewTask && <p className="text-xs text-muted-foreground mt-1">Quantity: {order.quantity} units</p>}
            {order.notes && <p className="text-xs text-muted-foreground mt-2 italic">{order.notes}</p>}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wide">Deadline</span>
            <span className="font-medium">{dueDate}</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-muted-foreground">View all your assigned job orders</p>
        </div>
      </div>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="in-progress" className="font-semibold">
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="new-tasks">New Tasks ({allNewTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="mt-6">
          {inProgress.length === 0 ? (
            <Card className="p-12">
              <p className="text-center text-muted-foreground">No jobs in progress</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgress.map((order, index) => renderJobCard(order, index, false))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new-tasks" className="mt-6">
          {allNewTasks.length === 0 ? (
            <Card className="p-12">
              <p className="text-center text-muted-foreground">No new tasks available</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allNewTasks.map((order, index) => renderJobCard(order, index, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <Card className="p-12">
              <p className="text-center text-muted-foreground">No completed jobs</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map((order, index) => renderJobCard(order, index, false))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
