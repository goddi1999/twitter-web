import { DemoPage } from '@/components/demo-page'

import { AvatarCatalogTable } from './avatar-table'
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
    },
    {
      language: 'java',
      title: '2. Synchron (außerhalb des UI-Threads)',
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
    },
    {
      language: 'java',
      title: '3. JavaFX — asynchron (empfohlen)',
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
    },
    {
      language: 'java',
      title: '4. Optional — mit avatarId',
      code: `// avatarId steht VOR imagePath (6 Parameter). imagePath darf null sein.
PublishResult result = PostPublisher.publish(
        post.getPublishId(),
        post.getText(),
        "avatar_female_german_01",
        post.getImagePath(),
        post.getLikeCount(),
        comments
);`,
    },
    {
      language: 'java',
      title: '5. Optional — Kommentar-IDs selbst setzen',
      code: `List<CommentData> comments = post.getComments().stream()
        .map(c -> new CommentData(c.getId(), c.getText(), c.getTimestamp()))
        .toList();`,
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
  },
}

const PUBLISH_MD = `Client: [\`social-publish-client\` ${CLIENT_VERSION}](${CLIENT_REPO}). Immer \`post.getPublishId()\` übergeben — die Bibliothek entscheidet intern:

- **null / leer** → neue Post-ID (Erstveröffentlichung)
- **gesetzt** → Republish (gleicher Author)
- danach speichern: \`post.setPublishId(result.postId())\`

**Bild (optional):** nur den Pfad übergeben (\`post.getImagePath()\`), PNG oder JPG, max. 5 MB. Die Bibliothek lädt das Bild selbst hoch. \`null\` oder leer = Post ohne Bild. Fehlt die Datei, ist sie zu groß oder kein PNG/JPG, kommt eine \`IllegalArgumentException\`.

Für Like / Kommentar: erneut \`publish(publishId, …)\` — der Server übernimmt den Author.

Kommentar-IDs: weglassen (Bibliothek vergibt sie) oder optional mitsenden.
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
      className="max-w-4xl pt-6 pb-24"
    >
      <div className="w-full space-y-12 text-left">
        <section id="java-setup" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Java 25 (OpenJDK) installieren
          </h2>
          <JavaSetupTabs />
        </section>

        <section id="publish" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Post veröffentlichen
          </h2>
          <DocsMarkdown>{PUBLISH_MD}</DocsMarkdown>
          <DocsRequestTabs snippets={PUBLISH_SNIPPETS} />
        </section>

        <section id="avatars" className="scroll-mt-24 space-y-4">
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
