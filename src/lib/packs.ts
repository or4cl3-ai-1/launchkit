import { useKV } from '@/lib/standalone'
import type { AssetCategory } from './types'
import { ASSET_CATEGORIES } from './constants'

/**
 * Sellable packs. Prices are one-time (USD).
 *
 * Stripe Payment Links go in `stripeLink` (created in the Stripe dashboard —
 * see STRIPE_SETUP.md). Each link must redirect after payment to:
 *   https://or4cl3-ai-1.github.io/launchkit/?purchased=<pack-id>
 * The app picks up the `purchased` query param and unlocks the pack locally.
 *
 * v1 honesty note: the unlock is a local flag set from Stripe's success
 * redirect. A technical user could visit the success URL directly. That is
 * acceptable for first dollars; when volume justifies it, add a tiny backend
 * that verifies Stripe webhook signatures and issues license keys.
 */

export interface Pack {
  id: string
  name: string
  tagline: string
  priceUSD: number
  categories: AssetCategory[]
  stripeLink: string
  featured?: boolean
}

export const PACKS: Pack[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'The "Side Hustle" pack',
    priceUSD: 49,
    categories: ['brand', 'business-plan', 'marketing'],
    stripeLink: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'The "Founder" pack',
    priceUSD: 99,
    categories: ['brand', 'business-plan', 'marketing', 'market', 'competition', 'financials'],
    stripeLink: '',
    featured: true,
  },
  {
    id: 'complete',
    name: 'Complete',
    tagline: 'The "CEO" pack',
    priceUSD: 199,
    categories: ['brand', 'business-plan', 'marketing', 'market', 'competition', 'financials', 'pitch-deck', 'legal'],
    stripeLink: '',
  },
  {
    id: 'refresh',
    name: 'Refresh',
    tagline: 'Pivoted? Re-export your updated pack',
    priceUSD: 29,
    categories: ['brand', 'business-plan', 'marketing'],
    stripeLink: '',
  },
]

export function getPack(id: string | null | undefined): Pack | undefined {
  return PACKS.find((p) => p.id === id)
}

export function categoryName(cat: AssetCategory): string {
  return ASSET_CATEGORIES[cat]?.name ?? cat
}

const PURCHASES_KEY = 'purchased-packs'

export function usePurchases() {
  const [purchased, setPurchased] = useKV<Record<string, boolean>>(PURCHASES_KEY, {})

  const owned = purchased || {}

  const hasPack = (id: string): boolean => !!owned[id]

  const addPurchase = (id: string) => {
    setPurchased({ ...owned, [id]: true })
  }

  /** All asset categories the buyer may export cleanly. */
  const exportableCategories = (): AssetCategory[] => {
    const set = new Set<AssetCategory>()
    for (const pack of PACKS) {
      if (owned[pack.id]) pack.categories.forEach((c) => set.add(c))
    }
    return [...set]
  }

  /**
   * Cheapest non-refresh pack that covers every category in `cats`
   * the buyer cannot already export. Null when nothing is missing.
   */
  const cheapestPackFor = (cats: AssetCategory[]): Pack | null => {
    const exportable = exportableCategories()
    const missing = cats.filter((c) => !exportable.includes(c))
    if (missing.length === 0) return null
    for (const pack of PACKS) {
      if (pack.id === 'refresh') continue
      if (missing.every((c) => pack.categories.includes(c))) return pack
    }
    return getPack('complete') ?? null
  }

  return { purchased: owned, hasPack, addPurchase, exportableCategories, cheapestPackFor }
}
