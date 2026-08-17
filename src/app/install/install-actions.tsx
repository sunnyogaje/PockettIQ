"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { isStandalone } from "@/lib/pwa"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function AndroidInstallAction() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = React.useState(false)

  React.useEffect(() => {
    if (isStandalone()) {
      setInstalled(true)
      return
    }
    function onPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", onPrompt)
    return () => window.removeEventListener("beforeinstallprompt", onPrompt)
  }, [])

  if (installed) {
    return <p className="text-sm text-muted-foreground">PockettIQ is already installed. 🎉</p>
  }

  if (deferredPrompt) {
    return (
      <Button
        onClick={async () => {
          await deferredPrompt.prompt()
          await deferredPrompt.userChoice
          setDeferredPrompt(null)
        }}
      >
        Install PockettIQ
      </Button>
    )
  }

  return (
    <p className="text-sm text-muted-foreground">
      Open the browser menu (⋮) in Chrome and tap <strong>Install app</strong> or{" "}
      <strong>Add to Home screen</strong>.
    </p>
  )
}
