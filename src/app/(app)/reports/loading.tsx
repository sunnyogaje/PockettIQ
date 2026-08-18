import { Skeleton } from "@/components/ui/skeleton"
import { StatCardsSkeleton, PageHeaderSkeleton } from "@/components/design-system/page-skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={3} />
      <Card>
        <CardContent>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-40 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
