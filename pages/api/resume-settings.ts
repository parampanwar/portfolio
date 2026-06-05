import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

// Helper to verify admin JWT token
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

type ApiResponse = {
  success?: boolean;
  url?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { db } = await connectToDatabase();

    // GET: Retrieve current live resume URL
    if (req.method === "GET") {
      const setting = await db.collection("settings").findOne({ key: "resume_url" });
      const currentUrl = setting ? setting.value : "/resume/param_panwar.pdf";
      return res.status(200).json({ url: currentUrl });
    }

    // POST: Update live resume URL
    if (req.method === "POST") {
      if (!verifyAdmin(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { url } = req.body ?? {};
      if (!url) {
        return res.status(400).json({ error: "No URL provided" });
      }

      await db.collection("settings").updateOne(
        { key: "resume_url" },
        {
          $set: {
            value: url,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, url });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("Error managing resume settings:", e);
    return res.status(500).json({ error: e?.message || "Internal server error" });
  }
}
