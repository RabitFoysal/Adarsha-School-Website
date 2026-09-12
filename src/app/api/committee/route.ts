import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';
const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");
const readData = () => JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
const writeData = (data: any) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

export async function GET() {
  return NextResponse.json(readData().committee || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    if (!data.committee) data.committee = [];

    if (body.id) {
      data.committee = data.committee.map((c: any) => c.id === body.id ? { ...c, name: body.name, designation: body.designation, image: body.image } : c);
    } else {
      data.committee.push({ id: Date.now(), name: body.name, designation: body.designation, image: body.image });
    }
    writeData(data);
    return NextResponse.json({ success: true, message: "সংরক্ষিত!" });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const data = readData();
  data.committee = (data.committee || []).filter((c: any) => c.id !== id);
  writeData(data);
  return NextResponse.json({ success: true });
}