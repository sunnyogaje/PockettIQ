export type AdPlacement = "dashboard-banner" | "transactions-banner" | "reports-banner"

export interface AdProvider {
  /** Whether this provider has a real ad unit configured for a placement. */
  isConfigured(placement: AdPlacement): boolean
  /** Renders as inert metadata only — the actual DOM comes from the provider's SDK/component. */
  getSlotId(placement: AdPlacement): string | null
}

/**
 * Development/default provider — no real ad network wired up. Swap this
 * export for a real provider (Google AdSense/AdMob or another network) once
 * the app qualifies for that provider's policies; every call site only
 * depends on the AdProvider interface, not this implementation.
 */
class PlaceholderAdProvider implements AdProvider {
  isConfigured(): boolean {
    return false
  }
  getSlotId(): string | null {
    return null
  }
}

export const adProvider: AdProvider = new PlaceholderAdProvider()
