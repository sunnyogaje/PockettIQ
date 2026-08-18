import Link from "next/link"
import { Logo } from "@/components/design-system/logo"

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/install", label: "Install" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

export function MarketingFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
      <div className="flex flex-col items-center gap-6 border-t pt-8 sm:flex-row sm:justify-between">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground sm:text-left">
        © {new Date().getFullYear()} PockettIQ. Not a bank. PockettIQ does not hold your
        money, transfer funds, or provide loans — it helps you track and plan.
      </p>
    </footer>
  )
}
