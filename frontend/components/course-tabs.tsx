"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchJobOrders, type JobOrder } from "@/lib/api"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface CourseTabsProps {
  userName: string
  userId: string
}

export function CourseTabs({ userName, userId }: CourseTabsProps) {
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([])
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJobOrders() {
      setLoading(true)
      const orders = await fetchJobOrders()
      setJobOrders(orders)
      setLoading(false)
    }
    loadJobOrders()
  }, [])

  const userOrders = jobOrders.filter((order) => 
    order.assignedTechnicians?.includes(userId) || 
    order.assignedTechnicians?.includes(userName)
  )
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
          order.id === orderId 
            ? { ...order, status: "in-progress" as const, assignedTechnicians: [...(order.assignedTechnicians || []), userId] } 
            : order,
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

  const getIconEmoji = (productName: string) => {
    if (productName.includes('Night Vision')) return '�'
    if (productName.includes('Thermal')) return '�️'
    if (productName.includes('Scope')) return '�'
    if (productName.includes('LED')) return '�'
    if (productName.includes('Circuit')) return '⚡'
    if (productName.includes('Battery')) return '🔋'
    if (productName.includes('Power')) return '⚙️'
    if (productName.includes('Motor')) return '🔧'
    return '📦'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
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

  const renderJobCard = (order: JobOrder, index: number, isNewTask = false) => {
    const dueDate = new Date(order.dueDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })

    const progress = order.totalQuantity > 0 
      ? Math.round((order.completedQuantity / order.totalQuantity) * 100) 
      : 0

    return (
      <div key={order.id} className="p-5 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all">
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
              {getIconEmoji(order.productName)}
            </div>
            <Badge variant="outline" className={getPriorityColor(order.priority)}>
              {order.priority}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-base text-foreground mb-1">{order.productName}</h3>
            <p className="text-sm text-muted-foreground font-mono">{order.jobOrderNumber}</p>
            <p className="text-sm text-muted-foreground mt-1">Quantity: {order.totalQuantity} units</p>
            {order.notes && <p className="text-xs text-muted-foreground mt-1 italic">{order.notes}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground uppercase tracking-wide">DEADLINE</span>
              <span className="text-foreground font-medium">{dueDate}</span>
            </div>
            {!isNewTask && order.totalQuantity > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="in-progress" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
        <TabsTrigger value="in-progress" className="rounded-md data-[state=active]:bg-background">
          In Progress ({inProgress.length})
        </TabsTrigger>
        <TabsTrigger value="new" className="rounded-md data-[state=active]:bg-background">
          New Tasks ({allNewTasks.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="rounded-md data-[state=active]:bg-background">
          Completed ({completed.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="in-progress" className="mt-6">
        {inProgress.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks in progress</p>
            <p className="text-sm text-muted-foreground mt-2">Select tasks from "New Tasks" tab to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((order, index) => renderJobCard(order, index))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="new" className="mt-6">
        {allNewTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No new tasks available</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allNewTasks.map((order, index) => renderJobCard(order, index, true))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        {completed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No completed tasks yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((order, index) => renderJobCard(order, index))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

