"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/charts/chart-container"
import { formatNaira } from "@/lib/currency"

export function IncomeExpenseChart({ income, expenses }: { income: number; expenses: number }) {
  const data = [
    { label: "Income", amount: income, fill: "var(--chart-good)" },
    { label: "Expenses", amount: expenses, fill: "var(--chart-critical)" },
  ]

  return (
    <ChartContainer height={180}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          content={<ChartTooltipContent formatValue={(v) => formatNaira(v)} />}
        />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={64}>
          {data.map((row) => (
            <Cell key={row.label} fill={row.fill} />
          ))}
          <LabelList
            dataKey="amount"
            position="top"
            formatter={(v: unknown) => formatNaira(Number(v))}
            style={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
