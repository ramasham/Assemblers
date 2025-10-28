"use client"

import { FileText, Download, Calendar, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockPerformanceMetrics, mockJobOrders } from "@/lib/mock-data"

export default function ReportsPage() {
  const totalUnits = mockPerformanceMetrics.reduce((sum, m) => sum + m.completedUnits, 0)
  const totalHours = mockPerformanceMetrics.reduce((sum, m) => sum + m.workHours, 0)
  const avgProductivity = totalUnits / totalHours
  const completionRate = (mockJobOrders.filter((jo) => jo.status === "completed").length / mockJobOrders.length) * 100

  const reports = [
    {
      id: "1",
      title: "Daily Production Report",
      description: "Summary of daily production activities and metrics",
      date: "2025-01-27",
      type: "Daily",
    },
    {
      id: "2",
      title: "Weekly Performance Summary",
      description: "Team performance analysis for the week",
      date: "2025-01-27",
      type: "Weekly",
    },
    {
      id: "3",
      title: "Job Order Status Report",
      description: "Current status of all active job orders",
      date: "2025-01-27",
      type: "Custom",
    },
    {
      id: "4",
      title: "Efficiency Analysis",
      description: "Detailed efficiency metrics by technician",
      date: "2025-01-20",
      type: "Weekly",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and export production reports</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground">Units completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Productivity</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProductivity.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Units per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Job orders completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Hours worked</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="this-week">
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{report.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{report.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <p className="text-xs text-muted-foreground">Generated on {report.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
