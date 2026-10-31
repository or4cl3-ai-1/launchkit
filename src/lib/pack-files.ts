import type { AssetCategory, GeneratedAsset, ProjectData } from './types'
import { ASSET_CATEGORIES, VIBE_OPTIONS } from './constants'
import { exportAsMarkdown } from './ai-helpers'

/**
 * The 12-file pack: README + a stitched master plan + one file per
 * deliverable, including Sources & Citations as file 10.
 *
 * A full (Complete) generation must produce all 12. A partial / legacy
 * project (e.g. generated before the Logo or Sources categories
 * existed) produces fewer section files — `buildPackFiles` never
 * invents a missing section's claims, except for two derived
 * fallbacks that say so on their face: Logo from a legacy Brand
 * asset (see `logoFallbackContent`), and Sources as an explicit
 * source-status checklist (see `sourcesFallbackContent`).
 */
export interface PackFile {
  filename: string
  content: string
}

export const PACK_CATEGORY_ORDER: AssetCategory[] = [
  'logo',
  'brand',
  'market',
  'competition',
  'business-plan',
  'financials',
  'marketing',
  'pitch-deck',
  'legal',
  'sources',
]

export const PACK_CATEGORY_FILES: Record<AssetCategory, string> = {
  logo: '01_logo_design.md',
  brand: '02_brand_identity.md',
  market: '03_market_intel.md',
  competition: '04_competitive_analysis.md',
  'business-plan': '05_business_plan.md',
  financials: '06_financial_projections.md',
  marketing: '07_marketing_strategy.md',
  'pitch-deck': '08_pitch_deck.md',
  legal: '09_legal_&_social.md',
  sources: '10_sources_and_citations.md',
}

export const PACK_MASTER_FILE = '00_full_master_business_plan.md'
export const PACK_README_FILE = 'README.md'

/** Filenames in pack order, for a project with every section present. */
export const FULL_PACK_FILENAMES: string[] = [
  PACK_README_FILE,
  PACK_MASTER_FILE,
  ...PACK_CATEGORY_ORDER.map((c) => PACK_CATEGORY_FILES[c]),
]

export function slugifyCompanyName(name: string): string {
  return (name || 'launchkit')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'launchkit'
}

/** Sort assets into pack order so the master plan reads 01 -> 09. */
export function sortAssetsForPack(assets: GeneratedAsset[]): GeneratedAsset[] {
  const order = new Map(PACK_CATEGORY_ORDER.map((c, i) => [c, i]))
  return [...assets].sort(
    (a, b) => (order.get(a.category) ?? 99) - (order.get(b.category) ?? 99),
  )
}

/**
 * Derive a Logo file from a legacy Brand asset (projects generated
 * before 'logo' was a category). Prefers the Brand asset's own Logo
 * section, if it has one; otherwise builds a short brief from the
 * project and its brand vibe. Returns null when there is no Brand
 * asset to derive from — a missing section stays missing.
 */
export function logoFallbackContent(
  project: ProjectData,
  brandAsset?: GeneratedAsset,
): string | null {
  if (!brandAsset) return null
  const content = brandAsset.content || ''
  // Extract a "Logo ..." section (## Logo ... up to the next ## heading).
  const logoSection = content.match(
    /(^|\n)#{1,3}\s+[^\n]*logo[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\s*$)/i,
  )
  const vibe = VIBE_OPTIONS.find((v) => v.id === project.brandVibe)
  const header =
    `# Logo Design: ${project.companyName}\n\n` +
    `*Derived from the Brand Identity asset for a project generated before Logo was a separate deliverable.*\n\n`
  if (logoSection) {
    return `${header}${logoSection[0].trim()}\n`
  }
  return (
    `${header}` +
    `**Tagline:** ${project.tagline || '—'}\n\n` +
    `**Solution:** ${project.solution || '—'}\n\n` +
    `**Brand Vibe:** ${project.brandVibe}${vibe ? ` — ${vibe.description}` : ''}\n\n` +
    `**Wordmark pairing:** ${vibe ? vibe.fontPairing : '—'}\n\n` +
    `Use the mark described in the Brand Identity document; do not invent a second, conflicting logo.\n`
  )
}

/**
 * Export-time Sources file for legacy projects (generated before
 * 'sources' was a category). This is not a researched source list —
 * it says so on its face. It records what came from the project,
 * what LaunchKit researched and wrote, and what must be verified,
 * so a legacy pack still ships a 12th file without pretending to
 * have citations it does not have.
 */
export function sourcesFallbackContent(project: ProjectData): string {
  const supplied = [
    ['Company name', project.companyName],
    ['Tagline', project.tagline],
    ['Problem', project.problem],
    ['Solution', project.solution],
    ['Unique value', project.uniqueValue],
    ['Target market', project.targetMarket],
    ['Customer persona', project.customerPersona],
    ['Market size', project.marketSize],
    ['Revenue model', project.revenueModel],
    ['Pricing', project.pricing],
  ]
  const lines = [
    `# Sources & Citations: ${project.companyName}`,
    ``,
    `*Export-time source-status file for a project generated before Sources was a separate deliverable. This file does not claim citations the pack does not contain.*`,
    ``,
    `## What came from the project itself`,
    ``,
  ]
  for (const [label, value] of supplied) {
    lines.push(`- **${label}:** ${value ? value : 'Not supplied'}`)
  }
  lines.push(
    ``,
    `## What LaunchKit researched and wrote`,
    ``,
    `- Market, competitive, financial, marketing, pitch, and legal sections were researched and written by LaunchKit from the project above, not copied from an input document.`,
    `- Any source named inside those sections is that section's source. Any figure with no source named in its section should be treated as an estimate.`,
    ``,
    `## What still needs verifying before external use`,
    ``,
    `- TAM / SAM / SOM figures and their sources and years`,
    `- Pricing periods (one-time / monthly / annual), customer counts, CAC, costs, and churn — and whether the arithmetic links together`,
    `- Competitor pricing and features`,
    `- Regulatory compliance claims (EU AI Act, GDPR, CCPA, HIPAA, and any others named in the pack)`,
    `- Legal templates — templates, not legal advice`,
    ``,
    `Do not present a figure from this pack as verified until its source has been checked.`,
  )
  return lines.join('\n')
}

function readmeContent(project: ProjectData, files: PackFile[]): string {
  const lines = [
    `# Welcome to your ${project.companyName} Workspace Bundle!`,
    ``,
    `This pack contains your fully constructed launch plan, generated by LaunchKit.`,
    ``,
    `### What's Included:`,
    ``,
  ]
  for (const file of files) {
    if (file.filename === PACK_README_FILE) continue
    const category = PACK_CATEGORY_ORDER.find(
      (c) => PACK_CATEGORY_FILES[c] === file.filename,
    )
    const label = category
      ? ASSET_CATEGORIES[category].name
      : file.filename === PACK_MASTER_FILE
        ? 'Stitched master business plan combining all generated content'
        : file.filename
    lines.push(`- **${file.filename}**: ${label}.`)
  }
  lines.push(
    ``,
    `AI-drafted, not final. Review and edit before showing it to investors, customers, or lawyers, and verify any market or financial figures before putting them in front of money.`,
    ``,
    `— LaunchKit`,
  )
  return lines.join('\n')
}

/**
 * Build the pack files for the given assets. Always includes README
 * and the stitched master plan; includes one file per asset present,
 * plus a derived Logo file for legacy Brand-only projects and an
 * export-time Sources checklist for legacy pre-Sources projects.
 * A project with all 10 categories therefore yields exactly 12 files.
 */
export function buildPackFiles(
  project: ProjectData,
  assets: GeneratedAsset[],
): PackFile[] {
  const sorted = sortAssetsForPack(assets)
  const byCategory = new Map(sorted.map((a) => [a.category, a]))

  const sectionFiles: PackFile[] = []
  for (const category of PACK_CATEGORY_ORDER) {
    const asset = byCategory.get(category)
    if (asset) {
      sectionFiles.push({
        filename: PACK_CATEGORY_FILES[category],
        content: asset.content,
      })
    } else if (category === 'logo') {
      const fallback = logoFallbackContent(project, byCategory.get('brand'))
      if (fallback) {
        sectionFiles.push({ filename: PACK_CATEGORY_FILES.logo, content: fallback })
      }
    } else if (category === 'sources') {
      sectionFiles.push({
        filename: PACK_CATEGORY_FILES.sources,
        content: sourcesFallbackContent(project),
      })
    }
  }

  const files: PackFile[] = [
    // README is filled in last, once the file list is known.
    { filename: PACK_README_FILE, content: '' },
    {
      filename: PACK_MASTER_FILE,
      content: exportAsMarkdown(project, sorted, true),
    },
    ...sectionFiles,
  ]
  files[0].content = readmeContent(project, files)
  return files
}

/** Filenames the given assets would produce, in pack order. */
export function packFilenamesFor(
  project: ProjectData,
  assets: GeneratedAsset[],
): string[] {
  return buildPackFiles(project, assets).map((f) => f.filename)
}

/** The 12 filenames a full generation is missing, if any. */
export function missingPackFilenames(
  project: ProjectData,
  assets: GeneratedAsset[],
): string[] {
  const have = new Set(packFilenamesFor(project, assets))
  return FULL_PACK_FILENAMES.filter((f) => !have.has(f))
}
