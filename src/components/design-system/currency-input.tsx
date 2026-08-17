"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> & {
    value: number | null
    onChange: (value: number | null) => void
  }
>(function CurrencyInput({ value, onChange, className, ...props }, ref) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
        ₦
      </span>
      <Input
        ref={ref}
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        placeholder="0.00"
        className={cn("pl-7 text-base", className)}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        {...props}
      />
    </div>
  )
})
