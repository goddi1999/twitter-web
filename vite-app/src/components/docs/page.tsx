import { DemoPage } from '@/components/demo-page'

export function DocsPage() {
  return (
    <DemoPage
      eyebrow="docs"
      title="Docs"
      description="How posting works — coming later."
      align="start"
      className="max-w-3xl"
    >
      <div className="min-h-48" aria-hidden />
    </DemoPage>
  )
}
