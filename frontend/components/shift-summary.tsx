"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, FileText } from "lucide-react"
import Link from "next/link"

interface ShiftSummaryProps {
  unitsCompleted: number
  hoursLogged: number
}

export function ShiftSummary({ unitsCompleted, hoursLogged }: ShiftSummaryProps) {
  return (
    <Card className="border-primary/50 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle>Shift Summary</CardTitle>
        <CardDescription>Your progress today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            <CheckCircle2 className="h-8 w-8 text-[hsl(var(--alert-success))]" />
            <div>
              <p className="text-2xl font-bold">{unitsCompleted}</p>
              <p className="text-xs text-muted-foreground">Units Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{hoursLogged}</p>
              <p className="text-xs text-muted-foreground">Hours Logged</p>
            </div>
          </div>
        </div>
        <Link href="/work-log" className="block">
          <Button className="w-full" size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Submit Daily Report
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
