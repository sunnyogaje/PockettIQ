import { Skeleton } from "@/components/ui/skeleton"
import {
  StatCardsSkeleton,
  ListCardSkeleton,
  PageHeaderSkeleton,
} from "@/components/design-system/page-skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeaderSkeleton />
      <Skeleton className="h-32 w-full rounded-xl" />
      <StatCardsSkeleton count={3} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ListCardSkeleton rows={3} />
        <ListCardSkeleton rows={3} />
      </div>
      <ListCardSkeleton rows={4} />
    </div>
  )
}
