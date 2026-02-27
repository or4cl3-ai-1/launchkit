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
import { DownloadSimple, FileArrowDown, FileText, Copy, CheckCircle, ShareNetwork } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ProjectData, GeneratedAsset } from '@/lib/types'
import { exportAsMarkdown, downloadMarkdown, downloadJSON, generateShareId } from '@/lib/ai-helpers'

interface ExportSharePanelProps {
  project: ProjectData
  assets: GeneratedAsset[]
  onProjectUpdate: (project: ProjectData) => void
}

export function ExportSharePanel({ project, assets, onProjectUpdate }: ExportSharePanelProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExportMarkdown = () => {
    const markdown = exportAsMarkdown(project, assets)
    const filename = `${project.companyName.replace(/\s+/g, '-').toLowerCase()}-launchkit.md`
    downloadMarkdown(markdown, filename)
    toast.success('Project exported as Markdown')
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
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <Button
              onClick={handleExportMarkdown}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="mr-3" size={20} />
              <div className="text-left">
                <div className="font-medium">Export as Markdown</div>
                <div className="text-xs text-muted-foreground">
                  Readable document with all content
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
                  Structured data for backup or import
                </div>
              </div>
            </Button>
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
