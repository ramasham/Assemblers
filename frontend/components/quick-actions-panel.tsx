"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

export function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <Link href="/job-orders?action=create">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create New Job Order
            </Button>
          </Link>
          <Link href="/device-tracker">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search Device
            </Button>
          </Link>
          <Link href="/performance">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Performance Reports
            </Button>
          </Link>
          <Link href="/reports">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
