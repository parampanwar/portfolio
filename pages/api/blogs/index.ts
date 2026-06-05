import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import readingTime from "reading-time";

type ApiResponse = {
  success: boolean;
  message?: string;
  posts?: any[];
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
  const { db } = await connectToDatabase();
  const collection = db.collection("blogs");

  switch (method) {
    case "GET":
      try {
        const posts = await collection
          .find({})
          .sort({ date: -1 })
          .toArray();

        return res.status(200).json({ success: true, posts });
      } catch (error: any) {
        console.error("Failed to fetch posts:", error);
        return res.status(500).json({ success: false, message: "Database query failed" });
      }

    case "POST":
      // Authorize admin
      if (!verifyAdmin(req)) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      try {
        const {
          title,
          slug,
          excerpt,
          content,
          date,
          tags,
          coverImage,
          featured,
          author,
        } = req.body ?? {};

        if (!title || !slug || !content) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields: title, slug, and content are required",
          });
        }

        // Check for duplicate slug
        const existing = await collection.findOne({ slug });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "A blog post with this slug already exists",
          });
        }

        // Calculate reading time
        const rt = readingTime(content);

        const newPost = {
          title,
          slug,
          excerpt: excerpt || content.slice(0, 150) + "...",
          content,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
          tags: Array.isArray(tags) ? tags : [],
          readingTime: rt.text,
          coverImage: coverImage || null,
          featured: !!featured,
          author: author || "Param Panwar",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await collection.insertOne(newPost);

        return res.status(201).json({ success: true, post: newPost });
      } catch (error: any) {
        console.error("Failed to create post:", error);
        return res.status(500).json({ success: false, message: "Failed to create post" });
      }

    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
