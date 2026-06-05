import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPostBySlug, getPostSlugs, getAllPosts, type BlogPost, type BlogMeta } from "@/lib/blog";
import { siteConfig } from "@/data/portfolio";
import { formatDate } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface Props {
  post: BlogPost;
  mdxSource: MDXRemoteSerializeResult;
  relatedPosts: BlogMeta[];
}

// Custom MDX components — maps markdown elements to styled components
const MDX_COMPONENTS = {
  // Override nothing yet — all styling via .prose-blog CSS
};

function ShareButton({ title, slug }: { title: string; slug: string }) {
  const handleShare = async () => {
    const url = `${siteConfig.url}/blog/${slug}`;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn-ghost text-xs py-2 px-4 flex items-center gap-2"
    >
      <Share2 size={13} /> Share
    </button>
  );
}

export default function BlogPostPage({ post, mdxSource, relatedPosts }: Props) {
  const ogUrl = `${siteConfig.url}/blog/${post.slug}`;

  useEffect(() => {
    // 1. Track page view
    trackEvent("blog_view", { slug: post.slug });

    // 2. Track read duration
    let startTime = Date.now();
    let accumulatedTime = 0;

    const sendTimeSpent = () => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const totalSessionTime = accumulatedTime + elapsed;
      if (totalSessionTime >= 2 && totalSessionTime < 3600) {
        trackEvent("blog_time", { slug: post.slug, duration: totalSessionTime });
        accumulatedTime = 0;
        startTime = Date.now();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendTimeSpent();
      } else {
        startTime = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendTimeSpent();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [post.slug]);

  return (
    <>
      <Head>
        <title>{post.title} | Param Panwar Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={ogUrl} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title} | Param Panwar Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={ogUrl} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Param Panwar" />
        
        {/* Dynamic Unified BlogPosting & Breadcrumb Schema Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "BreadcrumbList",
                  "@id": `${ogUrl}/#breadcrumb`,
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
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": post.title,
                      "item": ogUrl
                    }
                  ]
                },
                {
                  "@type": "BlogPosting",
                  "@id": `${ogUrl}/#post`,
                  "isPartOf": { "@id": `${ogUrl}/#webpage` },
                  "headline": post.title,
                  "description": post.excerpt,
                  "image": post.coverImage || `${siteConfig.url}/logo.png`,
                  "datePublished": post.date,
                  "dateModified": post.date,
                  "mainEntityOfPage": ogUrl,
                  "wordCount": post.content ? post.content.split(/\s+/).length : 0,
                  "timeRequired": post.readingTime,
                  "author": {
                    "@type": "Person",
                    "name": post.author || siteConfig.name,
                    "url": siteConfig.url
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": siteConfig.name,
                    "logo": {
                      "@type": "ImageObject",
                      "url": `${siteConfig.url}/logo.png`
                    }
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": `${ogUrl}/#webpage`,
                  "url": ogUrl,
                  "name": `${post.title} | Param Panwar Blog`,
                  "description": post.excerpt,
                  "breadcrumb": { "@id": `${ogUrl}/#breadcrumb` }
                }
              ]
            }),
          }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-16">
        <article className="max-w-3xl mx-auto px-6 py-16">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="pill text-xs"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold text-text-primary leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-text-muted font-mono">
                <span className="flex items-center gap-1.5">
                  <User size={13} /> {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {post.readingTime}
                </span>
              </div>
              <ShareButton title={post.title} slug={post.slug} />
            </div>
          </motion.header>

          {/* Cover image */}
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12 rounded-2xl overflow-hidden aspect-[16/9] bg-surface-2"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Divider */}
          <hr className="divider" />

          {/* MDX Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose-blog"
          >
            <MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
          </motion.div>

          {/* Bottom meta */}
          <div className="mt-16 pt-8 border-t border-rim flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">Written by</p>
              <p className="font-display font-semibold text-text-primary">{post.author}</p>
            </div>
            <ShareButton title={post.title} slug={post.slug} />
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-3xl mx-auto px-6 pb-20">
            <h2 className="font-display font-bold text-xl text-text-primary mb-6">
              More posts
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group card p-5 hover:border-signal/30"
                >
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {related.tags.slice(0, 2).map((t) => (
                      <span key={t} className="pill-muted text-[10px]">{t}</span>
                    ))}
                  </div>
                  <h3 className="font-display font-semibold text-sm text-text-primary group-hover:text-signal transition-colors leading-snug mb-1">
                    {related.title}
                  </h3>
                  <span className="text-xs font-mono text-text-muted">{related.readingTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);

  if (!post) return { notFound: true };

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeHighlight],
    },
  });

  // Related posts: same tag, exclude self
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  return {
    props: { post, mdxSource, relatedPosts },
    revalidate: 3600,
  };
};
