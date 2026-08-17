"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Bell } from "lucide-react"
import { Sidebar } from "@/components/design-system/sidebar"
import { BottomNav } from "@/components/design-system/bottom-nav"
import { QuickAddSheet } from "@/components/design-system/quick-add-sheet"
import { PremiumBadge } from "@/components/design-system/premium-badge"
import { QuickAddContext } from "@/components/design-system/quick-add-context"
import { Button } from "@/components/ui/button"

type Category = { id: string; name: string; icon: string; group: string }

export function AppShell({
  children,
  expenseCategories,
  incomeCategories,
  unreadNotifications,
  isPremium,
}: {
  children: React.ReactNode
  expenseCategories: Category[]
  incomeCategories: Category[]
  unreadNotifications: number
  isPremium: boolean
}) {
  const [quickAddOpen, setQuickAddOpen] = React.useState(false)
  const [quickAddTab, setQuickAddTab] = React.useState<"expense" | "income">("expense")

  function openQuickAdd(tab: "expense" | "income" = "expense") {
    setQuickAddTab(tab)
    setQuickAddOpen(true)
  }

  return (
    <QuickAddContext.Provider value={{ openQuickAdd }}>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-8">
            <div className="font-semibold lg:hidden">PockettIQ</div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              {isPremium && <PremiumBadge />}
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/notifications" aria-label="Notifications">
                  <Bell className="size-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-negative" />
                  )}
                </Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 pt-4 pb-24 lg:px-8 lg:pb-8">{children}</main>
        </div>

        <BottomNav />

        <Button
          size="icon"
          className="fixed right-4 bottom-20 z-40 size-14 rounded-full shadow-lg lg:right-8 lg:bottom-8"
          onClick={() => openQuickAdd("expense")}
          aria-label="Add expense"
        >
          <Plus className="size-6" />
        </Button>

        <QuickAddSheet
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          defaultTab={quickAddTab}
        />
      </div>
    </QuickAddContext.Provider>
  )
}
