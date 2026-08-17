"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema, type OnboardingInput } from "@/server/validation/onboarding"
import { completeOnboardingAction } from "@/server/actions/onboarding"
import {
  INCOME_FREQUENCY_OPTIONS,
  PAYDAY_TYPE_OPTIONS,
  FINANCIAL_GOAL_OPTIONS,
} from "@/lib/constants/onboarding"
import { INCOME_SOURCE_OPTIONS } from "@/lib/constants/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

const TOTAL_STEPS = 6

export function OnboardingWizard({ initialName }: { initialName: string }) {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [submitting, setSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: initialName,
      incomeSources: [],
      incomeFrequency: null,
      usualIncomeAmount: null,
      paydayType: null,
      paydayDay: null,
      paydayDate: null,
      mainGoal: null,
    },
  })

  const values = form.watch()

  async function finish() {
    setSubmitting(true)
    setFormError(null)
    const result = await completeOnboardingAction(form.getValues())
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  async function next() {
    if (step === 1) {
      const valid = await form.trigger("firstName")
      if (!valid) return
    }
    if (step === TOTAL_STEPS) {
      await finish()
      return
    }
    setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => Math.max(1, s - 1))
  }

  function toggleIncomeSource(source: string) {
    const current = form.getValues("incomeSources")
    form.setValue(
      "incomeSources",
      current.includes(source)
        ? current.filter((s) => s !== source)
        : [...current, source]
    )
  }

  return (
    <Card>
      <CardHeader>
        <ProgressBar value={(step / TOTAL_STEPS) * 100} className="mb-2" />
        <CardTitle className="text-xl">{stepTitle(step)}</CardTitle>
        {stepDescription(step) && (
          <CardDescription>{stepDescription(step)}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-2">
            <Input
              placeholder="Your first name"
              autoFocus
              {...form.register("firstName")}
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {INCOME_SOURCE_OPTIONS.map((source) => {
              const active = values.incomeSources.includes(source)
              return (
                <button
                  key={source}
                  type="button"
                  onClick={() => toggleIncomeSource(source)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {source}
                </button>
              )
            })}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-2">
            {INCOME_FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => form.setValue("incomeFrequency", opt.value)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  values.incomeFrequency === opt.value
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Amount (optional)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                ₦
              </span>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="0.00"
                className="pl-7"
                value={values.usualIncomeAmount ?? ""}
                onChange={(e) =>
                  form.setValue(
                    "usualIncomeAmount",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {PAYDAY_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => form.setValue("paydayType", opt.value)}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-center text-xs font-medium transition-colors sm:text-sm",
                    values.paydayType === opt.value
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {values.paydayType === "DAY_OF_MONTH" && (
              <Input
                type="number"
                min={1}
                max={31}
                placeholder="Day of month (1–31)"
                value={values.paydayDay ?? ""}
                onChange={(e) =>
                  form.setValue(
                    "paydayDay",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            )}

            {values.paydayType === "SPECIFIC_DATE" && (
              <div className="flex justify-center rounded-lg border">
                <Calendar
                  mode="single"
                  selected={
                    values.paydayDate ? new Date(values.paydayDate) : undefined
                  }
                  onSelect={(date) =>
                    form.setValue("paydayDate", date ? date.toISOString() : null)
                  }
                />
              </div>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-2">
            {FINANCIAL_GOAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => form.setValue("mainGoal", opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  values.mainGoal === opt.value
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {opt.label}
                {values.mainGoal === opt.value && (
                  <CheckCircle2 className="size-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={back} disabled={submitting}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            {(step === 4 || step === 6) && (
              <Button
                type="button"
                variant="ghost"
                onClick={next}
                disabled={submitting}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            )}
            <Button type="button" onClick={next} disabled={submitting}>
              {step === TOTAL_STEPS
                ? submitting
                  ? "Finishing…"
                  : "Finish"
                : "Continue"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function stepTitle(step: number) {
  switch (step) {
    case 1:
      return "What should we call you?"
    case 2:
      return "How do you usually receive money?"
    case 3:
      return "How often do you receive your main income?"
    case 4:
      return "How much do you usually receive?"
    case 5:
      return "When do you usually get paid?"
    case 6:
      return "What's your main financial goal?"
    default:
      return ""
  }
}

function stepDescription(step: number) {
  switch (step) {
    case 2:
      return "Select all that apply."
    case 5:
      return "This helps us calculate your salary countdown."
    default:
      return null
  }
}
