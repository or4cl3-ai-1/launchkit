import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DownloadSimple, FileArrowDown, FileText, Copy, CheckCircle, ShareNetwork, Lock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ProjectData, GeneratedAsset, AssetCategory } from '@/lib/types'
import { exportAsMarkdown, downloadMarkdown, downloadJSON, generateShareId } from '@/lib/ai-helpers'
import { usePurchases, categoryName, type Pack } from '@/lib/packs'

interface ExportSharePanelProps {
  project: ProjectData
  assets: GeneratedAsset[]
  onProjectUpdate: (project: ProjectData) => void
}

export function ExportSharePanel({ project, assets, onProjectUpdate }: ExportSharePanelProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [upsell, setUpsell] = useState<{ pack: Pack; locked: AssetCategory[] } | null>(null)
  const { exportableCategories, cheapestPackFor } = usePurchases()

  const doExportMarkdown = (onlyUnlocked: GeneratedAsset[]) => {
    const markdown = exportAsMarkdown(project, onlyUnlocked, true)
    const filename = `${project.companyName.replace(/\s+/g, '-').toLowerCase()}-launchkit.md`
    downloadMarkdown(markdown, filename)
    toast.success('Pack exported as Markdown')
  }

  const handleExportMarkdown = () => {
    const exportable = exportableCategories()
    const locked = [...new Set(assets.map((a) => a.category))].filter((c) => !exportable.includes(c))
    if (locked.length > 0) {
      const pack = cheapestPackFor(assets.map((a) => a.category))
      if (pack) {
        setUpsell({ pack, locked })
        return
      }
    }
    doExportMarkdown(assets)
  }

  const handleExportUnlockedOnly = () => {
    const exportable = exportableCategories()
    doExportMarkdown(assets.filter((a) => exportable.includes(a.category)))
    setUpsell(null)
  }

  const handleExportJSON = () => {
    const data = {
      project,
      assets,
      exportedAt: new Date().toISOString()
    }
    const filename = `${project.companyName.replace(/\s+/g, '-').toLowerCase()}-launchkit.json`
    downloadJSON(data, filename)
    toast.success('Project exported as JSON')
  }

  const handleTogglePublic = (isPublic: boolean) => {
    const updatedProject = {
      ...project,
      isPublic,
      shareId: isPublic && !project.shareId ? generateShareId() : project.shareId,
      updatedAt: new Date().toISOString()
    }
    onProjectUpdate(updatedProject)
    toast.success(isPublic ? 'Project is now public' : 'Project is now private')
  }

  const shareUrl = project.shareId 
    ? `${window.location.origin}/share/${project.shareId}`
    : ''

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <DownloadSimple className="mr-2" size={16} />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Project</DialogTitle>
            <DialogDescription>
              Download your project and all generated assets in different formats
            </DialogDescription>
            <div className="flex items-start gap-2 pt-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-3">
              <Lock size={14} className="mt-0.5 shrink-0" />
              <span>
                The Markdown pack (your investor-ready documents) unlocks with a pack purchase.
                JSON backup export is always free.
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <Button
              onClick={handleExportMarkdown}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="mr-3" size={20} />
              <div className="text-left">
                <div className="font-medium">Export Pack as Markdown</div>
                <div className="text-xs text-muted-foreground">
                  Clean, investor-ready documents — requires a pack
                </div>
              </div>
            </Button>

            <Button
              onClick={handleExportJSON}
              className="w-full justify-start"
              variant="outline"
            >
              <FileArrowDown className="mr-3" size={20} />
              <div className="text-left">
                <div className="font-medium">Export as JSON</div>
                <div className="text-xs text-muted-foreground">
                  Structured data for backup or import — free
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upsell dialog when locked sections are exported */}
      <Dialog open={!!upsell} onOpenChange={(open) => !open && setUpsell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock your pack</DialogTitle>
            <DialogDescription>
              These sections are part of a paid pack:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <ul className="list-disc pl-5 text-sm space-y-1">
              {upsell?.locked.map((c) => (
                <li key={c}>{categoryName(c)}</li>
              ))}
            </ul>
            {upsell && (
              <div className="rounded-lg border p-4 space-y-2">
                <div className="font-semibold">
                  {upsell.pack.name} Pack — ${upsell.pack.priceUSD}
                </div>
                <div className="text-sm text-muted-foreground">{upsell.pack.tagline}. One-time payment.</div>
                {upsell.pack.stripeLink ? (
                  <Button asChild className="w-full">
                    <a href={upsell.pack.stripeLink} target="_blank" rel="noopener noreferrer">
                      Buy {upsell.pack.name} — ${upsell.pack.priceUSD}
                    </a>
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Checkout opening soon
                  </Button>
                )}
                <Button variant="ghost" className="w-full" onClick={handleExportUnlockedOnly}>
                  Export my unlocked sections only
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <ShareNetwork className="mr-2" size={16} />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Create a shareable link for your project
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="public-toggle" className="flex flex-col space-y-1">
                <span>Make project public</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Anyone with the link can view your project
                </span>
              </Label>
              <Switch
                id="public-toggle"
                checked={project.isPublic || false}
                onCheckedChange={handleTogglePublic}
              />
            </div>

            {project.isPublic && shareUrl && (
              <div className="space-y-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="share-link"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    variant="outline"
                  >
                    {copied ? (
                      <CheckCircle size={16} weight="fill" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with anyone to give them view-only access to your project
                </p>
              </div>
            )}

            {!project.isPublic && (
              <div className="text-center py-8 text-muted-foreground">
                <ShareNetwork size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Enable public sharing to generate a shareable link
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
