import { adProvider, type AdPlacement } from "@/lib/ads"
import { cn } from "@/lib/utils"

/**
 * Renders nothing for premium users. For free users, renders the real ad
 * network's unit if `adProvider` has one configured for this placement,
 * otherwise a clearly-labeled placeholder — never a fake/misleading ad.
 */
export function AdPlaceholder({
  placement,
  isPremium,
  className,
}: {
  placement: AdPlacement
  isPremium: boolean
  className?: string
}) {
  if (isPremium) return null

  const slotId = adProvider.getSlotId(placement)
  if (slotId) {
    // Real provider integration would render its SDK component here, keyed
    // by slotId — left unimplemented until a network is contracted.
    return null
  }

  return (
    <div
      className={cn(
        "flex h-16 items-center justify-center rounded-xl border border-dashed text-xs font-medium tracking-wide text-muted-foreground",
        className
      )}
      data-slot="ad-placeholder"
      aria-label="Advertisement"
    >
      ADVERTISEMENT
    </div>
  )
}
