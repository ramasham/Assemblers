"use client"
import { useAuth } from "@/lib/auth-context"
import { mockPerformanceMetrics, mockJobOrders, mockWorkSubmissions } from "@/lib/mock-data"
import { AchievementsSection } from "@/components/achievements-section"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { CourseTabs } from "@/components/course-tabs"
import { LeadersPanel } from "@/components/leaders-panel"
import { PlannerSummaryCards } from "@/components/planner-summary-cards"
import { DeviceTrackingSections } from "@/components/device-tracking-sections"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
} from "lucide-react"
import type { Department } from "@/lib/auth-context"
import { useState } from "react"
import Link from "next/link"
import { AssignOperationDialog } from "@/components/assign-operation-dialog"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  if (user.currentRole === "engineer-planner") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mission Control</h2>
          <p className="text-muted-foreground">Production overview and system status</p>
        </div>

        {/* Summary Cards - KPIs */}
        <PlannerSummaryCards />

        <DeviceTrackingSections />
      </div>
    )
  }

  if (
    user.currentRole === "production-supervisor" ||
    user.currentRole === "test-supervisor" ||
    user.currentRole === "quality-supervisor"
  ) {
    const getDepartmentFromRole = (role: string | null): Department | null => {
      if (role === "production-supervisor") return "production"
      if (role === "test-supervisor") return "test"
      if (role === "quality-supervisor") return "quality"
      return null
    }

    const department = getDepartmentFromRole(user?.currentRole || null)

    // Filter data by department
    const departmentJobOrders = department
      ? mockJobOrders.filter((order) => order.department === department)
      : mockJobOrders

    const departmentSubmissions = department
      ? mockWorkSubmissions.filter((submission) => submission.department === department)
      : mockWorkSubmissions

    const departmentMetrics = department
      ? mockPerformanceMetrics.filter((metric) => metric.department === department)
      : mockPerformanceMetrics

    // Calculate summary metrics
    const totalOperations = departmentJobOrders.length
    const pendingCompletion = departmentJobOrders.filter((order) => order.status === "in-progress").length
    const awaitingApproval = departmentSubmissions.filter((sub) => sub.status === "pending").length
    const approvedCount = departmentSubmissions.filter((sub) => sub.status === "approved").length
    const rejectedCount = departmentSubmissions.filter((sub) => sub.status === "rejected").length

    // Calculate department performance
    const avgProductivity = departmentMetrics.reduce((sum, m) => sum + m.productivity, 0) / departmentMetrics.length
    const avgEfficiency = departmentMetrics.reduce((sum, m) => sum + m.efficiency, 0) / departmentMetrics.length
    const totalCompletedUnits = departmentMetrics.reduce((sum, m) => sum + m.completedUnits, 0)
    const activeTechnicians = departmentMetrics.length

    const departmentLabel = department ? department.charAt(0).toUpperCase() + department.slice(1) : "All Departments"

    // Get pending submissions for quick actions
    const pendingSubmissions = departmentSubmissions.filter((sub) => sub.status === "pending").slice(0, 3)

    const unassignedOperations = departmentJobOrders
      .filter((order) => !order.assignedTo && order.status === "pending")
      .slice(0, 3)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Supervisor Homepage</h2>
            <p className="text-muted-foreground">{departmentLabel} Department - Overview</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {departmentLabel} Department
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance Summary</CardTitle>
            <CardDescription>Real-time overview of {departmentLabel} department metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Productivity</p>
                  <p className="text-2xl font-bold">{avgProductivity.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">units/hour</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                  <p className="text-2xl font-bold">{avgEfficiency.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">department avg</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <ClipboardList className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Completed</p>
                  <p className="text-2xl font-bold">{totalCompletedUnits}</p>
                  <p className="text-xs text-muted-foreground">units today</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Technicians</p>
                  <p className="text-2xl font-bold">{activeTechnicians}</p>
                  <p className="text-xs text-muted-foreground">working now</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOperations}</div>
              <p className="text-xs text-muted-foreground">Assigned to department</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Completion</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{pendingCompletion}</div>
              <p className="text-xs text-muted-foreground">Operations in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Awaiting Approval</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{awaitingApproval}</div>
              <p className="text-xs text-muted-foreground">Needs your review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved / Rejected</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
                <span className="text-muted-foreground">/</span>
                <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
              </div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Tasks - Quick Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Tasks - Quick Actions</CardTitle>
                  <CardDescription>Review and approve/reject technician submissions</CardDescription>
                </div>
                <Link href="/supervisor/task-review">
                  <Button variant="ghost" size="sm">
                    View More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {pendingSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No pending tasks to review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map((submission) => (
                    <PendingTaskCard key={submission.id} submission={submission} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Assign Operations</CardTitle>
                  <CardDescription>Assign unassigned operations to technicians</CardDescription>
                </div>
                <Link href="/supervisor/operations">
                  <Button variant="ghost" size="sm">
                    View More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {unassignedOperations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">All operations are assigned</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unassignedOperations.map((operation) => (
                    <UnassignedOperationCard key={operation.id} operation={operation} department={department} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const userMetrics = mockPerformanceMetrics.find((m) => m.technicianName === user.name) || {
    productivity: 4.2,
    efficiency: 88,
    utilization: 85,
    completedUnits: 34,
    workHours: 8,
  }

  return (
    <div className="space-y-6">
      {/* Top Section - Unified Dark Background */}
      <div className="grid lg:grid-cols-2 p-8 rounded-lg bg-[#000313] text-white">
        <AchievementsSection
          userName={user.name}
          location="Production Floor, Building A"
          productivity={userMetrics.productivity}
          productivityTrend={8}
          efficiency={userMetrics.efficiency}
          efficiencyTrend={-2}
          utilization={userMetrics.utilization}
          utilizationTrend={0}
        />
        <RealTimeAlerts />
      </div>

      {/* Bottom Section - Light Background */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <CourseTabs userName={user.name} />
        <LeadersPanel />
      </div>
    </div>
  )
}

function PendingTaskCard({ submission }: { submission: any }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Approved submission:", submission.id)
    setIsProcessing(false)
  }

  const handleReject = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Rejected submission:", submission.id)
    setIsProcessing(false)
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{submission.technicianName}</p>
          <Badge variant="outline" className="text-xs">
            {submission.date}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{submission.tasksCompleted}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{submission.devicesCompleted} devices completed</span>
          <span>{submission.minutesWorked} mins worked</span>
        </div>
        {submission.notes && <p className="text-sm italic text-muted-foreground mt-2">Note: {submission.notes}</p>}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500 bg-transparent"
          onClick={handleApprove}
          disabled={isProcessing}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 bg-transparent"
          onClick={handleReject}
          disabled={isProcessing}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  )
}

function UnassignedOperationCard({ operation, department }: { operation: any; department: Department | null }) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{operation.jobNumber}</p>
            {operation.priority === "high" && (
              <Badge variant="destructive" className="text-xs">
                High Priority
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{operation.deviceType}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Serial: {operation.serialNumber}</span>
            <span>{operation.quantity} units</span>
          </div>
          <p className="text-xs text-muted-foreground">Due: {new Date(operation.dueDate).toLocaleDateString()}</p>
        </div>
        <Button size="sm" onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Assign
        </Button>
      </div>

      <AssignOperationDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        operationId={operation.id}
        department={department}
      />
    </>
  )
}
