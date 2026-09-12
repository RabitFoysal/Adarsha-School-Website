import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileData);
    
    return NextResponse.json({
      schoolInfo: data.schoolInfo,
      heroBanner: data.heroBanner,
      stats: data.stats,
      admission: data.admission,
      uiLabels: data.uiLabels,
      themeColor: data.themeColor || "emerald"
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to read school info" }, { status: 500 });
  }
}