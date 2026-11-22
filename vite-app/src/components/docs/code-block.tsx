import { CodeBlock } from '@/components/shared'

/** Sky-500: the accent the feed already uses for handles and reply links. */
const DOCS_ACCENT = '#0ea5e9'

type DocsCodeBlockProps = {
  code: string
  /** java · javascript · json · bash (curl / sh / shell are shown as bash). */
  language?: string
  /** Shown in the header; falls back to the language. */
  title?: string
  className?: string
}

function toPrismLanguage(language: string): string {
  const value = language.toLowerCase()
  if (value === 'js') return 'javascript'
  if (value === 'curl' || value === 'sh' || value === 'shell') return 'bash'
  return value
}

/** Docs preset of the shared CodeBlock: dark frame, sky accent, line numbers, copy button. */
export function DocsCodeBlock({ code, language = 'bash', title, className }: DocsCodeBlockProps) {
  return (
    <CodeBlock
      code={code}
      language={toPrismLanguage(language)}
      filename={title}
      accent={DOCS_ACCENT}
      mode="dark"
      className={className}
    />
  )
}
