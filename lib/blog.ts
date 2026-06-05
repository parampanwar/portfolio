import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { connectToDatabase } from "./mongodb";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
  featured?: boolean;
  author?: string;
}

export interface BlogMeta extends Omit<BlogPost, "content"> {}

async function autoSeedDatabase() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("blogs");
    const count = await collection.countDocuments();

    if (count > 0) return; // Database already contains posts

    console.log("MongoDB blogs collection is empty. Auto-seeding default markdown posts...");

    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR, { recursive: true });
      return;
    }

    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const seedPosts = files.map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const rt = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || content.slice(0, 150) + "...",
        content,
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        tags: data.tags || [],
        readingTime: rt.text,
        coverImage: data.coverImage || null,
        featured: data.featured || false,
        author: data.author || "Param Panwar",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    if (seedPosts.length > 0) {
      await collection.insertMany(seedPosts);
      console.log(`Seeded ${seedPosts.length} blog posts to MongoDB.`);
    }
  } catch (error) {
    console.error("Auto-seeding error (check MONGODB_URI in .env.local):", error);
  }
}

export async function getAllPosts(): Promise<BlogMeta[]> {
  await autoSeedDatabase();
  try {
    const { db } = await connectToDatabase();
    const posts = await db
      .collection("blogs")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return posts.map((post) => {
      const { _id, content, ...meta } = post as any;
      return { ...meta } as BlogMeta;
    });
  } catch (e) {
    console.error("Failed to load posts from DB:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  await autoSeedDatabase();
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection("blogs").findOne({ slug });
    if (!post) return null;

    const { _id, ...rest } = post as any;
    return rest as BlogPost;
  } catch (e) {
    console.error("Failed to load post from DB by slug:", e);
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  await autoSeedDatabase();
  try {
    const { db } = await connectToDatabase();
    const posts = await db
      .collection("blogs")
      .find({}, { projection: { slug: 1 } })
      .toArray();

    return posts.map((p) => p.slug);
  } catch (e) {
    console.error("Failed to load slugs from DB:", e);
    return [];
  }
}

export async function getFeaturedPosts(limit = 3): Promise<BlogMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.featured).slice(0, limit);
}

export async function getPostsByTag(tag: string): Promise<BlogMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
