"use client"
import { useAuth } from "@/lib/auth-context"
import { SupervisorStats } from "@/components/supervisor-stats"
import { TeamPerformanceChart } from "@/components/team-performance-chart"
import { TechnicianPerformanceTable } from "@/components/technician-performance-table"
import { AllJobOrders } from "@/components/all-job-orders"
import { PlannerStats } from "@/components/planner-stats"
import { PlanningCalendar } from "@/components/planning-calendar"
import { DeviceSearch } from "@/components/device-search"
import { ResourceAllocation } from "@/components/resource-allocation"
import { UpcomingEvents } from "@/components/upcoming-events"
import { mockPerformanceMetrics } from "@/lib/mock-data"
import { AchievementsSection } from "@/components/achievements-section"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { CourseTabs } from "@/components/course-tabs"
import { LeadersPanel } from "@/components/leaders-panel"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  // Engineer Planner Dashboard
  if (user.role === "engineer-planner") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Engineer Planner Dashboard</h2>
          <p className="text-muted-foreground">Plan and schedule production resources</p>
        </div>

        <PlannerStats />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PlanningCalendar />
            <AllJobOrders />
          </div>
          <div className="space-y-6">
            <UpcomingEvents />
            <DeviceSearch />
            <ResourceAllocation />
          </div>
        </div>
      </div>
    )
  }

  // Supervisor Dashboard
  if (user.role === "supervisor") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Supervisor Dashboard</h2>
          <p className="text-muted-foreground">Monitor team performance and job orders</p>
        </div>

        <SupervisorStats />

        <div className="space-y-6">
          <TeamPerformanceChart />
          <TechnicianPerformanceTable />
          <AllJobOrders />
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
