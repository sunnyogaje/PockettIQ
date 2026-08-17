"use client"

import * as React from "react"
import { TransactionItem, type TransactionItemData } from "@/components/design-system/transaction-item"
import {
  EditTransactionSheet,
  type EditableTransaction,
} from "./edit-transaction-sheet"

type Category = { id: string; name: string; group: string }

export function TransactionsList({
  transactions,
  expenseCategories,
  incomeCategories,
}: {
  transactions: (TransactionItemData & {
    categoryId: string
    paymentMethod: EditableTransaction["paymentMethod"]
  })[]
  expenseCategories: Category[]
  incomeCategories: Category[]
}) {
  const [editing, setEditing] = React.useState<EditableTransaction | null>(null)

  return (
    <>
      <div className="divide-y">
        {transactions.map((t) => (
          <TransactionItem
            key={t.id}
            transaction={t}
            onClick={() =>
              setEditing({
                id: t.id,
                type: t.type,
                amount: t.amount,
                categoryId: t.categoryId,
                transactionDate: t.transactionDate,
                paymentMethod: t.paymentMethod,
                description: t.description,
              })
            }
          />
        ))}
      </div>

      {editing && (
        <EditTransactionSheet
          transaction={editing}
          categories={editing.type === "INCOME" ? incomeCategories : expenseCategories}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}
    </>
  )
}
