import { Skeleton } from "@/components/ui/skeleton"
import { ListCardSkeleton, PageHeaderSkeleton } from "@/components/design-system/page-skeleton"

export default function TransactionsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeaderSkeleton />
      <Skeleton className="h-9 w-full rounded-lg" />
      <ListCardSkeleton rows={6} />
    </div>
  )
}
