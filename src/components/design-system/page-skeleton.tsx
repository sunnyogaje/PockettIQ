import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="gap-1.5 py-4">
          <CardContent className="space-y-2 px-4">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-6 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ListCardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Card>
      <CardContent className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-56" />
    </div>
  )
}
