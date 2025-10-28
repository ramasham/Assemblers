"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeInitializer() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // This allows users to toggle freely after the initial default is set
    const storedTheme = localStorage.getItem("theme")
    if (!storedTheme) {
      setTheme("dark")
    }
  }, [setTheme])

  return null
}
