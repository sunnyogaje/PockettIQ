"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordInput } from "@/server/validation/auth"
import { resetPasswordAction } from "@/server/actions/auth"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/design-system/password-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token ?? "", password: "" },
  })

  async function onSubmit(values: ResetPasswordInput) {
    setSubmitting(true)
    setFormError(null)
    const result = await resetPasswordAction(values)
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }
    setDone(true)
  }

  if (!token) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          This reset link is missing or invalid. Request a new one from the{" "}
          <Link href="/forgot-password" className="font-medium text-primary underline-offset-4 hover:underline">
            forgot password
          </Link>{" "}
          page.
        </CardContent>
      </Card>
    )
  }

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <CheckCircle2 className="size-10 text-primary" />
          <p className="font-medium">Password updated</p>
          <p className="text-sm text-muted-foreground">
            You can now log in with your new password.
          </p>
          <Button className="mt-2 w-full" onClick={() => router.push("/login")}>
            Go to login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Choose a new password</CardTitle>
        <CardDescription>Make it something you don&apos;t use elsewhere.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
