import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/design-system/logo"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Your Money. Smarter.
        </h1>
        <p className="mt-4 max-w-md text-balance text-muted-foreground">
          PockettIQ helps you track your spending, manage your budget, and make
          your money last longer.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">Start Managing Your Money</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
