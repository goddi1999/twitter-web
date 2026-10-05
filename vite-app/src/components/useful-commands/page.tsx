import { DemoPage } from '@/components/demo-page'
import { DocsCodeBlock } from '@/components/docs/code-block'
import { DocsMarkdown } from '@/components/docs/markdown'

type CommandGuide = {
  id: string
  title: string
  /** Pattern with placeholders, e.g. cd <ordnername> */
  syntax: string
  explanation: string
}

const COMMANDS: CommandGuide[] = [
  {
    id: 'cd',
    title: 'cd — in einen Ordner rein',
    syntax: 'cd <ordnername>',
    explanation: `**Was es ist** — \`cd\` (change directory) wechselt den aktuellen Ordner im Terminal. \`<ordnername>\` ist ein Platzhalter: du ersetzt ihn durch den echten Namen, z. B. \`mein-projekt\`. Es öffnet kein neues Fenster — es ändert nur, wo du „stehst“.

**Warum wir es brauchen** — Stell dir den Computer wie ein Haus mit Zimmern vor. Ohne \`cd\` bleibst du immer im Flur. Mit \`cd <ordnername>\` gehst du in ein bestimmtes Zimmer, damit die nächsten Befehle dort wirken.

**Was passiert**
1. Du tippst \`cd\` und ersetzt \`<ordnername>\` — Beispiel: \`cd mein-projekt\`.
2. Das Terminal prüft, ob dieser Ordner vom aktuellen Ort aus erreichbar ist.
3. Wenn ja, bist du drin — alle folgenden Befehle laufen in diesem Ordner.

**Vorteile** — Schnell und klar. Du steuerst genau, wo Befehle arbeiten.

**Nachteile** — Falscher Name → Fehler. Relative Namen (ohne \`/\` am Anfang) hängen vom aktuellen Ort ab — man kann sich „verlaufen“.

**Merksatz:** \`cd <ordnername>\` = „Geh in diesen Ordner.“ Die spitzen Klammern tippst du nicht mit.`,
  },
  {
    id: 'mkdir',
    title: 'mkdir — Ordner erstellen',
    syntax: 'mkdir <ordnername>',
    explanation: `**Was es ist** — \`mkdir\` (make directory) legt einen neuen Ordner an. \`<ordnername>\` ersetzt du durch den gewünschten Namen, z. B. \`mein-projekt\`.

**Warum wir es brauchen** — Bevor du Dateien sortierst, brauchst du eine Schublade. Ohne Ordner landet alles wild durcheinander. Mit \`mkdir <ordnername>\` baust du zuerst die Schublade.

**Was passiert**
1. Du tippst \`mkdir\` und ersetzt \`<ordnername>\` — Beispiel: \`mkdir mein-projekt\`.
2. Das System erstellt den Ordner am aktuellen Ort (dort, wo \`cd\` dich hingebracht hat).
3. Der Ordner ist leer — danach oft \`cd <ordnername>\` hinein.

**Vorteile** — Ein Befehl, ein neuer Ordner. Gut für Projekte und Struktur.

**Nachteile** — Existiert der Name schon, gibt es oft einen Fehler. Leerzeichen und Sonderzeichen im Namen machen Tippen und Pfade nervig.

**Merksatz:** \`mkdir <ordnername>\` baut die Schublade — danach \`cd <ordnername>\` hinein. Die \`<>\` tippst du nicht.`,
  },
  {
    id: 'cd-up',
    title: 'cd .. — aus einem Ordner raus',
    syntax: 'cd ..',
    explanation: `**Was es ist** — \`cd ..\` geht eine Ebene nach oben: aus dem aktuellen Ordner zurück in den Eltern-Ordner. Die zwei Punkte \`..\` bedeuten „einen Schritt zurück“ — kein Platzhalter, genau so tippen.

**Warum wir es brauchen** — Du bist im Zimmer und willst zurück in den Flur. Ohne \`cd ..\` müsstest du den ganzen Pfad von vorne tippen.

**Was passiert**
1. Du stehst z. B. in \`Dokumente/mein-projekt\`.
2. Du tippst \`cd ..\`.
3. Du landest in \`Dokumente\` — eine Ebene höher.

**Vorteile** — Kurz, überall gleich, kein langer Pfad nötig.

**Nachteile** — Mehrfach \`cd ..\` kann dich weit wegführen. Am obersten Punkt kommst du nicht weiter „hoch“.

**Merksatz:** \`cd ..\` ist die Tür zurück — eine Ebene raus.`,
  },
  {
    id: 'ls',
    title: 'ls — Ordnerinhalt anzeigen',
    syntax: 'ls',
    explanation: `**Was es ist** — \`ls\` (list) zeigt, was im aktuellen Ordner liegt: Dateien und Unterordner. Kein Platzhalter nötig. Es verändert nichts — es liest nur.

**Warum wir es brauchen** — Wie in eine Schublade schauen, bevor du etwas herausnimmst. Mit \`ls\` siehst du die echten Namen für \`cd\` und \`mkdir\`.

**Was passiert**
1. Du stehst in einem Ordner (z. B. nach \`cd\`).
2. Du tippst \`ls\`.
3. Das Terminal listet Namen auf.

**Vorteile** — Schneller Überblick. Sicher, weil nichts gelöscht wird.

**Nachteile** — Oft nur Namen, nicht Größe oder Datum. Sehr volle Ordner wirken unübersichtlich.

**Merksatz:** \`ls\` = Blick in die Schublade — nur schauen.`,
  },
  {
    id: 'code',
    title: 'code . — Ordner in VS Code öffnen',
    syntax: 'code .',
    explanation: `**Was es ist** — \`code\` startet Visual Studio Code. Der Punkt \`. \` bedeutet „dieser Ordner hier“ (der aktuelle). Also: öffne den aktuellen Ordner als Projekt.

**Warum wir es brauchen** — Du hast den Ordner im Terminal gefunden. Statt im Finder zu klicken, öffnest du ihn mit einem Befehl genau dort, wo du stehst.

**Was passiert**
1. Du bist mit \`cd <ordnername>\` im richtigen Projektordner.
2. Du tippst \`code .\`.
3. VS Code öffnet dieses Verzeichnis.

**Vorteile** — Kein Suchen im Finder. Terminal und Editor bleiben synchron.

**Nachteile** — Braucht den \`code\`-Befehl im PATH (in VS Code: „Shell Command: Install 'code' command in PATH“).

**Merksatz:** \`code .\` = „Öffne genau diesen Ordner in VS Code.“`,
  },
  {
    id: 'gradle-init',
    title: 'gradle init — Gradle-Projekt starten',
    syntax: 'gradle init',
    explanation: `**Was es ist** — \`gradle init\` startet ein neues Gradle-Projekt. Gradle ist ein Bau-Werkzeug: es kennt Abhängigkeiten, baut und testet dein Java-Projekt. \`init\` legt die Grundstruktur an.

**Warum wir es brauchen** — Ein leerer Ordner hat keine Bau-Regeln. Mit \`gradle init\` bekommst du eine Standard-Startstruktur — wie ein leeres Schulheft mit Linien.

**Was passiert**
1. Du bist im (meist leeren) Projektordner — oft nach \`mkdir <ordnername>\` und \`cd <ordnername>\`.
2. Du tippst \`gradle init\` und beantwortest die Fragen (z. B. Typ, Sprache Java).
3. Gradle legt Dateien wie \`build.gradle\` und Ordner an.

**Vorteile** — Schneller, einheitlicher Projektstart.

**Nachteile** — Braucht installiertes Gradle. Die Fragen können Anfänger verwirren.

**Merksatz:** \`gradle init\` legt das leere Schulheft für dein Java-Projekt an.`,
  },
  {
    id: 'sudo-rm-r',
    title: 'sudo rm -r — Ordner löschen (Vorsicht!)',
    syntax: 'sudo rm -r <ordnername>',
    explanation: `**Was es ist** — Ein Lösch-Befehl aus drei Teilen. \`rm\` bedeutet remove (löschen). \`<ordnername>\` ersetzt du durch den echten Ordner — die \`<>\` tippst du nicht. Die Flags (Zusatzbuchstaben nach dem Bindestrich) ändern, *wie* gelöscht wird.

**Flags — was jeder Teil bedeutet**
- \`sudo\` — „superuser do“: führe den Befehl mit Admin-Rechten aus (wie der Hausmeister-Schlüssel). Ohne \`sudo\` fehlen oft Rechte; mit \`sudo\` kannst du auch geschützte Dinge löschen.
- \`rm\` — löschen (remove).
- \`-r\` — recursive (rekursiv): nicht nur eine Datei, sondern den Ordner **und alles darin** (Unterordner, Dateien). Ohne \`-r\` verweigert \`rm\` meist das Löschen eines Ordners.
- \`<ordnername>\` — Ziel: welcher Ordner weg soll.

**Warum wir es brauchen** — Manchmal muss ein ganzer Ordner weg (altes Projekt, kaputter Build-Ordner). Im Finder geht das per Papierkorb; im Terminal macht \`rm -r\` das in einem Schritt — und \`sudo\`, wenn normale Rechte nicht reichen.

**Was passiert**
1. Du tippst \`sudo rm -r\` und ersetzt \`<ordnername>\` — Beispiel: \`sudo rm -r alter-ordner\`.
2. Das System fragt oft nach dem Passwort (wegen \`sudo\`).
3. Der Ordner und **alles darin** wird gelöscht — meist ohne Papierkorb.

**Vorteile** — Löscht ganze Ordnerbäume schnell. Nützlich, wenn Rechte oder viele Dateien im Weg sind.

**Nachteile** — Sehr gefährlich. Falscher Name → falsche Daten weg. Mit \`sudo\` noch riskanter, weil geschützte Systemteile erreichbar werden. Oft kein Zurückholen wie im Papierkorb. (Manche tippen zusätzlich \`-f\` = force = nicht nachfragen — das macht Fehler noch teurer. Hier reicht \`-r\`.)

**Merksatz:** \`sudo rm -r <ordnername>\` = Admin-Schlüssel + löschen + ganzen Ordnerbaum. Doppelt prüfen, bevor du Enter drückst.`,
  },
]

export function UsefulCommandsPage() {
  return (
    <DemoPage
      eyebrow="terminal"
      title="Useful commands"
      description="Ein Syntax-Block pro Befehl (<…> ersetzt du — die Klammern tippst du nicht). Kopierbar; Erklärung auf Deutsch."
      align="start"
      className="max-w-4xl pb-24"
    >
      <div className="w-full space-y-12 text-left">
        {COMMANDS.map((item) => (
          <section key={item.id} id={item.id} className="scroll-mt-8 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {item.title}
            </h2>
            <DocsCodeBlock language="bash" title="Syntax" code={item.syntax} />
            <DocsMarkdown>{item.explanation}</DocsMarkdown>
          </section>
        ))}
      </div>
    </DemoPage>
  )
}
