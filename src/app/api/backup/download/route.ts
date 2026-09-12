import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="school_cms_backup.json"'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to download backup" }, { status: 500 });
  }
}
