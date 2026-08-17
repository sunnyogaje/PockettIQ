"use client"

import * as React from "react"

type QuickAddContextValue = {
  openQuickAdd: (tab?: "expense" | "income") => void
}

export const QuickAddContext = React.createContext<QuickAddContextValue | null>(null)

export function useQuickAdd() {
  const ctx = React.useContext(QuickAddContext)
  if (!ctx) {
    throw new Error("useQuickAdd must be used within the authenticated app shell")
  }
  return ctx
}
