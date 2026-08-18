"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { mockUpgradeToPremiumAction } from "@/server/actions/subscriptions"

export function UpgradeButton({
  loggedIn,
  isPremium,
}: {
  loggedIn: boolean
  isPremium: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  if (!loggedIn) {
    return (
      <Button size="lg" className="w-full" onClick={() => router.push("/register")}>
        Get Started
      </Button>
    )
  }

  if (isPremium) {
    return (
      <Button size="lg" className="w-full" disabled>
        You&apos;re on Premium
      </Button>
    )
  }

  async function onUpgrade() {
    setLoading(true)
    const result = await mockUpgradeToPremiumAction()
    setLoading(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Welcome to Premium!")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Button size="lg" className="w-full" onClick={onUpgrade} disabled={loading}>
      {loading ? "Upgrading…" : "Upgrade to Premium"}
    </Button>
  )
}
