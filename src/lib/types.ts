export type BrandVibe = 'minimal' | 'bold' | 'luxury' | 'tech' | 'rebel'

export interface ProjectData {
  id: string
  createdAt: string
  updatedAt: string
  
  companyName: string
  tagline: string
  
  problem: string
  solution: string
  uniqueValue: string
  
  targetMarket: string
  customerPersona: string
  marketSize: string
  
  revenueModel: string
  pricing: string
  
  brandVibe: BrandVibe
  
  status: 'draft' | 'generating' | 'complete'
  shareId?: string
  isPublic?: boolean
}

export interface GeneratedAsset {
  id: string
  category: AssetCategory
  title: string
  content: string
  createdAt: string
}

export type AssetCategory = 
  | 'brand'
  | 'market'
  | 'competition'
  | 'business-plan'
  | 'financials'
  | 'marketing'
  | 'pitch-deck'
  | 'legal'

export interface VibeOption {
  id: BrandVibe
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fontPairing: string
}

export interface CompetitorData {
  name: string
  description: string
  strengths: string[]
  weaknesses: string[]
  pricing: string
  targetMarket: string
  url?: string
}

export interface MarketResearchData {
  trends: string[]
  opportunities: string[]
  threats: string[]
  demandSignals: string[]
  industryInsights: string[]
}
