"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { SlidersHorizontal, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Category = { id: string; name: string }

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank" },
  { value: "CARD", label: "Card" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "OTHER", label: "Other" },
]

export function TransactionFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = React.useState(searchParams.get("q") ?? "")
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const [categoryId, setCategoryId] = React.useState(searchParams.get("categoryId") ?? "")
  const [paymentMethod, setPaymentMethod] = React.useState(searchParams.get("paymentMethod") ?? "")
  const [dateFrom, setDateFrom] = React.useState(searchParams.get("dateFrom") ?? "")
  const [dateTo, setDateTo] = React.useState(searchParams.get("dateTo") ?? "")
  const [minAmount, setMinAmount] = React.useState(searchParams.get("minAmount") ?? "")
  const [maxAmount, setMaxAmount] = React.useState(searchParams.get("maxAmount") ?? "")

  function pushParams(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(overrides)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  // Debounced search-as-you-type.
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== (searchParams.get("q") ?? "")) {
        pushParams({ q: search || null })
      }
    }, 350)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function applyFilters() {
    pushParams({
      categoryId: categoryId || null,
      paymentMethod: paymentMethod || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      minAmount: minAmount || null,
      maxAmount: maxAmount || null,
    })
    setSheetOpen(false)
  }

  function clearFilters() {
    setCategoryId("")
    setPaymentMethod("")
    setDateFrom("")
    setDateTo("")
    setMinAmount("")
    setMaxAmount("")
    pushParams({
      categoryId: null,
      paymentMethod: null,
      dateFrom: null,
      dateTo: null,
      minAmount: null,
      maxAmount: null,
    })
    setSheetOpen(false)
  }

  const activeFilterCount = [categoryId, paymentMethod, dateFrom, dateTo, minAmount, maxAmount].filter(
    Boolean
  ).length

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions"
          className="pl-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="relative shrink-0"
        onClick={() => setSheetOpen(true)}
        aria-label="Filter transactions"
      >
        <SlidersHorizontal className="size-4" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Filter transactions</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 px-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryId || "all"} onValueChange={(v) => setCategoryId(v === "all" ? "" : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payment method</label>
              <Select
                value={paymentMethod || "all"}
                onValueChange={(v) => setPaymentMethod(v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any method</SelectItem>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">From</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">To</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Min amount</label>
                <Input
                  type="number"
                  min={0}
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="₦0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Max amount</label>
                <Input
                  type="number"
                  min={0}
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              Clear
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
