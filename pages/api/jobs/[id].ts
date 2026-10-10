import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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

  const { id } = req.query;
  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid or missing job ID" });
  }

  const { db } = await connectToDatabase();
  const jobsCollection = db.collection("job_applications");
  const objectId = new ObjectId(id);

  if (req.method === "PATCH") {
    try {
      const allowedUpdates = [
        "company",
        "role",
        "job_url",
        "location",
        "salary",
        "status",
        "source",
        "notes",
        "contact_person",
        "applied_date",
      ];

      const updates: Record<string, any> = {
        updated_at: new Date(),
      };

      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          if (field === "applied_date" && req.body[field]) {
            updates[field] = new Date(req.body[field]);
          } else {
            updates[field] = req.body[field];
          }
        }
      }

      const result = await jobsCollection.findOneAndUpdate(
        { _id: objectId },
        { $set: updates },
        { returnDocument: "after" }
      );

      if (!result) {
        return res.status(404).json({ message: "Job application not found" });
      }

      return res.status(200).json({
        id: result._id.toString(),
        company: result.company,
        role: result.role,
        job_url: result.job_url,
        location: result.location,
        salary: result.salary,
        status: result.status,
        source: result.source,
        applied_date: result.applied_date,
        notes: result.notes,
        contact_person: result.contact_person,
        created_at: result.created_at,
        updated_at: result.updated_at,
      });
    } catch (error) {
      console.error("Error updating job:", error);
      return res.status(500).json({ message: "Failed to update job application" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await jobsCollection.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Job application not found" });
      }
      return res.status(200).json({ message: "Job application deleted successfully" });
    } catch (error) {
      console.error("Error deleting job:", error);
      return res.status(500).json({ message: "Failed to delete job application" });
    }
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
