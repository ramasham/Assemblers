"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCalendarEvents } from "@/lib/mock-data"
import { Calendar } from "lucide-react"

export function UpcomingSchedule() {
  const upcomingEvents = mockCalendarEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const getEventColor = (type: string) => {
    switch (type) {
      case "holiday":
        return "bg-[hsl(var(--alert-success))] text-white"
      case "meeting":
        return "bg-primary text-primary-foreground"
      case "deadline":
        return "bg-[hsl(var(--alert-error))] text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Schedule</CardTitle>
        <CardDescription>Next events and deadlines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
        ) : (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <Badge className={getEventColor(event.type)} variant="secondary">
                    {event.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <p className="text-xs text-primary font-medium">{formatDate(event.date)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
