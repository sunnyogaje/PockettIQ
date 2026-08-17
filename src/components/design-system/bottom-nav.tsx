"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BOTTOM_NAV } from "@/components/design-system/nav-config"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t bg-background/95 backdrop-blur lg:hidden">
      {BOTTOM_NAV.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
