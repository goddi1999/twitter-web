import { DemoPage } from '@/components/demo-page'

import { AvatarCatalogTable } from './avatar-table'
import { Separator } from '@/components/ui/separator'

import { DocsCodeBlock } from './code-block'
import { DocsMarkdown } from './markdown'
import { JavaSetupTabs } from './java-setup'
import { DocsRequestTabs, type RequestTabId } from './request-tabs'

/** Official production API base. Local: `npx vercel dev` → http://localhost:3000 */
const BASE_URL = 'https://twitter-web-inky.vercel.app'
const CLIENT_VERSION = 'v1.4.0'
const CLIENT_REPO = 'https://github.com/goddi1999/social-publish-client'
const AVATARS_REPO = 'https://github.com/wq-org/wq-avatars'

type Snippet = {
  language: 'java' | 'bash' | 'curl'
  title: string
  code: string
  /** Markdown shown under the block: what to watch out for. */
  note?: string
}

const PUBLISH_SNIPPETS: Record<RequestTabId, Snippet | Snippet[]> = {
  java: [
    {
      language: 'bash',
      title: '1. Dependency (build.gradle)',
      code: `repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.goddi1999:social-publish-client:${CLIENT_VERSION}'
}`,
      note: `**Wichtig:** Das JitPack-Repository muss *zusätzlich* zu \`mavenCentral()\` eingetragen sein, sonst wird die Bibliothek nicht gefunden. Version exakt \`${CLIENT_VERSION}\` verwenden — danach Gradle neu laden (Sync).`,
    },
    {
      language: 'java',
      title: '2. Post-Modell — hier wird die publishId gespeichert',
      code: `public class Post {
    private String publishId;   // null bis zur ersten Veröffentlichung
    private String text;
    private String imagePath;   // optional, z. B. "images/foto.png"
    private int likeCount;
    private List<Comment> comments = new ArrayList<>();

    public String getPublishId() { return publishId; }
    public void setPublishId(String publishId) { this.publishId = publishId; }
    // ... weitere Getter/Setter
}

// nach dem Veröffentlichen:
post.setPublishId(result.postId());  // z. B. "3f2b9c1e-8a4d-4e6f-9b2a-1c7d5e8f0a12"`,
      note: `**Wichtig:** Die \`publishId\` gehört **in euer Post-Objekt**, nicht in eine lokale Variable. Beim ersten \`publish\` ist sie \`null\`, danach steht dort die UUID vom Server. Wird der Post gespeichert (z. B. als JSON-Datei), muss \`publishId\` mitgespeichert werden. Geht sie verloren, entsteht beim nächsten Veröffentlichen ein **neuer** Post statt eines Republish.`,
    },
    {
      language: 'java',
      title: '3. Synchron (außerhalb des UI-Threads)',
      code: `import social.publish.PostPublisher;
import social.publish.PostPublisher.CommentData;
import social.publish.PostPublisher.PublishResult;
import social.publish.PublishException;

// eigenes Modell -> Bibliotheks-Typen mappen (eigene Feldnamen bleiben intern erhalten)
List<CommentData> comments = post.getComments().stream()
        .map(c -> new CommentData(c.getText(), c.getTimestamp()))
        .toList();

try {
    // publishId: null/leer = neue ID, gesetzt = Republish (gleicher Author)
    // imagePath: null/leer = ohne Bild, sonst lädt die Bibliothek das Bild hoch
    PublishResult result = PostPublisher.publish(
            post.getPublishId(), post.getText(), post.getImagePath(),
            post.getLikeCount(), comments);

    post.setPublishId(result.postId());
    statusLabel.setText("Post veröffentlicht (Status " + result.statusCode() + ")");
} catch (IllegalArgumentException e) {
    statusLabel.setText("Ungültiges Bild: " + e.getMessage());
} catch (PublishException e) {
    statusLabel.setText("Veröffentlichen fehlgeschlagen: " + e.getMessage());
}`,
      note: `**Wichtig:** \`publish\` blockiert bis zur Server-Antwort — nie direkt im JavaFX-Application-Thread aufrufen, sonst friert die UI ein (dafür Beispiel 4). \`result.postId()\` **immer** speichern, sonst wird beim nächsten Mal ein neuer Post statt eines Republish erzeugt. Beide Exceptions getrennt fangen: \`IllegalArgumentException\` = Bildproblem, \`PublishException\` = Netzwerk/Server.`,
    },
    {
      language: 'java',
      title: '4. JavaFX — asynchron (empfohlen)',
      code: `// Gleiche Regeln wie synchron — die UI friert nicht ein
PostPublisher.publishAsync(post.getPublishId(), post.getText(), post.getImagePath(),
        post.getLikeCount(), comments)
    .thenAccept(result -> Platform.runLater(() -> {
        post.setPublishId(result.postId());  // bleibt bei Republish gleich
        statusLabel.setText("Post veröffentlicht (Status " + result.statusCode() + ")");
    }))
    .exceptionally(ex -> {
        // Cause: PublishException oder IllegalArgumentException (ungültiges Bild)
        Platform.runLater(() ->
            statusLabel.setText("Fehler: " + ex.getCause().getMessage()));
        return null;
    });`,
      note: `**Wichtig:** Der Callback läuft *nicht* im UI-Thread — jede Änderung an Labels/Nodes gehört in \`Platform.runLater(...)\`. In \`exceptionally\` steckt der eigentliche Fehler in \`ex.getCause()\` (die Exception ist in eine \`CompletionException\` verpackt). \`return null;\` ist Pflicht, weil \`exceptionally\` einen Wert erwartet.`,
    },
    {
      language: 'java',
      title: '5. Optional — mit avatarId',
      code: `// avatarId steht VOR imagePath (6 Parameter). imagePath darf null sein.
PublishResult result = PostPublisher.publish(
        post.getPublishId(),
        post.getText(),
        "avatar_female_german_01",
        post.getImagePath(),
        post.getLikeCount(),
        comments
);`,
      note: `**Wichtig:** Reihenfolge beachten — \`avatarId\` ist der **3.** Parameter, *vor* \`imagePath\`. Verwechselt man beide, wird der Avatar-Name als Bildpfad gelesen → \`IllegalArgumentException\`. Gültige IDs stehen unter [Available avatars](#avatars).`,
    },
    {
      language: 'java',
      title: '6. Optional — Kommentar-IDs selbst setzen',
      code: `List<CommentData> comments = post.getComments().stream()
        .map(c -> new CommentData(c.getId(), c.getText(), c.getTimestamp()))
        .toList();`,
      note: `**Wichtig:** Eigene IDs müssen pro Post eindeutig und stabil sein — beim Republish dieselbe ID wieder senden, sonst erscheint der Kommentar doppelt. Wer keine IDs hat, nimmt den 2-Parameter-Konstruktor aus Beispiel 3.`,
    },
  ],
  curl: {
    language: 'curl',
    title: 'POST /api/post — curl',
    code: `curl -sS -X POST ${BASE_URL}/api/post \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json' \\
  -d '{
    "post": {
      "id": "11111111-1111-1111-1111-111111111111",
      "text": "Hallo Hochschule Reutlingen!",
      "likeCount": 0,
      "comments": [],
      "avatarId": "avatar_female_german_01"
    }
  }'`,
      note: `**Wichtig:** Der Body muss in \`{ "post": { … } }\` verpackt sein (Aufbau siehe [Beispiel-Daten](#example-json)). \`id\` muss eine UUID sein — gleiche \`id\` = Republish. Einfache Anführungszeichen um \`-d '…'\`, damit die Shell die JSON-Quotes nicht anfasst.`,
  },
  bash: {
    language: 'bash',
    title: 'POST /api/post — Bash',
    code: `#!/usr/bin/env bash
BASE_URL="${BASE_URL}"  # local: http://localhost:3000
curl -sS -X POST "$BASE_URL/api/post" \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json' \\
  -d @- <<'EOF'
{
  "post": {
    "id": "11111111-1111-1111-1111-111111111111",
    "text": "Hallo Hochschule Reutlingen!",
    "likeCount": 1,
    "comments": [
      {
        "text": "Ohne id — Server/Bibliothek vergibt UUID",
        "timestamp": "2026-09-26T12:05:00"
      }
    ],
    "avatarId": "avatar_female_german_01"
  }
}
EOF`,
      note: `**Wichtig:** \`<<'EOF'\` mit Quotes schreiben — dann ersetzt Bash nichts im JSON (z. B. \`$\`). \`timestamp\` im Format \`YYYY-MM-DDTHH:mm:ss\` ohne Zeitzone. \`BASE_URL\` für lokale Tests auf \`http://localhost:3000\` setzen.`,
  },
}

const PUBLISH_MD = `Client: [\`social-publish-client\` ${CLIENT_VERSION}](${CLIENT_REPO}). Immer \`post.getPublishId()\` übergeben — die Bibliothek entscheidet intern:

- **null / leer** → neue Post-ID (Erstveröffentlichung)
- **gesetzt** → Republish (gleicher Author)
- danach speichern: \`post.setPublishId(result.postId())\`

**Bild (optional):** nur den Pfad übergeben (\`post.getImagePath()\`), PNG oder JPG, max. 5 MB. Die Bibliothek lädt das Bild selbst hoch. \`null\` oder leer = Post ohne Bild. Fehlt die Datei, ist sie zu groß oder kein PNG/JPG, kommt eine \`IllegalArgumentException\`.

Für Like / Kommentar: erneut \`publish(publishId, …)\` — der Server übernimmt den Author.

Kommentar-IDs: weglassen (Bibliothek vergibt sie) oder optional mitsenden.

Wie ein vollständiger Post als JSON aussieht: [Beispiel-Daten (JSON)](#example-json).
`

const EXAMPLE_JSON = `{
  "post": {
    "publishId": "3f2b9c1e-8a4d-4e6f-9b2a-1c7d5e8f0a12",
    "imagePath": "images/foto.png",
    "text": "Mein einziger Post!",
    "likeCount": 3,
    "comments": [
      { "id":"xxx", "text": "Sehe ich auch so!", "timestamp": "2026-09-22T19:12:52" },
      { "id":"zzz", "text": "Top Beitrag!", "timestamp": "2026-09-22T19:15:03" },
      { "id":"yyy", "text": "Kurzer Kommentar", "timestamp": "2026-09-22T19:20:11" }
    ]
  }
}`

const EXAMPLE_JSON_MD = `So sieht ein Post als JSON aus — genau diese Struktur mappt die Bibliothek aus eurem Modell (Beispiel 3 unter [Post veröffentlichen](#publish)).

- \`post\` (Objekt) — Alles steckt in diesem Wrapper — ohne \`post\` lehnt der Server ab.
- \`publishId\` (String, optional) — Fehlt beim ersten Mal. Danach die UUID aus \`result.postId()\` — so speichert ihr euren Post lokal, damit Republish funktioniert.
- \`imagePath\` (String, optional) — Lokaler Pfad, **nur in Java**. PNG/JPG, max. 5 MB. Die Bibliothek lädt die Datei hoch; über curl wird kein lokaler Pfad gesendet.
- \`text\` (String) — Der Post-Text, darf nicht leer sein.
- \`likeCount\` (Zahl) — Ganze Zahl ≥ 0. Für ein Like: erhöhen und erneut \`publish(publishId, …)\`.
- \`comments\` (Array) — Darf leer sein (\`[]\`), aber nicht fehlen.
- \`comments[].id\` (String, optional) — Weglassen → UUID wird vergeben. Selbst gesetzt → pro Post eindeutig und beim Republish gleich lassen.
- \`comments[].timestamp\` (String) — \`YYYY-MM-DDTHH:mm:ss\`, ohne Zeitzone.

**Achtung:** JSON erlaubt keine Kommentare und kein Komma nach dem letzten Element.
`

const AVATARS_MD = `Optional: \`PostPublisher.publish(publishId, text, "avatar_female_german_01", imagePath, likeCount, comments)\` — \`avatarId\` steht vor \`imagePath\`.

Package: [\`@wq-org/avatars\`](${AVATARS_REPO}) · Repository: [\`wq-org/wq-avatars\`](${AVATARS_REPO}).
`

export function DocsPage() {
  return (
    <DemoPage
      title="API docs"
      description={`Java students publish with PostPublisher (social-publish-client ${CLIENT_VERSION}). Pass publishId every time; the library generates or reuses it.`}
      align="start"
      className="max-w-4xl pt-10 pb-32"
    >
      <div className="w-full space-y-16 text-left">
        <section id="java-setup" className="scroll-mt-24 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Java 25 (OpenJDK) installieren
          </h2>
          <JavaSetupTabs />
        </section>

        <Separator />

        <section id="publish" className="scroll-mt-24 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Post veröffentlichen
          </h2>
          <DocsMarkdown>{PUBLISH_MD}</DocsMarkdown>
          <DocsRequestTabs snippets={PUBLISH_SNIPPETS} />
        </section>

        <Separator />

        <section id="example-json" className="scroll-mt-24 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Beispiel-Daten (JSON)
          </h2>
          <DocsCodeBlock language="json" title="post.json" code={EXAMPLE_JSON} />
          <DocsMarkdown>{EXAMPLE_JSON_MD}</DocsMarkdown>
        </section>

        <Separator />

        <section id="avatars" className="scroll-mt-24 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Available avatars
          </h2>
          <DocsMarkdown>{AVATARS_MD}</DocsMarkdown>
          <AvatarCatalogTable />
        </section>
      </div>
    </DemoPage>
  )
}
