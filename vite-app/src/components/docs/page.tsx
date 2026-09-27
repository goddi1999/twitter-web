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
      title: '2. Post veröffentlichen',
      code: `import social.publish.PostPublisher;
import social.publish.PostPublisher.CommentData;
import social.publish.PostPublisher.PublishResult;
import social.publish.PublishException;

// eigenes Modell -> Bibliotheks-Typen mappen (eigene Feldnamen bleiben intern erhalten)
List<CommentData> comments = post.getComments().stream()
        .map(c -> new CommentData(c.getText(), c.getTimestamp()))
        .toList();

try {
    PublishResult result = PostPublisher.publish(post.getText(), post.getLikes(), comments);
    statusLabel.setText("Post veröffentlicht (Status " + result.statusCode() + ")");
} catch (PublishException e) {
    statusLabel.setText("Veröffentlichen fehlgeschlagen: " + e.getMessage());
}`,
    },
    {
      language: 'java',
      title: '3. Mit Avatar senden (avatarId)',
      code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

String baseUrl = "${BASE_URL}"; // local: http://localhost:3000

// Avatar-ID aus der Tabelle unten kopieren
String avatarId = "avatar_female_german_01";
String postId = UUID.randomUUID().toString();

String body = """
        {
          "post": {
            "id": "%s",
            "text": "Hallo Hochschule Reutlingen!",
            "likeCount": 0,
            "comments": [],
            "avatarId": "%s"
          }
        }
        """.formatted(postId, avatarId);

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + "/api/post"))
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode() + " " + response.body());`,
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
    title: 'POST /api/post — Bash (with avatarId + comments)',
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
        "id": "22222222-2222-2222-2222-222222222222",
        "text": "Cooler Beitrag!",
        "timestamp": "2026-09-26T12:00:00.000Z"
      },
      {
        "text": "Ohne id — Server vergibt UUID",
        "timestamp": "2026-09-26T12:05:00"
      }
    ],
    "createdAt": "2026-09-26T11:00:00.000Z",
    "avatarId": "avatar_female_german_01"
  }
}
EOF`,
  },
}

const INTRO_MD = `**Official API:** [\`${BASE_URL}\`](${BASE_URL})

**Local:** \`http://localhost:3000\` via \`npx vercel dev\` (plain \`npm run dev\` does **not** serve \`/api\`).

**Endpoints**

- \`GET /api/posts\` — feed + publish history
- \`POST /api/post\` — append a full post document

**Storage:** each publish is a row in Supabase table \`publishes\` (\`post\` jsonb). Same \`post.id\` again = new row; feed uses the **newest** snapshot.

**Auth:** none. CORS allows any origin. Production \`/api\` may require Reutlingen VPN (firewall).

Java is the primary client. Use **curl** or **Bash** from a terminal.
`

const LIST_MD = `Returns JSON:

\`\`\`json
{
  "posts": [ /* latest snapshot per post.id */ ],
  "publishes": [ /* full append log, newest first */ ]
}
\`\`\`

Use \`posts\` for the Home feed. Use \`publishes\` for debugging / history.
`

const PUBLISH_MD = `Always send a stable \`post.id\` (UUID recommended). Response **201** with \`{ "post": { … } }\`.

1. **Dependency** — add the Java client (see tab), or call HTTP directly.
2. **Publish** — map your model and \`POST\` the full document (text, likeCount, comments).
3. **With avatar** — optional \`avatarId\` (e.g. \`avatar_female_german_01\`). The server resolves display name, handle, and CDN image from \`@wq-org/avatars\`. Never send \`displayName\`, \`handle\`, or \`avatarUrl\`.
4. **Comments** — \`id\` and \`timestamp\` are optional (ISO-ish strings). Server fills missing ids/timestamps and assigns comment authors.

Copy an avatar id from the table below.
`

const AVATARS_MD = `Pass the copied id as \`avatarId\` (or \`author: { "id": "…" }\`). Example: \`avatar_female_german_01\`.
`

export function DocsPage() {
  return (
    <DemoPage
      eyebrow="docs"
      title="API docs"
      description="Official production API for listing and publishing posts. Node functions on Vercel, durable Supabase storage, memoji authors by avatarId."
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
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Publish a post</h2>
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
