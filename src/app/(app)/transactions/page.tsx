import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftRight } from "lucide-react"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { listTransactions } from "@/server/services/transactions"
import { getCategoriesForUser } from "@/server/services/categories"
import { getSubscription } from "@/server/services/subscriptions"
import { toNumber, formatNaira } from "@/lib/currency"
import { EmptyState } from "@/components/design-system/empty-state"
import { QuickAddTriggerButton } from "@/components/design-system/quick-add-trigger-button"
import { AdPlaceholder } from "@/components/design-system/ad-placeholder"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionFilters } from "./transaction-filters"
import { TypeTabs } from "./type-tabs"
import { TransactionsList } from "./transactions-list"

export const metadata: Metadata = {
  title: "Transactions",
}

const PAGE_SIZE = 20

type PaymentMethod = "CASH" | "BANK" | "CARD" | "TRANSFER" | "OTHER"
type TxType = "INCOME" | "EXPENSE"

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/transactions">) {
  const user = await requireOnboardedUser()
  const params = await searchParams
  const get = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "")

  const type = get("type") as TxType | ""
  const categoryId = get("categoryId")
  const paymentMethod = get("paymentMethod") as PaymentMethod | ""
  const dateFrom = get("dateFrom")
  const dateTo = get("dateTo")
  const minAmount = get("minAmount")
  const maxAmount = get("maxAmount")
  const search = get("q")
  const page = Math.max(1, Number(get("page")) || 1)

  const [{ transactions }, expenseCategories, incomeCategories, subscription] = await Promise.all([
    listTransactions(user.id, {
      type: type || undefined,
      categoryId: categoryId || undefined,
      paymentMethod: paymentMethod || undefined,
      dateFrom: dateFrom ? new Date(`${dateFrom}T00:00:00`) : undefined,
      dateTo: dateTo ? new Date(`${dateTo}T23:59:59`) : undefined,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      search: search || undefined,
      take: page * PAGE_SIZE,
    }),
    getCategoriesForUser(user.id, "EXPENSE"),
    getCategoriesForUser(user.id, "INCOME"),
    getSubscription(user.id),
  ])
  const isPremium = subscription?.plan === "PREMIUM"

  const allCategories = [...expenseCategories, ...incomeCategories]

  const items = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    amount: toNumber(t.amount),
    categoryId: t.categoryId,
    paymentMethod: t.paymentMethod,
    description: t.description,
    transactionDate: t.transactionDate,
    category: { name: t.category.name, icon: t.category.icon },
  }))

  const searchTotal = search
    ? items.reduce((sum, t) => sum + (t.type === "EXPENSE" ? t.amount : 0), 0)
    : 0

  const urlSearchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => typeof v === "string")
      .map(([k, v]) => [k, v as string])
  )

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <QuickAddTriggerButton tab="expense" label="Add" />
      </div>

      <TypeTabs current={type} searchParams={urlSearchParams} />

      <TransactionFilters categories={allCategories} />

      {search && items.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {items.length} result{items.length === 1 ? "" : "s"} for &ldquo;{search}&rdquo;
          {searchTotal > 0 && <> · {formatNaira(searchTotal)} spent</>}
        </p>
      )}

      <Card>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title={search || categoryId || paymentMethod || dateFrom ? "No matching transactions" : "Your money story starts here"}
              description={
                search || categoryId || paymentMethod || dateFrom
                  ? "Try adjusting your filters or search."
                  : "Add your first expense to start understanding where your money goes."
              }
              action={
                !(search || categoryId || paymentMethod || dateFrom) && (
                  <QuickAddTriggerButton tab="expense" label="Add Expense" />
                )
              }
            />
          ) : (
            <TransactionsList
              transactions={items}
              expenseCategories={expenseCategories}
              incomeCategories={incomeCategories}
            />
          )}
        </CardContent>
      </Card>

      {items.length > 5 && (
        <AdPlaceholder placement="transactions-banner" isPremium={isPremium} />
      )}

      {items.length >= page * PAGE_SIZE && (
        <LoadMoreLink searchParams={urlSearchParams} page={page} />
      )}
    </div>
  )
}

function LoadMoreLink({
  searchParams,
  page,
}: {
  searchParams: URLSearchParams
  page: number
}) {
  const params = new URLSearchParams(searchParams)
  params.set("page", String(page + 1))

  return (
    <div className="flex justify-center pb-4">
      <Link
        href={`/transactions?${params.toString()}`}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Load more
      </Link>
    </div>
  )
}
