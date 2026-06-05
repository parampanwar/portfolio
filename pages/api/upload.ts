import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type ApiResponse = {
  success: boolean;
  message?: string;
  url?: string;
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

// Next.js body size limit config (increase it to 10mb for image uploads)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Authorize admin
  if (!verifyAdmin(req)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { file } = req.body ?? {};

  if (!file) {
    return res.status(400).json({ success: false, message: "No file data provided" });
  }

  try {
    // Cloudinary supports direct base64 data URI upload
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "portfolio-blog",
      resource_type: "auto",
    });

    return res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to upload image to Cloudinary",
    });
  }
}
