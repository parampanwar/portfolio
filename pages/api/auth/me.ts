import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type ApiResponse = {
  email?: string;
  is_admin?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      email: string;
      is_admin: boolean;
    };

    return res.status(200).json({
      email: decoded.email,
      is_admin: decoded.is_admin,
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
