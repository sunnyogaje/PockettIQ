"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/charts/chart-container"
import { formatNaira } from "@/lib/currency"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
]

export function CategorySpendingChart({
  data,
}: {
  data: { categoryName: string; total: number }[]
}) {
  const top = data.slice(0, 5)
  const otherTotal = data.slice(5).reduce((sum, c) => sum + c.total, 0)
  const rows = otherTotal > 0 ? [...top, { categoryName: "Other", total: otherTotal }] : top

  return (
    <ChartContainer height={Math.max(180, rows.length * 44)}>
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="categoryName"
          width={90}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          content={<ChartTooltipContent formatValue={(v) => formatNaira(v)} />}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {rows.map((row, i) => (
            <Cell key={row.categoryName} fill={COLORS[i % COLORS.length]} />
          ))}
          <LabelList
            dataKey="total"
            position="right"
            formatter={(v: unknown) => formatNaira(Number(v))}
            style={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
