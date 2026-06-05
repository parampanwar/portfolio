import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import readingTime from "reading-time";

type ApiResponse = {
  success: boolean;
  message?: string;
  post?: any;
};

// Helper to verify admin
function verifyAdmin(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token) return false;

  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";

  try {
    const decoded = jwt.verify(token, jwtSecret) as { is_admin: boolean };
    return !!decoded.is_admin;
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { method } = req;
  const slug = req.query.slug as string;
  const { db } = await connectToDatabase();
  const collection = db.collection("blogs");

  if (!slug) {
    return res.status(400).json({ success: false, message: "Slug parameter is required" });
  }

  switch (method) {
    case "GET":
      try {
        const post = await collection.findOne({ slug });

        if (!post) {
          return res.status(404).json({ success: false, message: "Post not found" });
        }

        return res.status(200).json({ success: true, post });
      } catch (error: any) {
        console.error("Failed to fetch post:", error);
        return res.status(500).json({ success: false, message: "Database query failed" });
      }

    case "PUT":
      // Authorize admin
      if (!verifyAdmin(req)) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      try {
        const existing = await collection.findOne({ slug });
        if (!existing) {
          return res.status(404).json({ success: false, message: "Post not found" });
        }

        const {
          title,
          excerpt,
          content,
          date,
          tags,
          coverImage,
          featured,
          author,
        } = req.body ?? {};

        // Recalculate reading time if content changed
        let rtText = existing.readingTime;
        if (content && content !== existing.content) {
          rtText = readingTime(content).text;
        }

        const updatedPost = {
          ...existing,
          title: title !== undefined ? title : existing.title,
          excerpt: excerpt !== undefined ? excerpt : (content ? content.slice(0, 150) + "..." : existing.excerpt),
          content: content !== undefined ? content : existing.content,
          date: date !== undefined ? new Date(date).toISOString() : existing.date,
          tags: tags !== undefined ? (Array.isArray(tags) ? tags : existing.tags) : existing.tags,
          readingTime: rtText,
          coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
          featured: featured !== undefined ? !!featured : existing.featured,
          author: author !== undefined ? author : existing.author,
          updatedAt: new Date().toISOString(),
        };

        // Don't modify the _id field during update
        const { _id, ...updatePayload } = updatedPost;

        await collection.updateOne({ slug }, { $set: updatePayload });

        return res.status(200).json({ success: true, post: updatedPost });
      } catch (error: any) {
        console.error("Failed to update post:", error);
        return res.status(500).json({ success: false, message: "Failed to update post" });
      }

    case "DELETE":
      // Authorize admin
      if (!verifyAdmin(req)) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      try {
        const result = await collection.deleteOne({ slug });

        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: "Post not found" });
        }

        return res.status(200).json({ success: true, message: "Post deleted successfully" });
      } catch (error: any) {
        console.error("Failed to delete post:", error);
        return res.status(500).json({ success: false, message: "Failed to delete post" });
      }

    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
