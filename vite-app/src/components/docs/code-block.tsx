import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import java from 'highlight.js/lib/languages/java'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import './docs-highlight.css'

hljs.registerLanguage('java', java)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('curl', bash)

type DocsLanguage = 'java' | 'bash' | 'curl' | 'sh' | 'shell'

type DocsCodeBlockProps = {
  code: string
  language?: DocsLanguage | string
  title?: string
  className?: string
}

function normalizeLanguage(language: string): DocsLanguage {
  const value = language.toLowerCase()
  if (value === 'java') return 'java'
  if (value === 'curl') return 'curl'
  return 'bash'
}

function highlightCode(code: string, lang: DocsLanguage): string | null {
  try {
    return hljs.highlight(code.replace(/\n$/, ''), {
      language: lang === 'curl' ? 'bash' : lang,
      ignoreIllegals: true,
    }).value
  } catch {
    return null
  }
}

export function DocsCodeBlock({
  code,
  language = 'bash',
  title,
  className,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const lang = normalizeLanguage(language)
  const highlighted = highlightCode(code, lang)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn(
        'docs-code-block overflow-hidden rounded-xl border border-border/60 bg-zinc-950 shadow-none',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-2">
        <div className="min-w-0">
          {title ? (
            <p className="truncate text-sm text-zinc-400">{title}</p>
          ) : (
            <p className="truncate font-mono text-xs uppercase tracking-wide text-zinc-500">
              {lang}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          onClick={() => void copy()}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <pre className="m-0 bg-transparent p-0">
          {highlighted ? (
            <code
              className={`hljs language-${lang} font-mono bg-transparent`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : (
            <code className="font-mono bg-transparent text-zinc-100">{code}</code>
          )}
        </pre>
      </div>
    </div>
  )
}
