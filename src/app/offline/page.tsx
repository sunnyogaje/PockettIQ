import { WifiOff } from "lucide-react"
import { Logo } from "@/components/design-system/logo"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo />
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <WifiOff className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">You&apos;re offline</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Check your internet connection. Any pages you&apos;ve already visited may still be
          available.
        </p>
      </div>
    </div>
  )
}
