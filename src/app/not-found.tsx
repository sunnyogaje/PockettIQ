import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/design-system/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo />
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Compass className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">Page not found</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </div>
  )
}
