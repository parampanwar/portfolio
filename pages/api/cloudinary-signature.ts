import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

type ApiResponse = {
  success: boolean;
  message?: string;
  signature?: string;
  timestamp?: number;
  folder?: string;
  apiKey?: string;
  cloudName?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Authorize admin
  if (!verifyAdmin(req)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "portfolio-blog";

    // Generate signature using Cloudinary SDK utility
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET as string
    );

    return res.status(200).json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error: any) {
    console.error("Cloudinary signature generation error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate Cloudinary signature",
    });
  }
}
