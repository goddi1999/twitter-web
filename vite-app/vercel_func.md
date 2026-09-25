Yes. For that Post/Comment exercise, I’d make a tiny Vercel Java API that accepts JSON and returns the result. The uploaded Cisco .dmg isn’t needed for this part.

Assuming the Java model should be:

Post:
- Post(String text)
- String getText()
- void setText(String text)
- int getLikeCount()
- void like()
- List<Comment> getComments()
- void addComment(Comment c)
- void removeComment(Comment c)
Comment:
- String text
- timestamp

A simple Vercel function could expose operations like:

POST /api/post
POST /api/post/like
POST /api/post/comment
DELETE /api/post/comment

For example, if you want one very simple function for students:

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
public class Post {
    private String text;
    private int likeCount;
    private final List<Comment> comments;
    public Post(String text) {
        setText(text);
        this.likeCount = 0;
        this.comments = new ArrayList<>();
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Text darf nicht leer sein.");
        }
        if (text.length() > 280) {
            throw new IllegalArgumentException(
                "Text darf maximal 280 Zeichen lang sein."
            );
        }
        this.text = text;
    }
    public int getLikeCount() {
        return likeCount;
    }
    public void like() {
        likeCount++;
    }
    public List<Comment> getComments() {
        return List.copyOf(comments);
    }
    public void addComment(Comment c) {
        if (c == null) {
            throw new IllegalArgumentException(
                "Kommentar darf nicht null sein."
            );
        }
        comments.add(c);
    }
    public void removeComment(Comment c) {
        comments.remove(c);
    }
}

And Comment.java:

import java.time.Instant;
public class Comment {
    private final String text;
    private final Instant timestamp;
    public Comment(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                "Kommentar darf nicht leer sein."
            );
        }
        this.text = text;
        this.timestamp = Instant.now();
    }
    public String getText() {
        return text;
    }
    public Instant getTimestamp() {
        return timestamp;
    }
}

Then the basic usage for the kids is extremely straightforward:

Post post = new Post("Hallo Hochschule Reutlingen!");
post.like();
post.like();
post.addComment(
    new Comment("Cooler Beitrag!")
);
System.out.println(post.getText());
System.out.println(post.getLikeCount());
System.out.println(post.getComments());

Result conceptually:

Hallo Hochschule Reutlingen!
2 Likes
Comments:
- Cooler Beitrag! — 2026-09-25T...

For Vercel specifically

There is one important distinction: the classes above implement your Java exercise, but a Vercel Function needs an HTTP handler around them, and Vercel Functions are stateless.herefore shouldn’t store:

private static List<Post> posts;

and expect posts/comments/likes to persist.

The proper architecture is:

Student Java program
        │
        │ POST /api/posts
        ▼
┌─────────────────────┐
│  Vercel Function    │
│                     │
│ validate text       │
│ max 280 chars       │
│ comments            │
│ likes               │
└──────────┬──────────┘
           │
           ▼
       Database

And if your original goal still applies:

Student
   │
   ▼
HSRT Wi-Fi / VPN
   │
   ▼
Vercel Firewall
   │
   ├── not HSRT IP → 403
   │
   └── HSRT IP
          ↓
      /api/posts
          ↓
       Database

So the Java assignment and the Vercel Function are two different layers. If the goal is that the kids implement Post.java locally and their program sends those posts to your Vercel backend, I can give you the exact t:wq
:wq
ii:v:::







opo::

