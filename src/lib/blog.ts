import { getCollection } from 'astro:content';

export interface BlogPost {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
  author: string;
  tags: string[];
}

export async function fetchBlogPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return posts
    .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime())
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      link: `/blog/${post.id}/`,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      thumbnail: post.data.coverImage,
      author: post.data.author,
      tags: post.data.tags,
    }));
}
