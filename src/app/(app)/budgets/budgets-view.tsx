"use client"

import * as React from "react"
import { Plus, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BudgetCard } from "@/components/design-system/budget-card"
import { EmptyState } from "@/components/design-system/empty-state"
import { CreateBudgetSheet } from "./create-budget-sheet"
import { EditBudgetSheet, type EditableBudget } from "./edit-budget-sheet"

type BudgetItem = {
  id: string
  categoryId: string | null
  categoryName: string
  categoryIcon: string
  amount: number
  spent: number
}
type Category = { id: string; name: string; group: string }

export function BudgetsView({
  budgets,
  availableCategories,
  hasOverallBudget,
  month,
  year,
}: {
  budgets: BudgetItem[]
  availableCategories: Category[]
  hasOverallBudget: boolean
  month: number
  year: number
}) {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<EditableBudget | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Give your money a plan"
          description="Create a monthly budget overall or by category to keep your spending on track."
          action={<Button onClick={() => setCreateOpen(true)}>Create Budget</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              categoryName={b.categoryName}
              categoryIcon={b.categoryIcon}
              amount={b.amount}
              spent={b.spent}
              onClick={() =>
                setEditing({ id: b.id, categoryName: b.categoryName, amount: b.amount })
              }
            />
          ))}
        </div>
      )}

      <CreateBudgetSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        categories={availableCategories}
        hasOverallBudget={hasOverallBudget}
        month={month}
        year={year}
      />

      {editing && (
        <EditBudgetSheet
          budget={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}
    </div>
  )
}
