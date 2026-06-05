import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";

type ApiResponse = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { type, slug, duration, filename } = req.body ?? {};

  if (!type || !["blog_view", "blog_time", "resume_download"].includes(type)) {
    return res.status(400).json({ success: false, message: "Invalid event type" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("analytics");

    const analyticsDoc: Record<string, any> = {
      type,
      timestamp: new Date().toISOString(),
    };

    if (type === "blog_view") {
      if (!slug) return res.status(400).json({ success: false, message: "Slug is required for blog view" });
      analyticsDoc.slug = String(slug);
    } else if (type === "blog_time") {
      if (!slug || duration === undefined) {
        return res.status(400).json({ success: false, message: "Slug and duration are required for blog time" });
      }
      analyticsDoc.slug = String(slug);
      analyticsDoc.duration = Number(duration);
    } else if (type === "resume_download") {
      analyticsDoc.filename = filename ? String(filename) : "param_panwar.pdf";
    }

    await collection.insertOne(analyticsDoc);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Failed to save analytics:", error);
    // Don't crash client tracking on DB connection failure
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
