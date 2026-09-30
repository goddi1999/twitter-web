import { useState } from 'react'

import { SelectTabs, TabsContent, type TabItem } from '@/components/tabs'

import { DocsMarkdown } from './markdown'

const JAVA_SETUP_TABS = [
  { id: 'install', title: 'Installieren' },
  { id: 'check', title: 'Prüfen' },
  { id: 'permanent', title: 'Dauerhaft' },
] as const satisfies readonly TabItem[]

const INSTALL_MD = `Wir installieren **Eclipse Temurin 25**, eine verbreitete OpenJDK-Version. Das ist eine unkomplizierte macOS-Installation und erfüllt die Vorgabe Java 25 (LTS). Dafür musst du keine Dateien aus dem JDK-Archiv manuell entpacken oder Umgebungsvariablen von Hand setzen.

Führe im Terminal aus und warte, bis der Befehl fertig ist:

\`\`\`bash
brew install --cask temurin@25
\`\`\`
`

const CHECK_MD = `Prüfe Java und den Compiler getrennt:

\`\`\`bash
java -version
javac -version
\`\`\`

In beiden Ausgaben muss **25** stehen, zum Beispiel \`25.0.x\` oder \`javac 25\`. Die genaue Patch-Version kann sich durch Sicherheitsupdates ändern; entscheidend ist die Hauptversion 25.

Zusätzliche Kontrolle: Dieser macOS-Befehl listet installierte JDKs auf:

\`\`\`bash
/usr/libexec/java_home -V
\`\`\`

### Falls eine andere Java-Version angezeigt wird

Wenn auf deinem Mac schon ein älteres JDK installiert war, kann das Terminal noch dieses auswählen. Setze Java 25 zunächst für das aktuelle Terminal-Fenster und prüfe erneut:

\`\`\`bash
export JAVA_HOME=$(/usr/libexec/java_home -v 25)
export PATH="$JAVA_HOME/bin:$PATH"
java -version
javac -version
\`\`\`

Das gilt zunächst nur für dieses Terminal-Fenster. Hat es geholfen, übernimm die Einstellung im Tab **Dauerhaft**.
`

const PERMANENT_MD = `Java 25 dauerhaft als Standard setzen: die beiden Zeilen in die Zsh-Konfiguration übernehmen, dann die Datei neu laden.

\`\`\`bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 25)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

Danach das Terminal neu öffnen und nochmals \`java -version\` prüfen. In der Ausgabe muss **25** stehen.
`

const TAB_MARKDOWN: Record<(typeof JAVA_SETUP_TABS)[number]['id'], string> = {
  install: INSTALL_MD,
  check: CHECK_MD,
  permanent: PERMANENT_MD,
}

export function JavaSetupTabs() {
  const [activeTabId, setActiveTabId] = useState<string>('install')

  return (
    <div>
      <SelectTabs
        tabs={JAVA_SETUP_TABS}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        variant="compact"
        colorVariant="default"
      />
      {JAVA_SETUP_TABS.map((tab) => (
        <TabsContent
          key={tab.id}
          tabId={tab.id}
          activeTabId={activeTabId}
          className="mt-3 p-0"
        >
          <DocsMarkdown>{TAB_MARKDOWN[tab.id]}</DocsMarkdown>
        </TabsContent>
      ))}
    </div>
  )
}
