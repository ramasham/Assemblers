"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTasks, type Task } from "@/lib/mock-data"
import { Clock, AlertCircle } from "lucide-react"

interface TodayTasksListProps {
  userName: string
}

export function TodayTasksList({ userName }: TodayTasksListProps) {
  // Get today's date
  const today = new Date().toISOString().split("T")[0]

  // Filter tasks for today that are assigned to the user
  const todayTasks = mockTasks.filter((task) => task.assignedTo === userName && task.dueDate === today)

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-[hsl(var(--alert-error))] text-white"
      case "medium":
        return "bg-[hsl(var(--alert-warning))] text-white"
      case "low":
        return "bg-[hsl(var(--alert-info))] text-white"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "text-[hsl(var(--alert-success))]"
      case "in-progress":
        return "text-[hsl(var(--alert-info))]"
      case "pending":
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
        <CardDescription>Tasks scheduled for today</CardDescription>
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium leading-tight">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-medium ${getStatusColor(task.status)}`}>
                      <AlertCircle className="h-3 w-3" />
                      <span className="capitalize">{task.status.replace("-", " ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
