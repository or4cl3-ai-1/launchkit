import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkle, Rocket, Lightning, Check } from '@phosphor-icons/react'
import { PACKS, categoryName, type Pack } from '@/lib/packs'

interface LandingPageProps {
  onStart: () => void
}

function PackCard({ pack }: { pack: Pack }) {
  const buyButton = pack.stripeLink ? (
    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
      <a href={pack.stripeLink} target="_blank" rel="noopener noreferrer">
        Buy {pack.name} — ${pack.priceUSD}
      </a>
    </Button>
  ) : (
    <Button disabled className="w-full">
      Checkout opening soon
    </Button>
  )

  return (
    <Card
      className={`p-6 flex flex-col gap-4 backdrop-blur-sm transition-all ${
        pack.featured
          ? 'bg-white/10 border-accent/60 ring-2 ring-accent/40'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      {pack.featured && (
        <div className="text-xs font-semibold uppercase tracking-wider text-accent">Most popular</div>
      )}
      <div>
        <h3 className="text-xl font-bold text-white">{pack.name}</h3>
        <p className="text-sm text-slate-400">{pack.tagline}</p>
      </div>
      <div className="text-4xl font-bold text-white">
        ${pack.priceUSD}
        <span className="text-sm font-normal text-slate-400"> one-time</span>
      </div>
      <ul className="space-y-2 text-sm text-slate-300 flex-1">
        {pack.categories.map((c) => (
          <li key={c} className="flex items-start gap-2">
            <Check size={16} className="text-accent mt-0.5 shrink-0" />
            <span>{categoryName(c)}</span>
          </li>
        ))}
      </ul>
      {buyButton}
    </Card>
  )
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-accent text-sm font-medium">
            <Sparkle weight="fill" />
            <span>AI-Powered Business Intelligence</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight">
            From Shower Idea to
            <span className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Investor Ready
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
            Transform raw ideas into comprehensive business assets in minutes. LaunchKit generates everything you need to launch and pitch your venture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={onStart}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all hover:scale-105"
            >
              <Rocket className="mr-2" weight="fill" size={24} />
              Start New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Lightning weight="fill" size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI-Powered Import</h3>
                <p className="text-sm text-slate-400">
                  Paste your README or notes. AI extracts everything automatically.
                </p>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Sparkle weight="fill" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white">Cohesive Intelligence</h3>
                <p className="text-sm text-slate-400">
                  Market research, financials, and strategy all logically connected.
                </p>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Rocket weight="fill" size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white">Complete Asset Suite</h3>
                <p className="text-sm text-slate-400">
                  Brand, pitch deck, financials, marketing—everything in one place.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-5xl">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Own your launch pack</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Generate free with your own AI key. Pay once to export the clean, investor-ready documents.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.filter((p) => p.id !== 'refresh').map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
        {(() => {
          const refresh = PACKS.find((p) => p.id === 'refresh')!
          return (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
              <div>
                <span className="text-white font-semibold">{refresh.name} — ${refresh.priceUSD}</span>
                <span className="text-slate-400 text-sm"> · {refresh.tagline}</span>
              </div>
              {refresh.stripeLink ? (
                <Button asChild variant="outline">
                  <a href={refresh.stripeLink} target="_blank" rel="noopener noreferrer">
                    Buy Refresh — ${refresh.priceUSD}
                  </a>
                </Button>
              ) : (
                <Button disabled variant="outline">Checkout opening soon</Button>
              )}
            </div>
          )
        })()}
        <p className="text-center text-xs text-slate-500 mt-6">
          One-time payments via Stripe. You bring your own AI key — generation costs roughly $1 in API credits; the pack is the finished documents.
        </p>
      </div>
    </div>
  )
}
