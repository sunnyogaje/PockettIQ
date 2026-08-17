"use client"

const DISMISS_KEY = "pockettiq_install_dismissed_at"
const DISMISS_COOLDOWN_DAYS = 14

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari's legacy standalone flag
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window)
}

export function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false
  const raw = window.localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const dismissedAt = Number(raw)
  if (Number.isNaN(dismissedAt)) return false
  const cooldownMs = DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
  return Date.now() - dismissedAt < cooldownMs
}

export function markInstallDismissed(): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
}
