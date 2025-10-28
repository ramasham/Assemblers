"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"

interface CriticalAlertBannerProps {
  alert: {
    id: string
    title: string
    message: string
  } | null
  onDismiss: () => void
}

export function CriticalAlertBanner({ alert, onDismiss }: CriticalAlertBannerProps) {
  if (!alert) return null

  return (
    <Alert className="border-[hsl(var(--alert-error))] bg-[hsl(var(--alert-error))]/10 mb-6">
      <AlertCircle className="h-5 w-5 text-[hsl(var(--alert-error))]" />
      <AlertTitle className="text-[hsl(var(--alert-error))] font-semibold">{alert.title}</AlertTitle>
      <AlertDescription className="text-foreground">{alert.message}</AlertDescription>
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onDismiss}>
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  )
}
