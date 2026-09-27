import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiKey, setApiKey, getBaseUrl, setBaseUrl } from '@/lib/standalone'
import { toast } from 'sonner'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Bring-your-own-key setup. The key is stored only in this browser's
 * localStorage and sent only to the provider's API — LaunchKit itself
 * never sees or stores it.
 */
export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const [key, setKey] = useState(getApiKey())
  const [baseUrl, setBaseUrlState] = useState(getBaseUrl())

  const handleSave = () => {
    if (!key.trim()) {
      toast.error('Paste an API key first')
      return
    }
    setApiKey(key)
    setBaseUrl(baseUrl)
    toast.success('API key saved in this browser')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your AI provider</DialogTitle>
          <DialogDescription>
            LaunchKit generates with your own API key, so it costs nothing to run.
            Your key stays in this browser — it is never sent anywhere except your provider's API.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="lk-api-key">API key</Label>
            <Input
              id="lk-api-key"
              type="password"
              placeholder="sk-..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lk-base-url">API base URL (OpenAI-compatible)</Label>
            <Input
              id="lk-base-url"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrlState(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Works with OpenAI, or any OpenAI-compatible endpoint (Groq, OpenRouter, Ollama, …).
              Get a key at <span className="underline">platform.openai.com</span>.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
