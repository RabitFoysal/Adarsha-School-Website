import { NextResponse } from "next/server";
import { isVercelPostgresConfigured } from "@/lib/dataProvider";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return new NextResponse("File ID missing", { status: 400 });
    }

    // Remove any extension like .png, .jpg from id
    const cleanId = id.replace(/\.[^/.]+$/, "");

    // 1. Check Vercel Postgres school_files table if configured
    if (isVercelPostgresConfigured()) {
      try {
        const { sql } = await import("@vercel/postgres");
        const result = await sql`SELECT filename, mime_type, data_base64 FROM school_files WHERE id = ${cleanId} LIMIT 1;`;
        if (result.rows.length > 0) {
          const { mime_type, data_base64 } = result.rows[0];
          const buffer = Buffer.from(data_base64, "base64");
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": mime_type || "image/jpeg",
              "Content-Length": buffer.length.toString(),
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch (err) {
        console.error("Postgres file fetch error:", err);
      }
    }

    // 2. Check local filesystem in public/uploads or /tmp/uploads
    const possibleDirs = [
      path.join(process.cwd(), "public", "uploads"),
      path.join("/tmp", "uploads"),
    ];

    for (const dir of possibleDirs) {
      try {
        if (fs.existsSync(dir)) {
          // Check exact match
          const exactPath = path.join(dir, id);
          if (fs.existsSync(exactPath)) {
            const fileBuffer = fs.readFileSync(exactPath);
            const ext = id.split(".").pop() || "jpg";
            const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : "image/jpeg";
            return new NextResponse(fileBuffer, {
              status: 200,
              headers: {
                "Content-Type": mime,
                "Content-Length": fileBuffer.length.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }

          // Check prefix match with cleanId
          const files = fs.readdirSync(dir);
          const match = files.find(f => f.startsWith(cleanId));
          if (match) {
            const filePath = path.join(dir, match);
            const fileBuffer = fs.readFileSync(filePath);
            const ext = match.split(".").pop() || "jpg";
            const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : "image/jpeg";
            return new NextResponse(fileBuffer, {
              status: 200,
              headers: {
                "Content-Type": mime,
                "Content-Length": fileBuffer.length.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }
        }
      } catch {}
    }

    return new NextResponse("File not found", { status: 404 });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
