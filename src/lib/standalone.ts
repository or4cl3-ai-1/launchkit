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
  try {
    return localStorage.getItem(LS_BASE_URL) || 'https://api.openai.com/v1'
  } catch {
    return 'https://api.openai.com/v1'
  }
}

export function setBaseUrl(url: string) {
  try {
    localStorage.setItem(LS_BASE_URL, url.trim().replace(/\/$/, ''))
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

  const model = modelName || 'gpt-4o'
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

  const response = await fetch(`${getBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
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
