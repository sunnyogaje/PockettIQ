import Link from "next/link"
import { cn } from "@/lib/utils"

const TABS = [
  { value: "", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expenses" },
] as const

export function TypeTabs({
  current,
  searchParams,
}: {
  current: string
  searchParams: URLSearchParams
}) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-1">
      {TABS.map((tab) => {
        const params = new URLSearchParams(searchParams)
        if (tab.value) params.set("type", tab.value)
        else params.delete("type")
        params.delete("page")
        const active = current === tab.value
        const query = params.toString()

        return (
          <Link
            key={tab.value}
            href={query ? `/transactions?${query}` : "/transactions"}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
