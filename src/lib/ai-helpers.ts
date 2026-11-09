import type { ProjectData, GeneratedAsset, AssetCategory, CompetitorData, MarketResearchData } from './types'
import { spark } from './standalone'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const chunks: string[] = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const text = content.items.map((item) => ('str' in item ? (item as { str: string }).str : '')).join(' ')
    chunks.push(text)
  }
  return chunks.join('\n\n')
}

/**
 * Parse model JSON leniently. Some OpenAI-compatible providers ignore
 * response_format=json_object and wrap the answer in ```json fences or
 * add prose around it — a plain JSON.parse then throws and the import
 * fails with no useful message. Strip fences and take the first {...}.
 */
export function parseModelJson<T>(result: string): T {
  const cleaned = result.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Model did not return JSON. Response began: ${cleaned.slice(0, 200)}`)
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T
}

function buildExtractPrompt(document: string) {
  return spark.llmPrompt`You are analyzing a business document to extract structured information.

Document content:
${document}

Extract the following information if present:
- Company name
- Tagline or mission statement
- Problem being solved
- Solution offered
- Unique value proposition
- Target market
- Customer persona
- Market size information
- Revenue model
- Pricing strategy

Return a JSON object with these fields (use empty strings for missing information):
{
  "companyName": "",
  "tagline": "",
  "problem": "",
  "solution": "",
  "uniqueValue": "",
  "targetMarket": "",
  "customerPersona": "",
  "marketSize": "",
  "revenueModel": "",
  "pricing": ""
}`
}

export async function extractProjectDataFromDocument(document: string): Promise<Partial<ProjectData>> {
  try {
    const result = await spark.llm(buildExtractPrompt(document), undefined, true)
    return parseModelJson<Partial<ProjectData>>(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    // Long documents + a small-context model/provider = a context-length
    // failure. Retry once on the opening of the document, which is where
    // company, problem and solution almost always live, rather than
    // failing outright on a full technical paper.
    const isContextError = /context|token|too long|maximum context|413|400/.test(message)
    if (!isContextError || document.length <= 20000) throw error
    const truncated = document.slice(0, 20000) + '\n\n[Document truncated for extraction: only the opening section was sent.]'
    const result = await spark.llm(buildExtractPrompt(truncated), undefined, true)
    return parseModelJson<Partial<ProjectData>>(result)
  }
}

export async function generateAsset(
  project: ProjectData,
  category: AssetCategory
): Promise<string> {
  const prompts: Record<AssetCategory, string> = {
    'logo': spark.llmPrompt`Generate a logo design document for ${project.companyName}.

Company Details:
- Name: ${project.companyName}
- Tagline: ${project.tagline}
- Solution: ${project.solution}
- Brand Vibe: ${project.brandVibe}

Create a detailed logo design document including:
1. Logo Concept (the primary mark, and what it symbolises)
2. Three Logo Directions (each with a description a designer could draw from)
3. Construction & Geometry (shapes, proportions, grid)
4. Color Variants (primary, monochrome, reversed)
5. Typography Pairing for the wordmark
6. Clearspace, Minimum Size & Usage Rules (do / do not)
7. Favicon & App Icon Adaptation

Describe the mark in words precisely enough to reproduce it; do not claim an SVG file has been delivered unless one is attached. Format as a professional document with clear sections.`,

    'brand': spark.llmPrompt`Generate a comprehensive brand identity guide for ${project.companyName}.

Company Details:
- Name: ${project.companyName}
- Tagline: ${project.tagline}
- Solution: ${project.solution}
- Brand Vibe: ${project.brandVibe}

Create a detailed brand identity guide including:
1. Brand Story & Positioning
2. Color Palette (with hex codes)
3. Typography System
4. Logo Application (how the mark from the separate Logo Design document is used — do not invent a second, conflicting logo)
5. Visual Style Guidelines
6. Voice & Tone
7. Brand Applications (business cards, social media, etc.)

Format as a professional document with clear sections.`,

    'market': spark.llmPrompt`Generate a comprehensive market intelligence report for ${project.companyName}.

Company Details:
- Solution: ${project.solution}
- Target Market: ${project.targetMarket}
- Customer Persona: ${project.customerPersona}
- Market Size: ${project.marketSize}

Create a detailed market analysis including:
1. Total Addressable Market (TAM)
2. Serviceable Addressable Market (SAM)
3. Serviceable Obtainable Market (SOM)
4. Customer Personas (2-3 detailed profiles)
5. Market Trends & Drivers
6. Demand Signals & Validation
7. Market Entry Strategy

Include specific numbers, research-backed insights, and actionable recommendations. For every TAM/SAM/SOM figure, name its source (publisher and year) or explicitly mark it as an estimate with no source cited. Do not invent a citation, author, URL, or DOI.`,

    'competition': spark.llmPrompt`Generate a competitive analysis for ${project.companyName}.

Company Details:
- Solution: ${project.solution}
- Unique Value: ${project.uniqueValue}
- Target Market: ${project.targetMarket}

Create a comprehensive competitive analysis including:
1. Competitor Landscape (identify 5-7 key competitors)
2. Competitive Positioning Matrix
3. Feature Comparison
4. Pricing Comparison
5. SWOT Analysis (for each major competitor and our company)
6. Market Gaps & Opportunities
7. Differentiation Strategy

Be specific and realistic in competitor identification.`,

    'business-plan': spark.llmPrompt`Generate a professional business plan for ${project.companyName}.

Company Details:
- Name: ${project.companyName}
- Tagline: ${project.tagline}
- Problem: ${project.problem}
- Solution: ${project.solution}
- Unique Value: ${project.uniqueValue}
- Revenue Model: ${project.revenueModel}

Create a comprehensive 15-page business plan including:
1. Executive Summary
2. Company Overview
3. Problem & Solution
4. Product/Service Description
5. Operations Plan
6. Management Team (placeholder structure)
7. Milestones & Roadmap (12-month)
8. Key Performance Indicators
9. Risk Analysis & Mitigation
10. Success Metrics

Format professionally with clear sections and actionable details.`,

    'financials': spark.llmPrompt`Generate detailed financial projections for ${project.companyName}.

Company Details:
- Revenue Model: ${project.revenueModel}
- Pricing: ${project.pricing}
- Target Market: ${project.targetMarket}
- Market Size: ${project.marketSize}

Create comprehensive financial projections including:
1. Startup Costs Breakdown
2. Revenue Projections (12-month, monthly detail)
3. Cost Structure & Operating Expenses
4. Break-Even Analysis
5. Customer Acquisition Cost (CAC)
6. Lifetime Value (LTV)
7. Unit Economics
8. Cash Flow Projections
9. Key Financial Metrics & Ratios
10. Funding Requirements

Use realistic assumptions and show your calculations. State the period for every price (one-time, monthly, or annual) and list every assumption behind CAC, LTV, costs, and customer counts. Mark any figure not supplied in the project as an assumption, not a fact.`,

    'marketing': spark.llmPrompt`Generate a comprehensive marketing strategy for ${project.companyName}.

Company Details:
- Solution: ${project.solution}
- Target Market: ${project.targetMarket}
- Customer Persona: ${project.customerPersona}
- Unique Value: ${project.uniqueValue}

Create a detailed marketing plan including:
1. 30-Day Launch Calendar (daily activities)
2. Channel Strategy (prioritized list)
3. SEO Keywords (20+ high-value targets)
4. Content Strategy
5. Ad Copy Variations (5 for each major platform)
6. Email Sequences (welcome, nurture, conversion)
7. Social Media Strategy
8. Partnership & PR Opportunities
9. Growth Tactics
10. Budget Allocation

Be specific and actionable with real tactics.`,

    'pitch-deck': spark.llmPrompt`Generate a compelling investor pitch deck for ${project.companyName}.

Company Details:
- Name: ${project.companyName}
- Tagline: ${project.tagline}
- Problem: ${project.problem}
- Solution: ${project.solution}
- Unique Value: ${project.uniqueValue}
- Target Market: ${project.targetMarket}
- Revenue Model: ${project.revenueModel}

Create a 10-12 slide pitch deck with:
1. Cover (company name, tagline)
2. Problem (the pain point)
3. Solution (how you solve it)
4. Market Opportunity (size & potential)
5. Product/Service (key features)
6. Business Model (how you make money)
7. Traction (achievements, milestones)
8. Competition (positioning)
9. Go-to-Market Strategy
10. Financial Projections (3-year)
11. Team (placeholder structure)
12. Ask (funding needs & use of funds)

For each slide, provide:
- Slide Title
- Key Points (bullet form)
- Speaker Notes (what to say)
- Visual Suggestions

Make it compelling and investor-ready.`,

    'legal': spark.llmPrompt`Generate legal and compliance templates for ${project.companyName}.

Company Details:
- Name: ${project.companyName}
- Solution: ${project.solution}
- Revenue Model: ${project.revenueModel}

Create comprehensive legal documentation including:
1. Privacy Policy (GDPR & CCPA compliant)
2. Terms of Service
3. Acceptable Use Policy
4. Cookie Policy
5. Data Processing Agreement
6. Refund Policy
7. Disclaimer Notices
8. Copyright & IP Protection

Also include:
9. 30 Days of Social Media Captions (varied themes)
10. Hashtag Strategy (20+ relevant hashtags)
11. Social Media Content Calendar

Format professionally with proper legal language where appropriate.`,

    'sources': spark.llmPrompt`Generate a Sources & Citations document for ${project.companyName}.

Company Details:
- Name: ${project.companyName}
- Tagline: ${project.tagline}
- Solution: ${project.solution}
- Target Market: ${project.targetMarket}
- Market Size: ${project.marketSize}
- Revenue Model: ${project.revenueModel}
- Pricing: ${project.pricing}

This document is the pack's audit trail. It must not invent authority it does not have.

Create:
1. What came from the project itself (company, problem, solution, target market, revenue model, pricing as supplied — list only what was actually supplied above, and say "not supplied" where a field is empty)
2. Market sources: for TAM/SAM/SOM and trend claims, name the source (publisher and year) where one exists; where none exists, write "No source cited — estimate, verify before external use"
3. Competitive sources: sources for competitor pricing, features, and positioning, or "No source cited" where none exists
4. Regulatory sources: the official source for any EU AI Act, GDPR, CCPA, HIPAA, or other compliance claim made in the pack, or "No source cited" where none exists
5. Financial assumptions: every pricing period, customer count, CAC, cost, and churn assumption in the pack, marked as assumption unless the project supplied it
6. What still needs verifying before this pack is shown to investors, customers, or lawyers (a short checklist)

Hard rule: do not invent a citation, author, publication, URL, DOI, report title, or date. A missing source is written as missing, never filled with a plausible-sounding one.`,
  }

  const prompt = prompts[category]
  const result = await spark.llm(prompt, undefined, false)
  return result
}

export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateAssetId(): string {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateShareId(): string {
  return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function conductMarketResearch(project: ProjectData): Promise<MarketResearchData> {
  const prompt = spark.llmPrompt`You are a market research analyst conducting comprehensive research.

Company Details:
- Name: ${project.companyName}
- Solution: ${project.solution}
- Target Market: ${project.targetMarket}
- Market Size: ${project.marketSize}

Conduct deep market research and return a JSON object with:
{
  "trends": ["trend 1", "trend 2", ...] (5-7 current market trends),
  "opportunities": ["opportunity 1", ...] (5-7 market opportunities),
  "threats": ["threat 1", ...] (3-5 potential threats),
  "demandSignals": ["signal 1", ...] (5-7 demand indicators),
  "industryInsights": ["insight 1", ...] (5-7 key insights)
}

Be specific, data-driven, and actionable.`

  const result = await spark.llm(prompt, undefined, true)
  return parseModelJson<MarketResearchData>(result)
}

export async function analyzeCompetition(project: ProjectData): Promise<CompetitorData[]> {
  const prompt = spark.llmPrompt`You are a competitive intelligence analyst researching competitors.

Company Details:
- Name: ${project.companyName}
- Solution: ${project.solution}
- Unique Value: ${project.uniqueValue}
- Target Market: ${project.targetMarket}

Identify and analyze 5-7 real or realistic competitors. Return a JSON object with:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "description": "What they do",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "pricing": "Pricing model/tiers",
      "targetMarket": "Their target market",
      "url": "website if known or realistic"
    }
  ]
}

Be specific and realistic about competitor capabilities.`

  const result = await spark.llm(prompt, undefined, true)
  const parsed = parseModelJson<{ competitors: CompetitorData[] }>(result)
  return parsed.competitors
}

export function exportAsMarkdown(project: ProjectData, assets: GeneratedAsset[], paid: boolean = false): string {
  let markdown = `# ${project.companyName}\n\n`
  markdown += `**${project.tagline}**\n\n`
  if (!paid) {
    markdown += `> *Free preview exported with LaunchKit — buy a pack at https://or4cl3-ai-1.github.io/launchkit/ for the clean, investor-ready version.*\n\n`
  }
  markdown += `---\n\n`
  markdown += `## Project Overview\n\n`
  markdown += `**Created:** ${new Date(project.createdAt).toLocaleDateString()}\n`
  markdown += `**Brand Vibe:** ${project.brandVibe}\n\n`
  
  markdown += `### Problem\n${project.problem}\n\n`
  markdown += `### Solution\n${project.solution}\n\n`
  markdown += `### Unique Value\n${project.uniqueValue}\n\n`
  
  markdown += `---\n\n`
  
  for (const asset of assets) {
    markdown += `## ${asset.title}\n\n`
    markdown += `${asset.content}\n\n`
    markdown += `---\n\n`
  }
  
  return markdown
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
