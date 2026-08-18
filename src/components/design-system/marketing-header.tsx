import Link from "next/link"
import { Logo } from "@/components/design-system/logo"
import { Button } from "@/components/ui/button"

export function MarketingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
        <Link href="/features" className="hover:text-foreground">Features</Link>
        <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
        <Link href="/about" className="hover:text-foreground">About</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Get started</Link>
        </Button>
      </div>
    </header>
  )
}
