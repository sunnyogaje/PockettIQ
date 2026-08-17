"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { formatNaira } from "@/lib/currency"
import { suggestedMonthlyContribution } from "@/lib/finance"
import { ContributeSheet } from "./contribute-sheet"
import { EditGoalSheet } from "./edit-goal-sheet"

const dateFormatter = new Intl.DateTimeFormat("en-NG", { month: "short", year: "numeric" })
const contributionDateFormatter = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" })

export function GoalDetailView({
  goal,
  contributions,
}: {
  goal: {
    id: string
    name: string
    targetAmount: number
    currentAmount: number
    targetDate: Date | null
    isEmergencyFund: boolean
  }
  contributions: { id: string; amount: number; date: Date; note: string | null }[]
}) {
  const router = useRouter()
  const [contributeOpen, setContributeOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)

  const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const monthly = suggestedMonthlyContribution({
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    targetDate: goal.targetDate,
  })

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{goal.name}</h1>
        {!goal.isEmergencyFund && (
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="Edit goal">
            <Pencil className="size-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              {formatNaira(goal.currentAmount)}
            </p>
            <p className="text-sm text-muted-foreground">of {formatNaira(goal.targetAmount)}</p>
          </div>
          <ProgressBar value={percent} className="h-2.5" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-medium tabular-nums">{formatNaira(remaining)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Progress</p>
              <p className="font-medium">{Math.round(percent)}%</p>
            </div>
            {goal.targetDate && (
              <div>
                <p className="text-muted-foreground">Target date</p>
                <p className="font-medium">{dateFormatter.format(goal.targetDate)}</p>
              </div>
            )}
            {monthly != null && monthly > 0 && (
              <div>
                <p className="text-muted-foreground">Suggested</p>
                <p className="font-medium">{formatNaira(monthly)}/month</p>
              </div>
            )}
          </div>
          {monthly != null && monthly > 0 && goal.targetDate && (
            <p className="text-xs text-muted-foreground">
              Save {formatNaira(monthly)}/month to reach your goal by{" "}
              {dateFormatter.format(goal.targetDate)}.
            </p>
          )}

          <Button className="w-full" onClick={() => setContributeOpen(true)}>
            <Plus className="size-4" />
            Add Money
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="mb-3 text-sm font-semibold">Contribution History</h2>
          {contributions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contributions yet.</p>
          ) : (
            <div className="divide-y">
              {contributions.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium">{c.note || "Contribution"}</p>
                    <p className="text-xs text-muted-foreground">
                      {contributionDateFormatter.format(c.date)}
                    </p>
                  </div>
                  <p className="font-semibold text-positive tabular-nums">
                    +{formatNaira(c.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ContributeSheet goalId={goal.id} open={contributeOpen} onOpenChange={setContributeOpen} />
      {!goal.isEmergencyFund && (
        <EditGoalSheet
          goal={goal}
          open={editOpen}
          onOpenChange={setEditOpen}
          onDeleted={() => router.push("/goals")}
        />
      )}
    </div>
  )
}
