"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDevices } from "@/lib/mock-data"
import { Clock, CheckCircle2, XCircle, Cpu } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DeviceTrackingSections() {
  const devicesInProgress = mockDevices.filter((d) => d.status === "in-progress" || d.status === "testing")
  const failedDevices = mockDevices.filter((d) => d.status === "failed")
  const approvedDevices = mockDevices.filter((d) => d.status === "approved")

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Devices In Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">In Progress</CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <Badge variant="secondary">{devicesInProgress.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {devicesInProgress.map((device) => (
                <div key={device.id} className="rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{device.serialNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">{device.model}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {device.status === "testing" ? "Testing" : "Active"}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Operation:</span> {device.currentOperation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Assigned:</span> {device.assignedTo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Failed Devices */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Failed</CardTitle>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <Badge variant="destructive">{failedDevices.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {failedDevices.map((device) => (
                <div key={device.id} className="rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{device.serialNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">{device.model}</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs flex-shrink-0">
                      Failed
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Operation:</span> {device.currentOperation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Assigned:</span> {device.assignedTo}
                    </p>
                    {device.failureReason && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded">
                        <span className="font-medium">Reason:</span> {device.failureReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Approved Devices */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Approved</CardTitle>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                {approvedDevices.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {approvedDevices.map((device) => (
                <div key={device.id} className="rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{device.serialNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">{device.model}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs flex-shrink-0 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    >
                      Approved
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Last Operation:</span> {device.currentOperation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Completed by:</span> {device.assignedTo}
                    </p>
                    {device.completionTime && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Completed:</span>{" "}
                        {new Date(device.completionTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
