"use client"

import { useAuth } from "@/lib/auth-context"
import { RoleSelection } from "@/components/role-selection"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SelectRolePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/")
      } else if (user.currentRole) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.currentRole) {
    return null
  }

  return <RoleSelection />
}
