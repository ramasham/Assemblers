"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { mockTasks, type Task } from "@/lib/mock-data"
import { Calendar, AlertCircle } from "lucide-react"
import { useState } from "react"

interface TaskListProps {
  assignedTo?: string
}

export function TaskList({ assignedTo }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(
    assignedTo ? mockTasks.filter((task) => task.assignedTo === assignedTo) : mockTasks,
  )

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "in-progress" : "completed" } : task,
      ),
    )
  }

  const getPriorityColor = (priority: Task["priority"]) => {
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
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>Your assigned tasks and priorities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No tasks assigned</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={() => toggleTaskStatus(task.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={`font-medium leading-tight ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </h4>
                  <Badge variant={getPriorityColor(task.priority)} className="shrink-0">
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  {task.status === "in-progress" && (
                    <div className="flex items-center gap-1 text-primary">
                      <AlertCircle className="h-3 w-3" />
                      <span>In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
