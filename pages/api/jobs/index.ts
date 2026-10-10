import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

function verifyAdmin(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  try {
    const decoded = jwt.verify(token, secret) as { is_admin?: boolean };
    return Boolean(decoded?.is_admin);
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ message: "Unauthorized. Admin privileges required." });
  }

  const { db } = await connectToDatabase();
  const jobsCollection = db.collection("job_applications");

  if (req.method === "GET") {
    try {
      const { status, search, source } = req.query;
      const query: Record<string, any> = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (source && source !== "all") {
        query.source = source;
      }

      if (search && typeof search === "string" && search.trim() !== "") {
        query.$or = [
          { company: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } },
        ];
      }

      const docs = await jobsCollection
        .find(query)
        .sort({ applied_date: -1 })
        .toArray();

      const jobs = docs.map((doc) => ({
        id: doc._id.toString(),
        company: doc.company,
        role: doc.role,
        job_url: doc.job_url || null,
        location: doc.location || "Remote",
        salary: doc.salary || null,
        status: doc.status || "applied",
        source: doc.source || "company_website",
        applied_date: doc.applied_date || doc.created_at || new Date().toISOString(),
        notes: doc.notes || null,
        contact_person: doc.contact_person || null,
        created_at: doc.created_at || new Date().toISOString(),
        updated_at: doc.updated_at || new Date().toISOString(),
      }));

      return res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        company,
        role,
        job_url,
        location,
        salary,
        status = "applied",
        source = "company_website",
        applied_date,
        notes,
        contact_person,
      } = req.body;

      if (!company || !role) {
        return res.status(400).json({ message: "Company and role are required." });
      }

      const now = new Date();
      const newJob = {
        company: company.trim(),
        role: role.trim(),
        job_url: job_url ? job_url.trim() : null,
        location: location ? location.trim() : "Remote",
        salary: salary ? salary.trim() : null,
        status,
        source,
        applied_date: applied_date ? new Date(applied_date) : now,
        notes: notes ? notes.trim() : null,
        contact_person: contact_person ? contact_person.trim() : null,
        created_at: now,
        updated_at: now,
      };

      const result = await jobsCollection.insertOne(newJob);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newJob,
      });
    } catch (error) {
      console.error("Error creating job:", error);
      return res.status(500).json({ message: "Failed to create job application" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
