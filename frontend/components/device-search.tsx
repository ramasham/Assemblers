"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockJobOrders } from "@/lib/mock-data"
import { Search, Package, MapPin } from "lucide-react"

export function DeviceSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockJobOrders>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    const results = mockJobOrders.filter(
      (order) =>
        order.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(results)
    setHasSearched(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Tracking</CardTitle>
        <CardDescription>Search for devices by serial number, type, or job order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter serial number, device type, or job number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No devices found matching your search</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Found {searchResults.length} result(s)</p>
                {searchResults.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border bg-card space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{order.deviceType}</h4>
                        <p className="text-sm text-muted-foreground">{order.serialNumber}</p>
                      </div>
                      <Badge variant={order.status === "completed" ? "secondary" : "default"}>{order.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Job Order:</span>
                        <p className="font-medium">{order.jobNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span>
                        <p className="font-medium">
                          {order.completed}/{order.quantity} units
                        </p>
                      </div>
                      {order.assignedTo && (
                        <div className="col-span-2 flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>Assigned to: {order.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
