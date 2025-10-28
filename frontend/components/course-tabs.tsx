"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { mockJobOrders } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"

interface CourseTabsProps {
  userName: string
}

export function CourseTabs({ userName }: CourseTabsProps) {
  const userOrders = mockJobOrders.filter((order) => order.assignedTo === userName)
  const inProgress = userOrders.filter((order) => order.status === "in-progress")
  const upcoming = userOrders.filter((order) => order.status === "pending")
  const completed = userOrders.filter((order) => order.status === "completed")

  const getIconColor = (index: number) => {
    const colors = [
      "bg-yellow-400/20 text-yellow-400",
      "bg-blue-400/20 text-blue-400",
      "bg-pink-400/20 text-pink-400",
      "bg-emerald-400/20 text-emerald-400",
    ]
    return colors[index % colors.length]
  }

  const getProgressColor = (index: number) => {
    const colors = ["bg-teal-500", "bg-teal-500", "bg-teal-500", "bg-teal-500"]
    return colors[index % colors.length]
  }

  const getIconEmoji = (index: number) => {
    const emojis = ["💡", "🎨", "🎬", "📚"]
    return emojis[index % emojis.length]
  }

  const renderJobCard = (order: (typeof mockJobOrders)[0], index: number) => {
    const progress = (order.completed / order.quantity) * 100

    const startDate = new Date(order.startDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })
    const dueDate = new Date(order.dueDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })

    return (
      <div key={order.id} className="p-5 rounded-xl bg-white border border-border/50 hover:shadow-md transition-all">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className={`w-14 h-14 rounded-full ${getIconColor(index)} flex items-center justify-center text-2xl`}>
              {getIconEmoji(index)}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {order.completed}/{order.quantity}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-base mb-2">{order.deviceType}</h3>
            <Progress value={progress} className={`h-1.5 ${getProgressColor(index)}`} />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{startDate}</span>
            <span>{dueDate}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="in-progress" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger
              value="in-progress"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold"
            >
              In progress
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium">
            More <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <TabsContent value="in-progress" className="mt-0">
          {inProgress.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No jobs in progress</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgress.map((order, index) => renderJobCard(order, index))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming jobs</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((order, index) => renderJobCard(order, index))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {completed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No completed jobs</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completed.map((order, index) => renderJobCard(order, index))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
