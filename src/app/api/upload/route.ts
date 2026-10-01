import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isVercelPostgresConfigured } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "ফাইল পাওয়া যায়নি" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const extension = file.name.split(".").pop() || "jpg";
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const base64Data = buffer.toString("base64");

    // 1. If Vercel Blob is configured (highest priority for CDN delivery)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(file.name, file, { access: "public" });
        return NextResponse.json({ success: true, url: blob.url });
      } catch (blobErr) {
        console.error("Vercel blob upload error:", blobErr);
      }
    }

    // 2. If Vercel Postgres is configured, store in `school_files` table
    if (isVercelPostgresConfigured()) {
      try {
        const { sql } = await import("@vercel/postgres");
        await sql`CREATE TABLE IF NOT EXISTS school_files (
          id VARCHAR(100) PRIMARY KEY,
          filename VARCHAR(255),
          mime_type VARCHAR(100),
          data_base64 TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        await sql`INSERT INTO school_files (id, filename, mime_type, data_base64)
          VALUES (${fileId}, ${file.name}, ${mimeType}, ${base64Data})
          ON CONFLICT (id) DO UPDATE SET data_base64 = ${base64Data};`;

        return NextResponse.json({ 
          success: true, 
          url: `/api/files/${fileId}.${extension}` 
        });
      } catch (pgErr) {
        console.error("Postgres file storage error:", pgErr);
      }
    }

    // 3. Fallback: Save to public/uploads or /tmp
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    let savedLocal = false;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeFileName);
      fs.writeFileSync(filePath, buffer);
      savedLocal = true;
    } catch {}

    // Also write to /tmp for serverless persistence
    try {
      const tmpDir = path.join("/tmp", "uploads");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(path.join(tmpDir, safeFileName), buffer);
    } catch {}

    if (savedLocal) {
      return NextResponse.json({ success: true, url: `/uploads/${safeFileName}` });
    }

    // 4. Ultimate fallback: Return direct Base64 Data URL so the image displays 100% reliably in any environment
    return NextResponse.json({ 
      success: true, 
      url: `data:${mimeType};base64,${base64Data}` 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "আপলোড ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
