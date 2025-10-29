"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, FileText } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
            <FileText className="mr-2 h-4 w-4" />
            View Performance Reports
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
