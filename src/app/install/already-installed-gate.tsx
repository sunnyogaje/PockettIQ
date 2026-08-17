"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { isStandalone } from "@/lib/pwa"

export function AlreadyInstalledGate({ children }: { children: React.ReactNode }) {
  const [standalone, setStandalone] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    setStandalone(isStandalone())
  }, [])

  // Avoid a flash of the wrong state before we know: render nothing extra
  // until the check resolves, then show install instructions (default) or
  // the "already installed" message.
  if (standalone === null) return <>{children}</>

  if (standalone) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border py-12 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <div>
          <p className="font-medium">PockettIQ is already installed</p>
          <p className="text-sm text-muted-foreground">You&apos;re using the installed app.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
