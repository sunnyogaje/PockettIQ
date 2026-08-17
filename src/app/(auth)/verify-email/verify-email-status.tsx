"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { verifyEmailAction } from "@/server/actions/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Status = "verifying" | "success" | "already" | "error"

export function VerifyEmailStatus({ token }: { token: string | null }) {
  const [status, setStatus] = React.useState<Status>(token ? "verifying" : "error")
  const [message, setMessage] = React.useState<string>(
    token ? "" : "This verification link is missing a token."
  )

  React.useEffect(() => {
    if (!token) return
    let active = true

    verifyEmailAction(token).then((result) => {
      if (!active) return
      if (result.ok) {
        setStatus("success")
      } else if ("alreadyVerified" in result) {
        setStatus("already")
        setMessage(result.error)
      } else {
        setStatus("error")
        setMessage(result.error)
      }
    })

    return () => {
      active = false
    }
  }, [token])

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="size-10 animate-spin text-muted-foreground" />
            <p className="font-medium">Verifying your email…</p>
          </>
        )}
        {(status === "success" || status === "already") && (
          <>
            <CheckCircle2 className="size-10 text-primary" />
            <p className="font-medium">
              {status === "success" ? "Email verified" : "Already verified"}
            </p>
            <p className="text-sm text-muted-foreground">
              {status === "success"
                ? "Thanks for confirming your email address."
                : message}
            </p>
            <Button asChild className="mt-2 w-full">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="size-10 text-destructive" />
            <p className="font-medium">Verification failed</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
