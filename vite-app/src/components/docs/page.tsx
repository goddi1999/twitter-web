import { DemoPage } from '@/components/demo-page'

import { AvatarCatalogTable } from './avatar-table'
import { DocsMarkdown } from './markdown'
import { DocsRequestTabs, type RequestTabId } from './request-tabs'

/** Official production API base. Local: `npx vercel dev` → http://localhost:3000 */
const BASE_URL = 'https://twitter-web-inky.vercel.app'

const LIST_SNIPPETS: Record<
  RequestTabId,
  { language: 'java' | 'bash' | 'curl'; title: string; code: string }
> = {
  java: {
    language: 'java',
    title: 'GET /api/posts — Java',
    code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String baseUrl = "${BASE_URL}"; // local: http://localhost:3000

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + "/api/posts"))
        .header("Accept", "application/json")
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
  },
  curl: {
    language: 'curl',
    title: 'GET /api/posts — curl',
    code: `curl -sS ${BASE_URL}/api/posts \\
  -H 'Accept: application/json'`,
  },
  bash: {
    language: 'bash',
    title: 'GET /api/posts — Bash',
    code: `#!/usr/bin/env bash
BASE_URL="${BASE_URL}"  # local: http://localhost:3000
curl -sS "$BASE_URL/api/posts" -H 'Accept: application/json'`,
  },
}

const PUBLISH_SNIPPETS: Record<
  RequestTabId,
  | { language: 'java' | 'bash' | 'curl'; title: string; code: string }
  | { language: 'java' | 'bash' | 'curl'; title: string; code: string }[]
> = {
  java: [
    {
      language: 'bash',
      title: '1. Dependency (build.gradle)',
      code: `repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.GITHUB-USER:social-publish-client:1.0.0'
}`,
    },
    {
      language: 'java',
      title: '2. Synchron (außerhalb des UI-Threads)',
      code: `import social.publish.PostPublisher;
import social.publish.PostPublisher.CommentData;
import social.publish.PostPublisher.PublishResult;
import social.publish.PublishException;

// Kommentare mappen — ohne eigene IDs (Bibliothek generiert sie)
List<CommentData> comments = post.getComments().stream()
        .map(c -> new CommentData(c.getText(), c.getTimestamp()))
        .toList();

try {
    // Immer post.getPublishId() übergeben — die Bibliothek entscheidet intern:
    // null/leer → neue ID (Erstveröffentlichung)
    // gesetzt → Republish (gleicher Author)
    PublishResult result = PostPublisher.publish(
            post.getPublishId(), post.getText(), post.getLikeCount(), comments);

    post.setPublishId(result.postId());
    statusLabel.setText("Post veröffentlicht (Status " + result.statusCode() + ")");
} catch (PublishException e) {
    statusLabel.setText("Veröffentlichen fehlgeschlagen: " + e.getMessage());
}`,
    },
    {
      language: 'java',
      title: '3. Optional — Kommentar-IDs selbst setzen',
      code: `List<CommentData> comments = post.getComments().stream()
        .map(c -> new CommentData(c.getId(), c.getText(), c.getTimestamp()))
        .toList();`,
    },
    {
      language: 'java',
      title: '4. Optional — mit avatarId',
      code: `PublishResult result = PostPublisher.publish(
        post.getPublishId(),
        post.getText(),
        "avatar_female_german_01",
        post.getLikeCount(),
        comments
);`,
    },
    {
      language: 'java',
      title: '5. JavaFX — asynchron (empfohlen)',
      code: `// UI nicht blockieren — gleiche ID-Regel wie synchron
PostPublisher.publishAsync(post.getPublishId(), post.getText(), post.getLikeCount(), comments)
    .thenAccept(result -> Platform.runLater(() -> {
        post.setPublishId(result.postId());
        statusLabel.setText("Post veröffentlicht (Status " + result.statusCode() + ")");
    }))
    .exceptionally(ex -> {
        Platform.runLater(() ->
            statusLabel.setText("Fehler: " + ex.getCause().getMessage()));
        return null;
    });`,
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

const INTRO_MD = `**Official API:** [\`${BASE_URL}\`](${BASE_URL})

**Local:** \`http://localhost:3000\` via \`npx vercel dev\`

**Endpoints:** \`GET /api/posts\` · \`POST /api/post\`

Java is the primary client for the course. curl / Bash are for quick checks.
`

const LIST_MD = `Returns \`posts\` (latest per \`post.id\` for the feed) and \`publishes\` (full history).
`

const PUBLISH_MD = `## Was die Studierenden schreiben

Immer \`post.getPublishId()\` übergeben — die Bibliothek entscheidet intern:

- **null / leer** → neue Post-ID (Erstveröffentlichung)
- **gesetzt** → Republish (gleicher Author)
- danach speichern: \`post.setPublishId(result.postId())\`

Kommentar-IDs genauso: weglassen (Bibliothek generiert) oder optional mitsenden.

Für Like / Kommentar: erneut \`publish(postId, …)\` — Server reused den Author.

\`avatarId\` ist komplett optional (Tabelle unten).
`

const AVATARS_MD = `Optional: \`PostPublisher.publish(publishId, text, "avatar_female_german_01", likeCount, comments)\`.
`

export function DocsPage() {
  return (
    <DemoPage
      eyebrow="docs"
      title="API docs"
      description="Official production API. Java students use PostPublisher — pass publishId every time; the library generates or reuses it."
      align="start"
      className="max-w-4xl pb-24"
    >
      <div className="w-full space-y-12 text-left">
        <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-3">
          <DocsMarkdown>{INTRO_MD}</DocsMarkdown>
        </div>

        <section id="list" className="scroll-mt-8 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">List posts</h2>
          <DocsMarkdown>{LIST_MD}</DocsMarkdown>
          <DocsRequestTabs snippets={LIST_SNIPPETS} />
        </section>

        <section id="publish" className="scroll-mt-8 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Publish — Studierenden-Referenz
          </h2>
          <DocsMarkdown>{PUBLISH_MD}</DocsMarkdown>
          <DocsRequestTabs snippets={PUBLISH_SNIPPETS} />
        </section>

        <section id="avatars" className="scroll-mt-8 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Available avatars</h2>
          <DocsMarkdown>{AVATARS_MD}</DocsMarkdown>
          <AvatarCatalogTable />
        </section>
      </div>
    </DemoPage>
  )
}
