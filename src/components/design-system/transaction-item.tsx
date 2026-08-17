import { CategoryIcon } from "@/components/design-system/category-icon"
import { formatNaira } from "@/lib/currency"
import { cn } from "@/lib/utils"

export type TransactionItemData = {
  id: string
  type: "INCOME" | "EXPENSE"
  amount: number
  description: string | null
  transactionDate: Date
  category: { name: string; icon: string }
}

const dateFormatter = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short" })

export function TransactionItem({
  transaction,
  onClick,
}: {
  transaction: TransactionItemData
  onClick?: () => void
}) {
  const isIncome = transaction.type === "INCOME"

  const Wrapper = onClick ? "button" : "div"

  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "flex w-full items-center gap-3 py-2.5 text-left",
        onClick && "cursor-pointer rounded-lg transition-colors hover:bg-muted/60"
      )}
    >
      <CategoryIcon icon={transaction.category.icon} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {transaction.description || transaction.category.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {transaction.category.name} · {dateFormatter.format(transaction.transactionDate)}
        </p>
      </div>
      <p
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          isIncome ? "text-positive" : "text-foreground"
        )}
      >
        {isIncome ? "+" : "-"}
        {formatNaira(transaction.amount)}
      </p>
    </Wrapper>
  )
}
