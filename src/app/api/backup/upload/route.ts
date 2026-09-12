import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation to ensure it's a valid JSON object
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid backup data" }, { status: 400 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    
    return NextResponse.json({ success: true, message: "Backup restored successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 });
  }
}
