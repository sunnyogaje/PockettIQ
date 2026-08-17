"use client"

import * as React from "react"
import Link from "next/link"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isStandalone, isIOS, wasRecentlyDismissed, markInstallDismissed } from "@/lib/pwa"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = React.useState(false)
  const [variant, setVariant] = React.useState<"android" | "ios" | null>(null)

  React.useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return

    if (isIOS()) {
      setVariant("ios")
      setVisible(true)
      return
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVariant("android")
      setVisible(true)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
  }, [])

  function dismiss() {
    markInstallDismissed()
    setVisible(false)
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  if (!visible || !variant) return null

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border bg-accent px-4 py-3 text-accent-foreground">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background">
        <Download className="size-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Install PockettIQ</p>
        <p className="text-sm opacity-90">
          Get faster access to your money dashboard directly from your home screen.
        </p>
        <div className="mt-2">
          {variant === "android" ? (
            <Button size="sm" onClick={install}>
              Install PockettIQ
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href="/install">See how</Link>
            </Button>
          )}
        </div>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-full p-1 text-accent-foreground/70 hover:bg-background/50"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
