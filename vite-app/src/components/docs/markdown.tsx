import type { Components } from 'react-markdown'
import Markdown from 'react-markdown'

import { cn } from '@/lib/utils'

import { DocsCodeBlock } from './code-block'

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 scroll-mt-8 text-xl font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 text-base font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground first:mt-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-foreground underline underline-offset-2 hover:opacity-80"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const text = String(children).replace(/\n$/, '')
    const match = /language-(\w+)/.exec(className ?? '')
    const isBlock = Boolean(match) || text.includes('\n')

    if (isBlock) {
      return (
        <DocsCodeBlock
          code={text}
          language={match?.[1] ?? 'text'}
          className="mt-4"
        />
      )
    }

    return (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
}

type DocsMarkdownProps = {
  children: string
  className?: string
}

export function DocsMarkdown({ children, className }: DocsMarkdownProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <Markdown components={components}>{children}</Markdown>
    </div>
  )
}
