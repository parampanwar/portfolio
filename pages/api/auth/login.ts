import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import crypto from "crypto";

type ApiResponse = {
  success: boolean;
  message?: string;
  mfaRequired?: boolean;
  access_token?: string;
  token_type?: string;
  user?: {
    email: string;
    is_admin: boolean;
  };
};

// Base32 decoding helper for TOTP
function decodeBase32(charString: string): Buffer {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanString = charString.replace(/=+$/, "").toUpperCase();
  const length = cleanString.length;
  const buffer = Buffer.alloc(Math.floor((length * 5) / 8));
  
  let bits = 0;
  let value = 0;
  let index = 0;
  
  for (let i = 0; i < length; i++) {
    const val = base32chars.indexOf(cleanString.charAt(i));
    if (val === -1) throw new Error("Invalid base32 character");
    
    value = (value << 5) | val;
    bits += 5;
    
    if (bits >= 8) {
      buffer[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }
  return buffer;
}

// Custom TOTP validator matching Google Authenticator standard
function verifyTOTP(token: string, secret: string, window = 1): boolean {
  try {
    const key = decodeBase32(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const currentCounter = Math.floor(epoch / timeStep);
    
    for (let i = -window; i <= window; i++) {
      const counter = currentCounter + i;
      const counterBuffer = Buffer.alloc(8);
      let temp = counter;
      for (let j = 7; j >= 0; j--) {
        counterBuffer[j] = temp & 0xff;
        temp = temp >> 8;
      }
      
      const hmac = crypto.createHmac("sha1", key);
      hmac.update(counterBuffer);
      const hmacResult = hmac.digest();
      
      const offset = hmacResult[hmacResult.length - 1] & 0xf;
      const code =
        ((hmacResult[offset] & 0x7f) << 24) |
        ((hmacResult[offset + 1] & 0xff) << 16) |
        ((hmacResult[offset + 2] & 0xff) << 8) |
        (hmacResult[offset + 3] & 0xff);
        
      const otp = (code % 1000000).toString().padStart(6, "0");
      if (otp === token) {
        return true;
      }
    }
  } catch (error) {
    console.error("TOTP validation failed:", error);
  }
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { username, password, otp } = req.body ?? {};

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";
  const mfaSecret = process.env.MFA_SECRET;

  if (!adminPassword) {
    return res.status(500).json({
      success: false,
      message: "Admin password is not configured in environment variables.",
    });
  }

  // Validate username and password
  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  // Validate MFA if enabled
  if (mfaSecret) {
    if (!otp) {
      return res.status(200).json({
        success: true,
        mfaRequired: true,
        message: "MFA code is required",
      });
    }

    const isValidOtp = verifyTOTP(otp, mfaSecret);
    if (!isValidOtp) {
      return res.status(401).json({ success: false, message: "Invalid MFA code" });
    }
  }

  // Generate JWT token
  const token = jwt.sign(
    { email: username, is_admin: true },
    jwtSecret,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    success: true,
    access_token: token,
    token_type: "Bearer",
    user: {
      email: username,
      is_admin: true,
    },
  });
}
