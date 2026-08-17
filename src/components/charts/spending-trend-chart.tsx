"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/charts/chart-container"
import { formatNaira } from "@/lib/currency"

export function SpendingTrendChart({
  data,
}: {
  data: { label: string; expenses: number }[]
}) {
  return (
    <ChartContainer height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis hide />
        <Tooltip content={<ChartTooltipContent formatValue={(v) => formatNaira(v)} />} />
        <Line
          type="monotone"
          dataKey="expenses"
          name="Spending"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--chart-1)", stroke: "var(--card)", strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
