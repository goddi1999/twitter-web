import { useState } from 'react'

import { SelectTabs, TabsContent, type TabItem } from '@/components/tabs'

import { DocsCodeBlock } from './code-block'
import { DocsMarkdown } from './markdown'

export const REQUEST_TABS: readonly TabItem[] = [
  { id: 'java', title: 'Java' },
  { id: 'curl', title: 'curl' },
  { id: 'bash', title: 'Bash' },
] as const

export type RequestTabId = (typeof REQUEST_TABS)[number]['id']

type Snippet = {
  language: 'java' | 'bash' | 'curl'
  title: string
  code: string
  /** Markdown shown under the block: what to watch out for. */
  note?: string
}

type DocsRequestTabsProps = {
  snippets: Record<RequestTabId, Snippet | Snippet[]>
  defaultTab?: RequestTabId
  className?: string
}

export function DocsRequestTabs({
  snippets,
  defaultTab = 'java',
  className,
}: DocsRequestTabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTab)

  return (
    <div className={className}>
      <SelectTabs
        tabs={REQUEST_TABS}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        variant="compact"
        colorVariant="default"
      />
      {REQUEST_TABS.map((tab) => {
        const entry = snippets[tab.id as RequestTabId]
        const blocks = Array.isArray(entry) ? entry : [entry]
        return (
          <TabsContent
            key={tab.id}
            tabId={tab.id}
            activeTabId={activeTabId}
            className="mt-5 space-y-10 p-0"
          >
            {blocks.map((block) => (
              <div key={`${tab.id}-${block.title}`} className="space-y-3">
                <DocsCodeBlock language={block.language} title={block.title} code={block.code} />
                {block.note ? <DocsMarkdown>{block.note}</DocsMarkdown> : null}
              </div>
            ))}
          </TabsContent>
        )
      })}
    </div>
  )
}
