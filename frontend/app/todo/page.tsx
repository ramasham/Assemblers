"use client"

import { useState } from "react"
import { CheckSquare, Square, Plus, Calendar, Flag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { mockTodoItems, type TodoItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export default function TodoPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState(mockTodoItems.filter((item) => item.assignedTo === user?.name))

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, status: todo.status === "completed" ? "pending" : "completed" } : todo,
      ),
    )
  }

  const getPriorityColor = (priority: TodoItem["priority"]) => {
    switch (priority) {
      case "high":
        return "text-[#FF4D8D]"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
    }
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return { text: "Due Today", urgent: true }
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { text: "Due Tomorrow", urgent: true }
    } else if (date < today) {
      return { text: "Overdue", urgent: true }
    } else {
      return { text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), urgent: false }
    }
  }

  const pendingTodos = todos.filter((t) => t.status !== "completed")
  const completedTodos = todos.filter((t) => t.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">To-do List</h2>
          <p className="text-muted-foreground">
            {pendingTodos.length} pending, {completedTodos.length} completed
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTodos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending tasks</p>
            ) : (
              pendingTodos.map((todo) => {
                const dueDate = formatDueDate(todo.dueDate)
                return (
                  <div
                    key={todo.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox checked={false} onCheckedChange={() => toggleTodo(todo.id)} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{todo.title}</h4>
                        <Flag className={cn("h-3 w-3", getPriorityColor(todo.priority))} />
                      </div>
                      <p className="text-xs text-muted-foreground">{todo.description}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span className={cn(dueDate.urgent && "text-[#FF4D8D] font-medium")}>{dueDate.text}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTodos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No completed tasks yet</p>
            ) : (
              completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors opacity-60"
                >
                  <Checkbox checked={true} onCheckedChange={() => toggleTodo(todo.id)} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm line-through">{todo.title}</h4>
                    <p className="text-xs text-muted-foreground line-through">{todo.description}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
