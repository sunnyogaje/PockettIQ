import Link from "next/link"
import { requireAdmin } from "@/server/auth/require-user"
import { Logo } from "@/components/design-system/logo"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Logo />
          </Link>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            Admin
          </span>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Back to app
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</main>
    </div>
  )
}
