import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  Repeat,
  BarChart3,
  Bell,
  Settings,
  Home,
  MoreHorizontal,
} from "lucide-react"

export const SIDEBAR_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/goals", label: "Savings Goals", icon: PiggyBank },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

export const BOTTOM_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/goals", label: "Goals", icon: PiggyBank },
  { href: "/more", label: "More", icon: MoreHorizontal },
] as const
