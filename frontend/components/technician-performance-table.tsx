"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockPerformanceMetrics } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function TechnicianPerformanceTable() {
  const getPerformanceStatus = (efficiency: number) => {
    if (efficiency >= 90) return { label: "Excellent", variant: "secondary" as const, icon: TrendingUp }
    if (efficiency >= 80) return { label: "Good", variant: "default" as const, icon: Minus }
    return { label: "Needs Attention", variant: "destructive" as const, icon: TrendingDown }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Performance</CardTitle>
        <CardDescription>Individual performance metrics and status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead className="text-right">Productivity</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
              <TableHead className="text-right">Utilization</TableHead>
              <TableHead className="text-right">Completed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPerformanceMetrics.map((metric) => {
              const status = getPerformanceStatus(metric.efficiency)
              const StatusIcon = status.icon
              return (
                <TableRow key={metric.technicianId}>
                  <TableCell className="font-medium">{metric.technicianName}</TableCell>
                  <TableCell className="text-right">{metric.productivity} u/hr</TableCell>
                  <TableCell className="text-right">{metric.efficiency}%</TableCell>
                  <TableCell className="text-right">{metric.utilization}%</TableCell>
                  <TableCell className="text-right">{metric.completedUnits} units</TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
