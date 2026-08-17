"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/design-system/logo"
import { SIDEBAR_NAV } from "@/components/design-system/nav-config"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-6 lg:flex">
      <Link href="/dashboard" className="px-2">
        <Logo />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {SIDEBAR_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4.5" strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
