import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight, Search, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllPosts, getAllTags, type BlogMeta } from "@/lib/blog";
import { siteConfig, social } from "@/data/portfolio";
import { formatDate, cn } from "@/lib/utils";

interface Props {
  posts: BlogMeta[];
  tags: string[];
}

function PostCard({ post }: { post: BlogMeta; index: number }) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="blog-row">
        <div className="meta flex flex-wrap gap-5">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
        <h2>
          {post.title}{" "}
          <ArrowUpRight
            className="inline-block w-5 h-5 align-baseline"
            aria-hidden="true"
          />
        </h2>
        <p className="text-muted mb-5">{post.excerpt}</p>
        <div className="stack">
          {post.tags.map((tag) => (
            <span className="pill-muted" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}

export default function BlogIndex({ posts, tags }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady)
      setActiveTag(
        typeof router.query.tag === "string" ? router.query.tag : null,
      );
  }, [router.isReady, router.query.tag]);
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
        <title>Software Engineering & AI Blog | Param Panwar</title>
        <meta
          name="description"
          content="Read developer guides, engineering deep dives, and system architecture blueprints focusing on Next.js, FastAPI, PostgreSQL, and AI application design."
        />
        <meta
          name="keywords"
          content="Software Engineering Blog, Next.js tutorials, FastAPI blueprints, Web development articles"
        />
        <link rel="canonical" href={`${siteConfig.url}/blog`} />

        <meta
          property="og:title"
          content="Software Engineering & AI Blog | Param Panwar"
        />
        <meta
          property="og:description"
          content="Read developer guides, engineering deep dives, and system architecture blueprints focusing on Next.js, FastAPI, PostgreSQL, and AI application design."
        />
        <meta property="og:url" content={`${siteConfig.url}/blog`} />

        {/* SERP Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: `${siteConfig.url}/blog`,
                },
              ],
            }),
          }}
        />
      </Head>

      <Navbar />

      <main id="main" className="page-main">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <span className="pill mb-4">Writing</span>
            <h1 className="page-title">Notes from the work.</h1>
            <p className="text-text-secondary max-w-xl text-lg leading-relaxed">
              Thoughts on autonomous AI agents, production RAG pipelines, system design,
              and building software that lasts.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div>
                <label htmlFor="blog-search" className="field-label">
                  Search
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    id="blog-search"
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
                    aria-pressed={!activeTag}
                    onClick={() => setActiveTag(null)}
                    className={cn(
                      "pill-muted text-xs cursor-pointer transition-all",
                      !activeTag &&
                        "!bg-signal/10 !border-signal/40 !text-signal",
                    )}
                  >
                    All
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      aria-pressed={activeTag === tag}
                      onClick={() =>
                        setActiveTag(tag === activeTag ? null : tag)
                      }
                      className={cn(
                        "pill-muted text-xs cursor-pointer transition-all",
                        activeTag === tag &&
                          "!bg-signal/10 !border-signal/40 !text-signal",
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="card p-4 space-y-2">
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Stats
                </p>
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
                  <p>No posts match your search.</p>
                </div>
              ) : (
                <div className="space-y-0">
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
