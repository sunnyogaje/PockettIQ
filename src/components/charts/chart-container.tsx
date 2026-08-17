"use client"

import { ResponsiveContainer } from "recharts"

export function ChartContainer({
  children,
  height = 240,
}: {
  children: React.ReactElement
  height?: number
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

type TooltipPayloadItem = {
  name?: string
  value?: number
  color?: string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  formatValue: (value: number) => string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      <div className="space-y-0.5">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {item.color && (
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="font-medium tabular-nums text-popover-foreground">
              {formatValue(item.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
