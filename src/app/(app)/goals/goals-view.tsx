"use client"

import * as React from "react"
import { Plus, ShieldCheck, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GoalCard } from "@/components/design-system/goal-card"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { EmptyState } from "@/components/design-system/empty-state"
import { formatNaira } from "@/lib/currency"
import { CreateGoalSheet } from "./create-goal-sheet"
import { EmergencyFundSheet } from "./emergency-fund-sheet"

type Goal = { id: string; name: string; targetAmount: number; currentAmount: number }
type EmergencyFund = { targetAmount: number; currentAmount: number } | null

export function GoalsView({
  goals,
  emergencyFund,
}: {
  goals: Goal[]
  emergencyFund: EmergencyFund
}) {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [emergencyOpen, setEmergencyOpen] = React.useState(false)

  const emergencyPercent =
    emergencyFund && emergencyFund.targetAmount > 0
      ? (emergencyFund.currentAmount / emergencyFund.targetAmount) * 100
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Savings Goals</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create Goal
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Emergency Fund</h2>
          </div>
          {emergencyFund ? (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium">
                  {formatNaira(emergencyFund.currentAmount)} of{" "}
                  {formatNaira(emergencyFund.targetAmount)}
                </span>
                <span className="text-muted-foreground">{Math.round(emergencyPercent)}%</span>
              </div>
              <ProgressBar value={emergencyPercent} />
              <Button variant="outline" size="sm" onClick={() => setEmergencyOpen(true)}>
                Adjust
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-muted-foreground">
                A cushion for the unexpected — a few months of essential expenses set aside.
              </p>
              <Button size="sm" onClick={() => setEmergencyOpen(true)}>
                Set Up Emergency Fund
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {goals.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="What are you saving for?"
          description="Create a goal and track your progress toward it."
          action={<Button onClick={() => setCreateOpen(true)}>Create Goal</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              id={g.id}
              name={g.name}
              targetAmount={g.targetAmount}
              currentAmount={g.currentAmount}
            />
          ))}
        </div>
      )}

      <CreateGoalSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EmergencyFundSheet
        open={emergencyOpen}
        onOpenChange={setEmergencyOpen}
        initialMonthlyExpenses={
          emergencyFund ? emergencyFund.targetAmount / 3 : null /* best-effort default */
        }
      />
    </div>
  )
}
