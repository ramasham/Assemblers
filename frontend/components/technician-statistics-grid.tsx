"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { mockPerformanceMetrics, type PerformanceMetric } from "@/lib/mock-data"
import { Search, TrendingUp, TrendingDown, Minus, User, BarChart3, Clock, Target } from "lucide-react"

type TimeFilter = "daily" | "weekly" | "monthly"

export function TechnicianStatisticsGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("daily")
  const [selectedTechnician, setSelectedTechnician] = useState<PerformanceMetric | null>(null)

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600 dark:text-green-400"
    if (value >= 80) return "text-blue-600 dark:text-blue-400"
    if (value >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getPerformanceBadge = (efficiency: number) => {
    if (efficiency >= 90) return { label: "Excellent", variant: "default" as const, icon: TrendingUp }
    if (efficiency >= 80) return { label: "Good", variant: "secondary" as const, icon: Minus }
    return { label: "Needs Attention", variant: "destructive" as const, icon: TrendingDown }
  }

  const filteredAndSortedTechnicians = mockPerformanceMetrics.filter((tech) => {
    const matchesSearch = tech.technicianName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || tech.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Technician Statistics</CardTitle>
          <CardDescription>View detailed performance metrics for each technician</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Technician Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedTechnicians.map((tech) => {
              const badge = getPerformanceBadge(tech.efficiency)
              const BadgeIcon = badge.icon
              return (
                <Card
                  key={tech.technicianId}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  onClick={() => setSelectedTechnician(tech)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">{tech.technicianName}</CardTitle>
                          <p className="text-xs text-muted-foreground capitalize">{tech.department}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className={`font-semibold ${getPerformanceColor(tech.efficiency)}`}>
                          {tech.efficiency}%
                        </span>
                      </div>
                      <Progress value={tech.efficiency} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Productivity</span>
                      <span className="font-medium">{tech.productivity} u/hr</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium">{tech.utilization}%</span>
                    </div>
                    <Badge variant={badge.variant} className="w-full justify-center gap-1">
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredAndSortedTechnicians.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <User className="mx-auto h-12 w-12 opacity-20" />
              <p className="mt-4">No technicians found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Statistics Dialog */}
      <Dialog open={!!selectedTechnician} onOpenChange={() => setSelectedTechnician(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTechnician && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div>{selectedTechnician.technicianName}</div>
                    <div className="text-sm font-normal text-muted-foreground capitalize">
                      {selectedTechnician.department} Department
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>Detailed performance statistics for {timeFilter} period</DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Performance Overview */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Performance Overview</h3>
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(selectedTechnician.efficiency)}`}>
                          {selectedTechnician.efficiency}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Productivity</p>
                        <p className="text-lg font-bold">{selectedTechnician.productivity} u/hr</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Utilization</p>
                        <p className="text-lg font-bold">{selectedTechnician.utilization}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Work Summary</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm text-muted-foreground">Completed Units</span>
                      <span className="font-semibold">{selectedTechnician.completedUnits} units</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm text-muted-foreground">Work Hours</span>
                      <span className="font-semibold">{selectedTechnician.workHours} hours</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm text-muted-foreground">Department</span>
                      <span className="font-semibold capitalize">{selectedTechnician.department}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Status */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Performance Status</h3>
                  <Card>
                    <CardContent className="pt-6">
                      {(() => {
                        const badge = getPerformanceBadge(selectedTechnician.efficiency)
                        const BadgeIcon = badge.icon
                        return (
                          <div className="flex items-center gap-3">
                            <BadgeIcon className="h-8 w-8" />
                            <div>
                              <p className="font-semibold">{badge.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {badge.label === "Excellent"
                                  ? "Outstanding performance! Keep up the great work."
                                  : badge.label === "Good"
                                    ? "Solid performance with room for improvement."
                                    : "Performance below target. Additional support may be needed."}
                              </p>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
