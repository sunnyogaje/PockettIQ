"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/server/actions/auth"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function onLogout() {
    setLoading(true)
    await logoutAction()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button variant="outline" className="w-full justify-start" onClick={onLogout} disabled={loading}>
      <LogOut className="size-4" />
      {loading ? "Logging out…" : "Log out"}
    </Button>
  )
}
