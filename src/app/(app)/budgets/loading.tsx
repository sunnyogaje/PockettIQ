import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/design-system/page-skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BudgetsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeaderSkeleton />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
