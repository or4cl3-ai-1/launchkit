import { useState, useCallback } from 'react'

/**
 * Standalone replacements for the GitHub Spark runtime APIs.
 * The app was scaffolded inside GitHub Spark, whose `spark.llm()` /
 * `spark.kv` / `useKV` only work on Spark's hosted runtime. Everything
 * below is a dependency-free equivalent so LaunchKit runs anywhere.
 */

// ---------------------------------------------------------------------------
// LLM — bring-your-own-key, OpenAI-compatible chat completions endpoint.
// The user pastes their own API key once; it lives in localStorage and is
// only ever sent to the provider they chose. Zero server cost for us.
// ---------------------------------------------------------------------------

const LS_API_KEY = 'launchkit.apiKey'
const LS_BASE_URL = 'launchkit.baseUrl'
const LS_MODEL = 'launchkit.model'
const LS_PROVIDER = 'launchkit.provider'

/**
 * Provider presets. LaunchKit never had a Hugging Face backend — the old
 * default was OpenAI, and Groq/OpenRouter only worked if you typed the
 * exact base URL and model name by hand. Picking a preset now fills both
 * in with one tap. Groq is the default: free, no card, and its model IDs
 * are stable, unlike OpenRouter's rotating :free roster.
 */
export type ProviderId = 'groq' | 'openrouter' | 'openai' | 'custom'

export interface ProviderPreset {
  id: Exclude<ProviderId, 'custom'>
  label: string
  badge: string
  baseUrl: string
  model: string
  keyUrl: string
  keyLabel: string
  note: string
}

export const PROVIDERS: Record<Exclude<ProviderId, 'custom'>, ProviderPreset> = {
  groq: {
    id: 'groq',
    label: 'Groq',
    badge: 'Free',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    keyUrl: 'https://console.groq.com/keys',
    keyLabel: 'Get a free Groq key',
    note: 'Free, no card needed. Groq’s free tier allows about 100,000 tokens a day on this model — roughly one full business pack a day. A 429 error means the daily cap is hit; try again tomorrow, or add a card to raise the limits.',
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    badge: 'Free',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openrouter/free',
    keyUrl: 'https://openrouter.ai/keys',
    keyLabel: 'Get a free OpenRouter key',
    note: 'Free models, no card — 50 requests a day, and a full pack uses about 13. openrouter/free routes to a working free model automatically; the free roster rotates, so if one model fails the router picks another.',
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    badge: 'Paid',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyLabel: 'Get an OpenAI key',
    note: 'Pay per use — a full pack costs roughly $0.30–$0.60 in tokens.',
  },
}

export function getProvider(): ProviderId {
  try {
    const stored = localStorage.getItem(LS_PROVIDER)
    if (stored === 'groq' || stored === 'openrouter' || stored === 'openai' || stored === 'custom') {
      return stored
    }
  } catch {
    /* storage unavailable */
  }
  return 'groq'
}

export function setProvider(id: ProviderId) {
  try {
    localStorage.setItem(LS_PROVIDER, id)
    if (id !== 'custom') {
      // Presets own the URL/model; drop any hand-typed override so a
      // stale OpenAI default can't silently win over the chosen preset.
      localStorage.removeItem(LS_BASE_URL)
      localStorage.removeItem(LS_MODEL)
    }
  } catch {
    /* storage unavailable */
  }
}

export function getApiKey(): string {
  try {
    return localStorage.getItem(LS_API_KEY) || ''
  } catch {
    return ''
  }
}

export function setApiKey(key: string) {
  try {
    localStorage.setItem(LS_API_KEY, key.trim())
  } catch {
    /* storage unavailable */
  }
}

export function clearApiKey() {
  try {
    localStorage.removeItem(LS_API_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function getBaseUrl(): string {
  const provider = getProvider()
  if (provider === 'custom') {
    try {
      return localStorage.getItem(LS_BASE_URL) || PROVIDERS.groq.baseUrl
    } catch {
      return PROVIDERS.groq.baseUrl
    }
  }
  return PROVIDERS[provider].baseUrl
}

export function setBaseUrl(url: string) {
  try {
    localStorage.setItem(LS_BASE_URL, url.trim().replace(/\/$/, ''))
    localStorage.setItem(LS_PROVIDER, 'custom')
  } catch {
    /* storage unavailable */
  }
}

/**
 * Model name. Follows the chosen provider preset (Groq by default) — the
 * app previously defaulted to gpt-4o everywhere, so a Groq key (which has
 * no gpt-4o) or an OpenRouter key (which needs openai/gpt-4o) failed every
 * call with a model-not-found error that the UI then swallowed.
 */
export function getModel(): string {
  const provider = getProvider()
  if (provider === 'custom') {
    try {
      return localStorage.getItem(LS_MODEL) || PROVIDERS.groq.model
    } catch {
      return PROVIDERS.groq.model
    }
  }
  return PROVIDERS[provider].model
}

export function setModel(model: string) {
  try {
    localStorage.setItem(LS_MODEL, model.trim() || PROVIDERS.groq.model)
    localStorage.setItem(LS_PROVIDER, 'custom')
  } catch {
    /* storage unavailable */
  }
}

/** Template-tag string builder — identical semantics to spark.llmPrompt. */
export function llmPrompt(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '')
}

interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

/**
 * Drop-in replacement for spark.llm(prompt, model, jsonMode).
 * Posts an OpenAI-shaped chat-completions request to the configured
 * base URL. Raises max_tokens well above Spark's 1000-token cap, which
 * was truncating the "comprehensive" assets this app promises.
 */
export async function llm(prompt: string, modelName?: string, jsonMode?: boolean): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('NO_API_KEY')
  }

  const model = modelName || getModel()
  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: prompt },
  ]

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 1.0,
    max_tokens: 4000,
  }
  if (jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }
  // OpenRouter asks for these so it can show the app in its dashboard;
  // they are harmless on other providers, so only send them there.
  if (getBaseUrl().includes('openrouter.ai')) {
    headers['HTTP-Referer'] = window.location.origin
    headers['X-Title'] = 'LaunchKit'
  }

  const response = await fetch(`${getBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`LLM request failed: ${response.status} ${response.statusText} ${errorText}`.trim())
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('LLM returned an unexpected response shape')
  }
  return content
}

/** Namespace mirroring the old `spark` global so ai-helpers.ts barely changes. */
export const spark = { llm, llmPrompt }

// ---------------------------------------------------------------------------
// useKV — localStorage-backed persistent state with the same tuple API as
// @github/spark/hooks. Per-browser instead of per-account, which is fine
// for a single-founder desktop tool.
// ---------------------------------------------------------------------------

export function useKV<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const storageKey = `launchkit.kv.${key}`

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          localStorage.setItem(storageKey, JSON.stringify(resolved))
        } catch {
          /* quota or privacy mode — keep in-memory value */
        }
        return resolved
      })
    },
    [storageKey],
  )

  return [value, set]
}
