"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCalendarEvents, type CalendarEvent } from "@/lib/mock-data"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "year">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "holiday":
        return "bg-gray-500 text-white"
      case "meeting":
        return "bg-blue-500 text-white"
      case "deadline":
        return "bg-[#FF4D8D] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return mockCalendarEvents.filter((event) => event.date === dateString)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateYear = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setFullYear(newDate.getFullYear() - 1)
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">View holidays, meetings, and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(value: any) => setView(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="year">Year View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === "month" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentDate).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="p-2" />
                  }

                  const events = getEventsForDate(date)
                  const isSelected =
                    selectedDate &&
                    date.getDate() === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear()

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "p-2 rounded-lg text-sm transition-colors min-h-[60px] flex flex-col items-start",
                        "hover:bg-accent",
                        isToday(date) && "bg-primary/10 font-bold border-2 border-primary",
                        isSelected && "bg-accent",
                      )}
                    >
                      <span className={cn("mb-1", isToday(date) && "text-primary")}>{date.getDate()}</span>
                      <div className="flex flex-wrap gap-1">
                        {events.slice(0, 2).map((event) => (
                          <div key={event.id} className={cn("h-1.5 w-1.5 rounded-full", getEventColor(event.type))} />
                        ))}
                        {events.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{events.length - 2}</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events on this day</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border bg-card space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", getEventColor(event.type))} />
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                      </div>
                      {event.description && <p className="text-xs text-muted-foreground pl-4">{event.description}</p>}
                      <Badge variant="secondary" className="text-xs ml-4">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{currentDate.getFullYear()}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateYear("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  This Year
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateYear("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {months.map((month, index) => {
                const monthDate = new Date(currentDate.getFullYear(), index, 1)
                const monthEvents = mockCalendarEvents.filter((event) => {
                  const eventDate = new Date(event.date)
                  return eventDate.getMonth() === index && eventDate.getFullYear() === currentDate.getFullYear()
                })

                return (
                  <button
                    key={month}
                    onClick={() => {
                      setCurrentDate(monthDate)
                      setView("month")
                    }}
                    className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <h4 className="font-semibold mb-2">{month}</h4>
                    <div className="space-y-1">
                      {monthEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center gap-2">
                          <div className={cn("h-1.5 w-1.5 rounded-full", getEventColor(event.type))} />
                          <span className="text-xs text-muted-foreground truncate">{event.title}</span>
                        </div>
                      ))}
                      {monthEvents.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{monthEvents.length - 3} more</span>
                      )}
                      {monthEvents.length === 0 && <span className="text-xs text-muted-foreground">No events</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Event Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500" />
              <span className="text-sm">Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF4D8D]" />
              <span className="text-sm">Deadlines</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
