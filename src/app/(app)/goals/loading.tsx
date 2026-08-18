import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/design-system/page-skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function GoalsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeaderSkeleton />
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
