"use client"

import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCalendarEvents, type CalendarEvent } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function UpcomingEvents() {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcomingEvents = mockCalendarEvents
    .filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= nextWeek
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "holiday":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20"
      case "meeting":
        return "bg-[hsl(var(--alert-info))]/10 text-[hsl(var(--alert-info))] border-[hsl(var(--alert-info))]/20"
      case "deadline":
        return "bg-[hsl(var(--alert-error))]/10 text-[hsl(var(--alert-error))] border-[hsl(var(--alert-error))]/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20"
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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="secondary" className={cn("text-xs border", getEventColor(event.type))}>
                      {event.type}
                    </Badge>
                  </div>
                  {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(event.date)}
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
