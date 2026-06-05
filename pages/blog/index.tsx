import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllPosts, getAllTags, type BlogMeta } from "@/lib/blog";
import { siteConfig, social } from "@/data/portfolio";
import { formatDate, cn } from "@/lib/utils";

interface Props {
  posts: BlogMeta[];
  tags: string[];
}

function PostCard({ post, index }: { post: BlogMeta; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block card p-6 hover:border-signal/30"
      >
        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-5 rounded-xl overflow-hidden aspect-[16/9] bg-surface-2">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="pill text-[10px] py-0.5 px-2">
              {tag}
            </span>
          ))}
        </div>

        <h2 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-signal transition-colors leading-snug">
          {post.title}
        </h2>

        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-text-muted font-mono">
          <div className="flex items-center gap-3">
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readingTime}
            </span>
          </div>
          <ArrowRight
            size={14}
            className="text-signal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogIndex({ posts, tags }: Props) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, search, activeTag]);

  const featured = posts.filter((p) => p.featured);

  return (
    <>
      <Head>
        <title>Full-Stack Engineering & AI Blog | Param Panwar</title>
        <meta name="description" content="Read developer guides, engineering deep dives, and system architecture blueprints focusing on Next.js, FastAPI, PostgreSQL, and AI application design." />
        <meta name="keywords" content="Software Engineering Blog, Next.js tutorials, FastAPI blueprints, Web development articles" />
        <link rel="canonical" href={`${siteConfig.url}/blog`} />
        
        <meta property="og:title" content="Full-Stack Engineering & AI Blog | Param Panwar" />
        <meta property="og:description" content="Read developer guides, engineering deep dives, and system architecture blueprints focusing on Next.js, FastAPI, PostgreSQL, and AI application design." />
        <meta property="og:url" content={`${siteConfig.url}/blog`} />
        
        {/* SERP Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": siteConfig.url
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": `${siteConfig.url}/blog`
                }
              ]
            }),
          }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-16">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <span className="pill mb-4">Writing</span>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mt-4 leading-tight mb-4">
              Blog
            </h1>
            <p className="text-text-secondary max-w-xl text-lg leading-relaxed">
              Thoughts on full-stack development, React patterns, system design,
              and building things that last.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div>
                <label className="field-label">Search</label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search posts…"
                    className="input-field pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="field-label">Filter by tag</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={cn(
                      "pill-muted text-xs cursor-pointer transition-all",
                      !activeTag && "!bg-signal/10 !border-signal/40 !text-signal"
                    )}
                  >
                    All
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                      className={cn(
                        "pill-muted text-xs cursor-pointer transition-all",
                        activeTag === tag && "!bg-signal/10 !border-signal/40 !text-signal"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="card p-4 space-y-2">
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Stats</p>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Total posts</span>
                  <span className="font-mono text-signal">{posts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Topics</span>
                  <span className="font-mono text-signal">{tags.length}</span>
                </div>
              </div>
            </aside>

            {/* Posts grid */}
            <div className="lg:col-span-3">
              {filtered.length === 0 ? (
                <div className="text-center py-24 text-text-muted">
                  <p className="text-4xl mb-4">🔍</p>
                  <p>No posts match your search.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filtered.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  return {
    props: { posts, tags },
    // ISR: re-generate at most every hour
    revalidate: 3600,
  };
};
