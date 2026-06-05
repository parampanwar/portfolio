import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const setting = await db.collection("settings").findOne({ key: "resume_url" });
    
    if (setting && setting.value) {
      // Set headers to prevent caching of this redirect so updates are instant
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.redirect(307, setting.value);
    }
  } catch (e) {
    console.error("Failed to fetch dynamic resume URL from DB:", e);
  }

  // Fallback to static asset if not set in DB
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return res.redirect(307, "/resume/param_panwar.pdf");
}
