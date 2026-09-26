import { useState } from 'react'

import { SelectTabs, TabsContent, type TabItem } from '@/components/tabs'

import { DocsCodeBlock } from './code-block'

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
            className="mt-3 space-y-3 p-0"
          >
            {blocks.map((block) => (
              <DocsCodeBlock
                key={`${tab.id}-${block.title}`}
                language={block.language}
                title={block.title}
                code={block.code}
              />
            ))}
          </TabsContent>
        )
      })}
    </div>
  )
}
