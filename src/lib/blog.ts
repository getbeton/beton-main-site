export interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
}

export async function fetchBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const res = await fetch('https://blog.getbeton.ai/feed');
    if (!res.ok) return [];
    const xml = await res.text();
    return parseBlogFeed(xml).slice(0, limit);
  } catch {
    // Build continues even if RSS fetch fails
    return [];
  }
}

function parseBlogFeed(xml: string): BlogPost[] {
  const posts: BlogPost[] = [];
  const items = xml.split('<item>').slice(1);

  for (const item of items) {
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    const description = extractTag(item, 'description');
    const thumbnail =
      extractAttr(item, 'media:content', 'url') ||
      extractAttr(item, 'enclosure', 'url') ||
      undefined;

    if (title && link) {
      posts.push({
        title: decodeHtmlEntities(title),
        link,
        pubDate: pubDate || '',
        description: decodeHtmlEntities(stripHtml(description || '').slice(0, 200)),
        thumbnail,
      });
    }
  }

  return posts;
}

function extractTag(xml: string, tag: string): string | null {
  // Handle CDATA sections
  const cdataMatch = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`)
  );
  if (cdataMatch) return cdataMatch[1].trim();

  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : null;
}

function extractAttr(xml: string, tag: string, attr: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, 'i'));
  return match ? match[1] : null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}
