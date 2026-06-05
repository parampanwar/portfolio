import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash, FaDownload, FaUpload, FaFilePdf, FaEye, FaSignOutAlt, FaPlus, FaCheck,
} from "react-icons/fa";
import {
  FileText, PlusCircle, BookOpen, Eye, Pencil, ExternalLink, ArrowLeft, Image as ImageIcon, Copy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { getAllPosts, type BlogMeta } from "@/lib/blog";
import { siteConfig } from "@/data/portfolio";
import { formatDate, slugify } from "@/lib/utils";
import { connectToDatabase } from "@/lib/mongodb";

interface Props {
  initialPosts: BlogMeta[];
  totalReads: number;
  avgTimeSpent: string;
  resumeDownloads: number;
}

// ─── Resume section (kept from original) ────────────────────────────────────
function ResumeManager() {
  const { user } = useAuth(true);
  const [resumeUrl, setResumeUrl] = useState<string>("/resume/param_panwar.pdf");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadResumeSetting = useCallback(async () => {
    try {
      const res = await fetch("/api/resume-settings");
      if (res.ok) {
        const data = await res.json();
        setResumeUrl(data.url);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (user) loadResumeSetting();
  }, [user, loadResumeSetting]);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const uploadResume = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      // 1. Convert file to base64 Data URL
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // 2. Upload to Cloudinary via /api/upload
        const token = localStorage.getItem("access_token");
        const tokenType = localStorage.getItem("token_type") || "Bearer";
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
          body: JSON.stringify({ file: base64Data }),
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload to Cloudinary");
        }

        const uploadData = await uploadRes.json();
        if (!uploadData.success || !uploadData.url) {
          throw new Error(uploadData.message || "Failed to upload to Cloudinary");
        }

        // 3. Save URL in MongoDB settings
        const settingsRes = await fetch("/api/resume-settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
          body: JSON.stringify({ url: uploadData.url }),
        });

        if (settingsRes.ok) {
          setResumeUrl(uploadData.url);
          setSelectedFile(null);
          alert("Resume updated successfully!");
        } else {
          alert("Failed to save resume settings in database.");
        }
        setIsUploading(false);
      };
    } catch (e: any) {
      alert(e?.message || "Upload failed");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current resume info */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-text-primary text-sm mb-2">
          Current Live Resume
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FaFilePdf className="text-signal text-2xl shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-text-secondary truncate font-mono">
                {resumeUrl}
              </p>
            </div>
          </div>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs py-2 px-4 shrink-0 flex items-center gap-2"
          >
            <FaEye size={12} /> View Live
          </a>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          dragActive ? "border-signal bg-signal/5" : "border-rim hover:border-rim-2"
        }`}
      >
        <FaFilePdf className="text-3xl text-signal mx-auto mb-3" />
        <p className="text-text-secondary text-sm mb-3">
          {selectedFile ? selectedFile.name : "Drag & drop PDF here, or click to browse"}
        </p>
        <input
          type="file"
          accept=".pdf"
          id="resume-upload"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />
        <label
          htmlFor="resume-upload"
          className="btn-ghost text-xs py-2 px-4 cursor-pointer"
        >
          Browse
        </label>
      </div>

      {selectedFile && (
        <button
          onClick={uploadResume}
          disabled={isUploading}
          className="btn-primary w-full justify-center"
        >
          {isUploading ? "Uploading…" : <><FaUpload /> Upload & Set Live Resume</>}
        </button>
      )}
    </div>
  );
}

// ─── Blog post manager & editor ──────────────────────────────────────────────
function BlogManager({ posts: initialPosts }: { posts: BlogMeta[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogMeta[]>(initialPosts);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [author, setAuthor] = useState("Param Panwar");
  
  // Flags
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sync initialPosts if they change
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Handle title changes to auto-generate slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (view === "create" && !isSlugCustomized) {
      setSlug(slugify(val));
    }
  };

  // Prepopulate form on editing
  const startEdit = async (postMeta: BlogMeta) => {
    setError(null);
    setIsSaving(false);
    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";
      
      const res = await fetch(`/api/blogs/${postMeta.slug}`, {
        headers: { Authorization: `${tokenType} ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const fullPost = data.post;
        setSelectedPost(fullPost);
        setTitle(fullPost.title);
        setSlug(fullPost.slug);
        setExcerpt(fullPost.excerpt);
        setContent(fullPost.content);
        setTags(fullPost.tags.join(", "));
        setCoverImage(fullPost.coverImage || "");
        setFeatured(!!fullPost.featured);
        setAuthor(fullPost.author || "Param Panwar");
        setIsSlugCustomized(true);
        setView("edit");
      } else {
        alert(data.message || "Failed to load post content");
      }
    } catch {
      alert("Failed to load post content");
    }
  };

  // Start creation form
  const startCreate = () => {
    setError(null);
    setIsSaving(false);
    setSelectedPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setTags("");
    setCoverImage("");
    setFeatured(false);
    setAuthor("Param Panwar");
    setIsSlugCustomized(false);
    setView("create");
  };

  // Cloudinary image upload handler for Cover
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        const token = localStorage.getItem("access_token");
        const tokenType = localStorage.getItem("token_type") || "Bearer";
        
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
          body: JSON.stringify({ file: base64data }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setCoverImage(data.url);
          setUploadedImages((prev) => [data.url, ...prev]);
        } else {
          setError(data.message || "Upload failed");
        }
      } catch {
        setError("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    };
  };

  // Inline upload helper (adds to history for copy-pasting Markdown)
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        const token = localStorage.getItem("access_token");
        const tokenType = localStorage.getItem("token_type") || "Bearer";
        
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
          body: JSON.stringify({ file: base64data }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setUploadedImages((prev) => [data.url, ...prev]);
        } else {
          setError(data.message || "Upload failed");
        }
      } catch {
        setError("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    };
  };

  // Handle post save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      setError("Title, Slug, and Content are required fields.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      tags: tagsArray,
      coverImage: coverImage || null,
      featured,
      author,
    };

    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";
      
      const url = view === "create" ? "/api/blogs" : `/api/blogs/${selectedPost.slug}`;
      const method = view === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokenType} ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setView("list");
        router.replace(router.asPath); // Refresh serverside props to reload list
      } else {
        setError(data.message || "Failed to save post");
      }
    } catch {
      setError("An error occurred while saving the post");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (postSlug: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";

      const res = await fetch(`/api/blogs/${postSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.replace(router.asPath); // Refresh serverside props to reload list
      } else {
        alert(data.message || "Failed to delete post");
      }
    } catch {
      alert("Failed to delete post");
    }
  };

  const copyMarkdown = (url: string, index: number) => {
    const md = `![Image](${url})`;
    navigator.clipboard.writeText(md).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {view === "list" ? (
        <>
          {/* Action Row */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg text-text-primary">Manage Blog Posts</h2>
            <button
              onClick={startCreate}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Add New Post
            </button>
          </div>

          {/* Post list */}
          <div className="space-y-3">
            {posts.length === 0 && (
              <p className="text-text-muted text-sm text-center py-10">
                No blog posts yet. Click "Add New Post" to write your first one.
              </p>
            )}

            {posts.map((post) => (
              <div key={post.slug} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.featured && <span className="pill text-[10px] py-0.5 px-2">Featured</span>}
                    <span className="text-xs font-mono text-text-muted">{formatDate(post.date)}</span>
                    <span className="text-xs font-mono text-text-muted">· {post.readingTime}</span>
                  </div>
                  <p className="font-display font-semibold text-sm text-text-primary truncate">
                    {post.title}
                  </p>
                  <div className="flex gap-1.5 mt-1">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="pill-muted text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(post)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-rim text-text-muted hover:text-signal hover:border-signal/40 transition-all"
                    title="Edit post"
                  >
                    <Pencil size={13} />
                  </button>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-rim text-text-muted hover:text-signal hover:border-signal/40 transition-all"
                    title="View post"
                  >
                    <ExternalLink size={13} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-rim text-text-muted hover:text-red-400 hover:border-red-400/40 transition-all"
                    title="Delete post"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Edit or Create views */
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("list")}
              className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 font-mono"
            >
              <ArrowLeft size={12} /> Back to list
            </button>
          </div>

          <div className="card p-6 md:p-8 space-y-6">
            <h2 className="font-display font-bold text-xl text-text-primary">
              {view === "create" ? "Create New Blog Post" : "Edit Blog Post"}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title & Slug */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label" htmlFor="post-title">Title</label>
                  <input
                    id="post-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter blog post title"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="post-slug">Slug</label>
                  <input
                    id="post-slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      setIsSlugCustomized(true);
                    }}
                    placeholder="post-url-slug"
                    className="input-field font-mono"
                  />
                </div>
              </div>

              {/* Author & Tags */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label" htmlFor="post-author">Author</label>
                  <input
                    id="post-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Param Panwar"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="post-tags">Tags (comma-separated)</label>
                  <input
                    id="post-tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="React, Next.js, Webdev"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Input */}
              <div>
                <label className="field-label">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload below"
                    className="input-field font-mono"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="btn-ghost text-xs py-3 px-5 cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-display"
                  >
                    {isUploading ? (
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ImageIcon size={14} />
                    )}
                    Upload Cover
                  </label>
                </div>
                {coverImage && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-rim max-w-xs bg-surface-2 aspect-[16/9]">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="field-label" htmlFor="post-excerpt">Excerpt (1-2 sentences)</label>
                <textarea
                  id="post-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Provide a brief summary of the post..."
                  className="textarea-field min-h-[60px]"
                />
              </div>

              {/* Content Editor & Image Helper */}
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <label className="field-label" htmlFor="post-content">Markdown Content</label>
                  <textarea
                    id="post-content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Write your blog post in Markdown..."
                    className="textarea-field min-h-[400px] font-mono leading-relaxed"
                  />
                </div>

                {/* Inline Image Upload Helper */}
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="field-label">Inline Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      id="inline-upload"
                      className="hidden"
                      onChange={handleInlineImageUpload}
                    />
                    <label
                      htmlFor="inline-upload"
                      className="btn-ghost w-full justify-center text-xs py-3 cursor-pointer flex items-center gap-1.5 font-display"
                    >
                      {isUploading ? (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ImageIcon size={14} />
                      )}
                      Upload Image
                    </label>
                    <p className="text-[10px] text-text-muted mt-1.5 leading-relaxed font-mono">
                      Upload images here to generate Markdown snippets for paste.
                    </p>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">History</p>
                      {uploadedImages.map((imgUrl, idx) => (
                        <div key={idx} className="p-2 card bg-surface-2 border border-rim flex items-center justify-between gap-2">
                          <img src={imgUrl} className="w-8 h-8 rounded object-cover border border-rim shrink-0" />
                          <button
                            type="button"
                            onClick={() => copyMarkdown(imgUrl, idx)}
                            className="btn-ghost !p-1.5 rounded text-[10px] flex items-center gap-1 text-text-muted hover:text-signal hover:border-signal/40 font-mono"
                          >
                            {copiedIndex === idx ? <FaCheck size={10} className="text-signal" /> : <Copy size={11} />}
                            {copiedIndex === idx ? "Copied" : "Copy"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="post-featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-rim bg-surface-2 text-signal focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label className="text-sm text-text-secondary select-none cursor-pointer" htmlFor="post-featured">
                  Feature this post (highlight it at the top of the blog page)
                </label>
              </div>

              {/* Error displaying */}
              {error && (
                <p className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl p-3">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs py-3 px-6"
                >
                  {isSaving ? "Saving..." : "Save Post"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="btn-ghost text-xs py-3 px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main admin page ─────────────────────────────────────────────────────────
export default function AdminPage({
  initialPosts,
  totalReads,
  avgTimeSpent,
  resumeDownloads,
}: Props) {
  const { user, logout, loading } = useAuth(true);
  const [tab, setTab] = useState<"blog" | "resume">("blog");
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const cleanUrl = url.split("?")[0];
      if (cleanUrl !== "/admin") {
        ["access_token", "token_type", "user"].forEach((k) =>
          localStorage.removeItem(k)
        );
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-signal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Admin — {siteConfig.name}</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </Head>

      <main className="min-h-screen pt-10">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <span className="pill mb-2">Admin Dashboard</span>
              <h1 className="font-display text-3xl font-bold text-text-primary mt-2">
                Welcome back
              </h1>
              <p className="text-text-muted text-sm font-mono mt-1">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="btn-ghost text-xs py-2 px-4 flex items-center gap-2"
            >
              <FaSignOutAlt size={12} /> Logout
            </button>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Blog posts", value: initialPosts.length, color: "text-signal" },
              { label: "Total reads", value: totalReads, color: "text-signal" },
              { label: "Avg read time", value: avgTimeSpent, color: "text-signal" },
              { label: "Resume downloads", value: resumeDownloads, color: "text-signal" },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4">
                <p className={`font-display font-bold text-3xl ${color}`}>{value}</p>
                <p className="text-xs text-text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["blog", "resume"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === t ? "bg-signal text-ink" : "border border-rim text-text-muted hover:text-text-primary"
                }`}
              >
                {t === "blog" ? <span className="flex items-center gap-2"><BookOpen size={14} /> Blog Posts</span>
                              : <span className="flex items-center gap-2"><FaFilePdf size={14} /> Résumés</span>}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "blog" ? (
              <BlogManager posts={initialPosts} />
            ) : (
              <ResumeManager />
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await getAllPosts();
  
  let totalReads = 0;
  let avgTimeSpent = "—";
  let resumeDownloads = 0;

  try {
    const { db } = await connectToDatabase();
    const analytics = db.collection("analytics");
    
    totalReads = await analytics.countDocuments({ type: "blog_view" });
    resumeDownloads = await analytics.countDocuments({ type: "resume_download" });
    
    const timeDocs = await analytics.find({ type: "blog_time" }).toArray();
    if (timeDocs.length > 0) {
      const totalSeconds = timeDocs.reduce((acc, doc) => acc + (doc.duration || 0), 0);
      const avgSeconds = Math.round(totalSeconds / timeDocs.length);
      
      if (avgSeconds < 60) {
        avgTimeSpent = `${avgSeconds}s`;
      } else {
        const mins = Math.floor(avgSeconds / 60);
        const secs = avgSeconds % 60;
        avgTimeSpent = secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
      }
    }
  } catch (error) {
    console.error("Failed to fetch analytics for admin dashboard:", error);
  }

  return {
    props: {
      initialPosts: posts,
      totalReads,
      avgTimeSpent,
      resumeDownloads,
    },
  };
};
