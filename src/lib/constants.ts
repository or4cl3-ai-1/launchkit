import type { VibeOption, AssetCategory } from './types'

export const VIBE_OPTIONS: VibeOption[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean lines, ample whitespace, understated elegance',
    colors: {
      primary: 'oklch(0.25 0.01 260)',
      secondary: 'oklch(0.95 0.005 260)',
      accent: 'oklch(0.40 0.01 260)',
    },
    fontPairing: 'Inter + Inter',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Vibrant colors, strong contrasts, confident energy',
    colors: {
      primary: 'oklch(0.55 0.25 25)',
      secondary: 'oklch(0.20 0.05 260)',
      accent: 'oklch(0.75 0.20 120)',
    },
    fontPairing: 'Space Grotesk + Inter',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Refined details, premium finishes, sophisticated presence',
    colors: {
      primary: 'oklch(0.15 0.02 270)',
      secondary: 'oklch(0.65 0.08 50)',
      accent: 'oklch(0.80 0.10 80)',
    },
    fontPairing: 'Playfair Display + Inter',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Precise geometry, digital aesthetics, innovation-forward',
    colors: {
      primary: 'oklch(0.45 0.18 250)',
      secondary: 'oklch(0.20 0.02 260)',
      accent: 'oklch(0.65 0.22 180)',
    },
    fontPairing: 'JetBrains Mono + Space Grotesk',
  },
  {
    id: 'rebel',
    name: 'Rebel',
    description: 'Unconventional angles, edgy style, disruptive spirit',
    colors: {
      primary: 'oklch(0.35 0.15 340)',
      secondary: 'oklch(0.15 0.03 260)',
      accent: 'oklch(0.70 0.20 60)',
    },
    fontPairing: 'Space Grotesk + JetBrains Mono',
  },
]

export const ASSET_CATEGORIES: Record<AssetCategory, { name: string; icon: string; description: string }> = {
  'brand': {
    name: 'Brand Identity',
    icon: 'Palette',
    description: 'Logo, colors, typography, visual system',
  },
  'market': {
    name: 'Market Intelligence',
    icon: 'ChartBar',
    description: 'TAM/SAM/SOM, personas, demand signals',
  },
  'competition': {
    name: 'Competitive Analysis',
    icon: 'Users',
    description: 'Competitor mapping, SWOT, positioning',
  },
  'business-plan': {
    name: 'Business Plan',
    icon: 'FileText',
    description: 'Executive summary, operations, milestones',
  },
  'financials': {
    name: 'Financial Projections',
    icon: 'CurrencyDollar',
    description: 'Startup costs, P&L, break-even, CAC/LTV',
  },
  'marketing': {
    name: 'Marketing Strategy',
    icon: 'Megaphone',
    description: 'Launch calendar, SEO, ad copy, channels',
  },
  'pitch-deck': {
    name: 'Pitch Deck',
    icon: 'Presentation',
    description: 'Investor-ready slides with speaker notes',
  },
  'legal': {
    name: 'Legal & Compliance',
    icon: 'Scale',
    description: 'Privacy policy, terms of service templates',
  },
}

export const WIZARD_STEPS = [
  { id: 'basics', label: 'Basics', description: 'Company name & mission' },
  { id: 'problem', label: 'Problem/Solution', description: 'What you solve & how' },
  { id: 'market', label: 'Market', description: 'Who & how big' },
  { id: 'revenue', label: 'Revenue', description: 'How you make money' },
  { id: 'vibe', label: 'Brand Vibe', description: 'Visual identity' },
]
