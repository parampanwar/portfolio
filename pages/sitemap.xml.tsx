import type { GetServerSideProps } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { siteConfig } from "@/data/portfolio";

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let posts: Array<{ slug: string; updatedAt?: string; date: string }> = [];
  try {
    const { db } = await connectToDatabase();
    posts = await db
      .collection("blogs")
      .find({}, { projection: { slug: 1, updatedAt: 1, date: 1 } })
      .toArray() as any;
  } catch (e) {
    console.error("Sitemap dynamic database fetch failed:", e);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.url}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteConfig.url}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteConfig.url}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${posts
    .map((post) => {
      const lastMod = post.updatedAt || post.date || new Date().toISOString();
      const formattedDate = new Date(lastMod).toISOString().split("T")[0];
      return `
  <url>
    <loc>${siteConfig.url}/blog/${post.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};
