import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getCloudinaryPublicIdAndType(url: string) {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const prefix = parts[0].split("/");
    const resourceType = prefix[prefix.length - 1] || "raw";

    const pathAfterUpload = parts[1];
    const versionRegex = /^v\d+\//;
    const pathWithoutVersion = pathAfterUpload.replace(versionRegex, "");

    let publicId = pathWithoutVersion;
    if (resourceType !== "raw") {
      const lastDot = pathWithoutVersion.lastIndexOf(".");
      if (lastDot !== -1) {
        publicId = pathWithoutVersion.substring(0, lastDot);
      }
    }

    return { publicId, resourceType };
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error);
    return null;
  }
}

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
  message?: string;
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

    // DELETE: Remove resume and destroy on Cloudinary
    if (req.method === "DELETE") {
      if (!verifyAdmin(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const setting = await db.collection("settings").findOne({ key: "resume_url" });
      if (!setting) {
        return res.status(400).json({ error: "No custom resume uploaded" });
      }

      const url = setting.value;

      if (url.includes("cloudinary.com")) {
        const cloudinaryInfo = getCloudinaryPublicIdAndType(url);
        if (cloudinaryInfo) {
          const { publicId, resourceType } = cloudinaryInfo;
          try {
            await cloudinary.uploader.destroy(publicId, {
              resource_type: resourceType,
            });
          } catch (cloudinaryError) {
            console.error("Failed to delete from Cloudinary:", cloudinaryError);
          }
        }
      }

      await db.collection("settings").deleteOne({ key: "resume_url" });

      return res.status(200).json({ success: true, message: "Resume deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("Error managing resume settings:", e);
    return res.status(500).json({ error: e?.message || "Internal server error" });
  }
}
