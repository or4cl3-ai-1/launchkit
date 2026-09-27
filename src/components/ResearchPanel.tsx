import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MagnifyingGlass, TrendUp, Target, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ProjectData, CompetitorData, MarketResearchData } from '@/lib/types'
import { conductMarketResearch, analyzeCompetition } from '@/lib/ai-helpers'
import { useKV } from '@/lib/standalone'

interface ResearchPanelProps {
  project: ProjectData
}

export function ResearchPanel({ project }: ResearchPanelProps) {
  const [isResearching, setIsResearching] = useState(false)
  const [marketResearch, setMarketResearch] = useKV<MarketResearchData | null>(`market-research-${project.id}`, null)
  const [competitors, setCompetitors] = useKV<CompetitorData[]>(`competitors-${project.id}`, [])

  const handleMarketResearch = async () => {
    setIsResearching(true)
    toast.loading('Conducting market research...')
    
    try {
      const data = await conductMarketResearch(project)
      setMarketResearch(data)
      toast.success('Market research completed!')
    } catch (error) {
      toast.error('Failed to conduct market research')
    } finally {
      setIsResearching(false)
    }
  }

  const handleCompetitionAnalysis = async () => {
    setIsResearching(true)
    toast.loading('Analyzing competition...')
    
    try {
      const data = await analyzeCompetition(project)
      setCompetitors(data)
      toast.success('Competition analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze competition')
    } finally {
      setIsResearching(false)
    }
  }

  const competitorsList = competitors || []
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MagnifyingGlass size={24} weight="fill" />
                AI-Powered Research
              </CardTitle>
              <CardDescription>
                Deep market and competition analysis powered by AI
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleMarketResearch}
                disabled={isResearching}
                variant="outline"
                size="sm"
              >
                <TrendUp className="mr-2" size={16} />
                Market Research
              </Button>
              <Button
                onClick={handleCompetitionAnalysis}
                disabled={isResearching}
                variant="outline"
                size="sm"
              >
                <Target className="mr-2" size={16} />
                Competition Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {(marketResearch || competitorsList.length > 0) && (
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market">Market Insights</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-4">
            {marketResearch ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {marketResearch.trends.map((trend, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendUp size={16} className="mt-1 text-primary flex-shrink-0" weight="fill" />
                          <span className="text-sm">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {marketResearch.opportunities.map((opp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Target size={16} className="mt-1 text-accent flex-shrink-0" weight="fill" />
                          <span className="text-sm">{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Threats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {marketResearch.threats.map((threat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Warning size={16} className="mt-1 text-destructive flex-shrink-0" weight="fill" />
                          <span className="text-sm">{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demand Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {marketResearch.demandSignals.map((signal, idx) => (
                        <Badge key={idx} variant="secondary">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Industry Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {marketResearch.industryInsights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">Run market research to see insights</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competition" className="space-y-4">
            {competitorsList.length > 0 ? (
              competitorsList.map((comp, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{comp.name}</CardTitle>
                        <CardDescription className="mt-2">{comp.description}</CardDescription>
                      </div>
                      {comp.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={comp.url} target="_blank" rel="noopener noreferrer">
                            Visit
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {comp.strengths.map((strength, sidx) => (
                          <li key={sidx} className="text-sm text-muted-foreground">
                            ✓ {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Weaknesses</h4>
                      <ul className="space-y-1">
                        {comp.weaknesses.map((weakness, widx) => (
                          <li key={widx} className="text-sm text-muted-foreground">
                            ✗ {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Pricing</p>
                        <p className="text-sm font-medium">{comp.pricing}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Target Market</p>
                        <p className="text-sm font-medium">{comp.targetMarket}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">Run competition analysis to see competitors</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
