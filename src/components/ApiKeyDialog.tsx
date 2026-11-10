import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PROVIDERS, getApiKey, setApiKey, getBaseUrl, setBaseUrl, getModel, setModel, getProvider, setProvider, type ProviderId, type ProviderPreset } from '@/lib/standalone'
import { toast } from 'sonner'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Bring-your-own-key setup. Pick a provider first — that fills in the
 * API address and model for you. The key is stored only in this browser's
 * localStorage and sent only to the provider's API — LaunchKit itself
 * never sees or stores it. Groq is the default: free, no card, and its
 * model names don't rotate the way OpenRouter's free roster does.
 */
export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const initialProvider = getProvider()
  const [provider, setProviderState] = useState<ProviderId>(initialProvider)
  const [key, setKey] = useState(getApiKey())
  const [baseUrl, setBaseUrlState] = useState(getBaseUrl())
  const [model, setModelState] = useState(getModel())

  const selectPreset = (preset: ProviderPreset) => {
    setProviderState(preset.id)
    setBaseUrlState(preset.baseUrl)
    setModelState(preset.model)
  }

  const selectedPreset: ProviderPreset | null =
    provider === 'custom' ? null : PROVIDERS[provider]

  const handleSave = () => {
    if (!key.trim()) {
      toast.error('Paste an API key first')
      return
    }
    setApiKey(key)
    // If the address/model still match the chosen preset, store the
    // preset itself; hand-edited values become a custom setup instead.
    if (
      selectedPreset &&
      baseUrl.trim().replace(/\/$/, '') === selectedPreset.baseUrl &&
      model.trim() === selectedPreset.model
    ) {
      setProvider(selectedPreset.id)
    } else {
      setProvider('custom')
      setBaseUrl(baseUrl)
      setModel(model)
    }
    toast.success('API key saved in this browser')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect your AI provider</DialogTitle>
          <DialogDescription>
            Pick a provider, paste its key, and LaunchKit generates with it.
            Your key stays in this browser — it is never sent anywhere except your provider's API.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Provider — Groq is free, start there</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(PROVIDERS) as ProviderPreset[]).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    provider === preset.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <span className="block text-sm font-semibold">{preset.label}</span>
                  <span className="block text-xs text-muted-foreground">{preset.badge}</span>
                </button>
              ))}
            </div>
            {selectedPreset && (
              <p className="text-xs text-muted-foreground">{selectedPreset.note}</p>
            )}
            {provider === 'custom' && (
              <p className="text-xs text-muted-foreground">
                Custom setup — the address and model below were typed by hand.
                Pick a provider above to go back to a preset.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lk-api-key">API key</Label>
            <Input
              id="lk-api-key"
              type="password"
              placeholder={selectedPreset ? `Key from ${selectedPreset.label}` : 'Paste your key'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
            />
            {selectedPreset && (
              <p className="text-xs text-muted-foreground">
                <a
                  href={selectedPreset.keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {selectedPreset.keyLabel} →
                </a>{' '}
                — free, no card, takes about a minute.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lk-model">Model</Label>
            <Input
              id="lk-model"
              type="text"
              placeholder="openai/gpt-oss-120b"
              value={model}
              onChange={(e) => setModelState(e.target.value)}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Filled in by the provider above. A wrong model name is the most common cause of a failed import.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lk-base-url">API base URL (OpenAI-compatible)</Label>
            <Input
              id="lk-base-url"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrlState(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
