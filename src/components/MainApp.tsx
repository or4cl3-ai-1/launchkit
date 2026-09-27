import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowRight, 
  ArrowLeft, 
  Sparkle, 
  Upload,
  FilePdf,
  CheckCircle,
  Palette,
  ChartBar,
  Users,
  FileText,
  CurrencyDollar,
  Megaphone,
  Presentation,
  Scales,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ProjectData, BrandVibe,  GeneratedAsset, AssetCategory } from '@/lib/types'
import { VIBE_OPTIONS, WIZARD_STEPS, ASSET_CATEGORIES } from '@/lib/constants'
import { generateProjectId, generateAssetId, extractProjectDataFromDocument, extractTextFromPDF, generateAsset } from '@/lib/ai-helpers'
import { useKV } from '@/lib/standalone'
import { getApiKey } from '@/lib/standalone'
import { ApiKeyDialog } from '@/components/ApiKeyDialog'
import { ResearchPanel } from '@/components/ResearchPanel'
import { ExportSharePanel } from '@/components/ExportSharePanel'

interface MainAppProps {
  currentProject: ProjectData | null
  onProjectChange: (project: ProjectData | null) => void
  onReset: () => void
}

export function MainApp({ currentProject, onProjectChange, onReset }: MainAppProps) {
  const [step, setStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [importText, setImportText] = useState('')
  const [assets, setAssets] = useKV<GeneratedAsset[]>('generated-assets', [])
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<AssetCategory | 'research'>('brand')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    companyName: '',
    tagline: '',
    problem: '',
    solution: '',
    uniqueValue: '',
    targetMarket: '',
    customerPersona: '',
    marketSize: '',
    revenueModel: '',
    pricing: '',
    brandVibe: 'tech'
  })

  const requireApiKey = () => {
    if (!getApiKey()) {
      setShowKeyDialog(true)
      toast.error('Add your AI provider API key first — generation uses your own key')
      return false
    }
    return true
  }

  const handleImportDocument = async () => {
    if (!importText.trim()) {
      toast.error('Please paste some content to import')
      return
    }
    if (!requireApiKey()) return

    toast.loading('AI is analyzing your document...')
    
    try {
      const extracted = await extractProjectDataFromDocument(importText)
      setFormData(prev => ({ ...prev, ...extracted }))
      setShowImportDialog(false)
      toast.success('Document imported successfully!')
    } catch (error) {
      toast.error('Failed to import document. Please try again.')
    }
  }

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    toast.loading('Extracting text from PDF...')

    try {
      const text = await extractTextFromPDF(file)
      setImportText(text)
      toast.success('PDF content extracted. Review and import.')
    } catch (error) {
      toast.error('Failed to extract PDF content. Please try pasting text instead.')
    }
  }

  const handleNext = () => {
    if (step < WIZARD_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleGenerateAssets()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleGenerateAssets = async () => {
    if (!formData.companyName || !formData.problem || !formData.solution) {
      toast.error('Please fill in at least company name, problem, and solution')
      return
    }
    if (!requireApiKey()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    const project: ProjectData = {
      id: generateProjectId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      companyName: formData.companyName || '',
      tagline: formData.tagline || '',
      problem: formData.problem || '',
      solution: formData.solution || '',
      uniqueValue: formData.uniqueValue || '',
      targetMarket: formData.targetMarket || '',
      customerPersona: formData.customerPersona || '',
      marketSize: formData.marketSize || '',
      revenueModel: formData.revenueModel || '',
      pricing: formData.pricing || '',
      brandVibe: formData.brandVibe || 'tech',
      status: 'generating'
    }

    onProjectChange(project)

    const categories: AssetCategory[] = ['brand', 'market', 'competition', 'business-plan', 'financials', 'marketing', 'pitch-deck', 'legal']
    const newAssets: GeneratedAsset[] = []

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const progress = ((i + 1) / categories.length) * 100
      setGenerationProgress(progress)

      try {
        const content = await generateAsset(project, category)
        const asset: GeneratedAsset = {
          id: generateAssetId(),
          category,
          title: ASSET_CATEGORIES[category].name,
          content,
          createdAt: new Date().toISOString()
        }
        newAssets.push(asset)
      } catch (error) {
        toast.error(`Failed to generate ${ASSET_CATEGORIES[category].name}`)
      }
    }

    setAssets(newAssets)
    project.status = 'complete'
    onProjectChange(project)
    setIsGenerating(false)
    toast.success('All assets generated successfully!')
  }

  const assetsArray = assets || []

  const getIconForCategory = (category: AssetCategory) => {
    const icons = {
      brand: Palette,
      market: ChartBar,
      competition: Users,
      'business-plan': FileText,
      financials: CurrencyDollar,
      marketing: Megaphone,
      'pitch-deck': Presentation,
      legal: Scales
    }
    const Icon = icons[category]
    return <Icon size={20} weight="fill" />
  }

  const selectedAsset = assets ? assets.find(a => a.category === selectedAssetCategory) : null

  if (currentProject?.status === 'complete' && assetsArray.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <ApiKeyDialog open={showKeyDialog} onOpenChange={setShowKeyDialog} />
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{currentProject.companyName}</h1>
              <p className="text-sm text-muted-foreground">{currentProject.tagline}</p>
            </div>
            <div className="flex items-center gap-2">
              <ExportSharePanel 
                project={currentProject} 
                assets={assetsArray}
                onProjectUpdate={onProjectChange}
              />
              <Button variant="outline" onClick={() => setShowKeyDialog(true)}>
                API Key
              </Button>
              <Button variant="outline" onClick={onReset}>
                New Project
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground px-3 mb-3">DELIVERABLES</h2>
              {Object.entries(ASSET_CATEGORIES).map(([key, cat]) => {
                const hasAsset = assetsArray.some(a => a.category === key)
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAssetCategory(key as AssetCategory)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      selectedAssetCategory === key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {getIconForCategory(key as AssetCategory)}
                    <span className="text-sm font-medium flex-1 text-left">{cat.name}</span>
                    {hasAsset && (
                      <CheckCircle size={16} weight="fill" className="text-accent" />
                    )}
                  </button>
                )
              })}
              
              <button
                onClick={() => setSelectedAssetCategory('research')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  selectedAssetCategory === 'research'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <MagnifyingGlass size={20} weight="fill" />
                <span className="text-sm font-medium flex-1 text-left">AI Research</span>
              </button>
            </aside>

            <main className="lg:col-span-3">
              {selectedAssetCategory === 'research' ? (
                <ResearchPanel project={currentProject} />
              ) : selectedAsset ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {getIconForCategory(selectedAsset.category)}
                      <div className="flex-1">
                        <CardTitle>{selectedAsset.title}</CardTitle>
                        <CardDescription>
                          {ASSET_CATEGORIES[selectedAsset.category].description}
                        </CardDescription>
                      </div>
                      <Badge>Generated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                      {selectedAsset.content}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground">Select a deliverable to view</p>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Sparkle size={32} weight="fill" className="text-accent" />
            </div>
            <CardTitle className="text-2xl text-white">Generating Your Business Assets</CardTitle>
            <CardDescription className="text-slate-300">
              Our AI is creating comprehensive deliverables for {formData.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Progress</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(ASSET_CATEGORIES).map(([key, cat]) => (
                <div key={key} className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="mx-auto w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                    {getIconForCategory(key as AssetCategory)}
                  </div>
                  <p className="text-xs text-slate-300">{cat.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
      <ApiKeyDialog open={showKeyDialog} onOpenChange={setShowKeyDialog} />
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Project</h1>
          <p className="text-slate-300">Answer a few questions to generate your business assets</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-slate-400'
                }`}>
                  {i < step ? <CheckCircle size={20} weight="fill" /> : i + 1}
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    i < step ? 'bg-primary' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-300">
            {WIZARD_STEPS.map(s => (
              <span key={s.id} className="flex-1 text-center">{s.label}</span>
            ))}
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{WIZARD_STEPS[step].label}</CardTitle>
            <CardDescription className="text-slate-300">
              {WIZARD_STEPS[step].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2" size={16} />
                        Import from Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import from Document</DialogTitle>
                        <DialogDescription>
                          Upload a PDF or paste text. AI will extract the key information.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handlePDFUpload}
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full"
                          >
                            <FilePdf className="mr-2" size={20} />
                            Upload PDF Document
                          </Button>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or paste text</span>
                          </div>
                        </div>
                        
                        <Textarea
                          placeholder="Paste your document content here..."
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                          rows={10}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleImportDocument}>
                          <Sparkle className="mr-2" weight="fill" size={16} />
                          Extract with AI
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Label htmlFor="company-name" className="text-white">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="e.g., LaunchKit"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-white">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    placeholder="e.g., From Idea to Investor Ready"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="problem" className="text-white">Problem *</Label>
                  <Textarea
                    id="problem"
                    value={formData.problem}
                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                    placeholder="What problem does your business solve?"
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="solution" className="text-white">Solution *</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({...formData, solution: e.target.value})}
                    placeholder="How does your business solve this problem?"
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="unique-value" className="text-white">Unique Value</Label>
                  <Textarea
                    id="unique-value"
                    value={formData.uniqueValue}
                    onChange={(e) => setFormData({...formData, uniqueValue: e.target.value})}
                    placeholder="What makes you different from competitors?"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="target-market" className="text-white">Target Market</Label>
                  <Textarea
                    id="target-market"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
                    placeholder="Who are your target customers?"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="customer-persona" className="text-white">Customer Persona</Label>
                  <Textarea
                    id="customer-persona"
                    value={formData.customerPersona}
                    onChange={(e) => setFormData({...formData, customerPersona: e.target.value})}
                    placeholder="Describe your ideal customer"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="market-size" className="text-white">Market Size</Label>
                  <Input
                    id="market-size"
                    value={formData.marketSize}
                    onChange={(e) => setFormData({...formData, marketSize: e.target.value})}
                    placeholder="e.g., $50B TAM, 500K potential customers"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="revenue-model" className="text-white">Revenue Model</Label>
                  <Textarea
                    id="revenue-model"
                    value={formData.revenueModel}
                    onChange={(e) => setFormData({...formData, revenueModel: e.target.value})}
                    placeholder="How do you make money?"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="pricing" className="text-white">Pricing</Label>
                  <Textarea
                    id="pricing"
                    value={formData.pricing}
                    onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                    placeholder="What are your pricing tiers?"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-4 block">Choose Your Brand Vibe</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {VIBE_OPTIONS.map(vibe => (
                      <button
                        key={vibe.id}
                        onClick={() => setFormData({...formData, brandVibe: vibe.id})}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.brandVibe === vibe.id
                            ? 'border-accent bg-accent/10'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <h3 className="font-semibold text-white mb-1">{vibe.name}</h3>
                        <p className="text-sm text-slate-300 mb-3">{vibe.description}</p>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: vibe.colors.primary }} />
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: vibe.colors.secondary }} />
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: vibe.colors.accent }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back
              </Button>

              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90"
              >
                {step === WIZARD_STEPS.length - 1 ? (
                  <>
                    <Sparkle className="mr-2" weight="fill" size={16} />
                    Generate Assets
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2" size={16} />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
