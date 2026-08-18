"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <AlertTriangle className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          That wasn&apos;t supposed to happen. Please try again — your data is safe.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
