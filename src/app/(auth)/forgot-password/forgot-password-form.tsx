"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/server/validation/auth"
import { forgotPasswordAction } from "@/server/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordInput) {
    setSubmitting(true)
    await forgotPasswordAction(values)
    setSubmitting(false)
    setSent(true)
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <CheckCircle2 className="size-10 text-primary" />
          <p className="font-medium">Check your email</p>
          <p className="text-sm text-muted-foreground">
            If an account exists for {form.getValues("email")}, we&apos;ve sent a link to
            reset your password.
          </p>
          <Link href="/login" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>We&apos;ll email you a link to choose a new one.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
