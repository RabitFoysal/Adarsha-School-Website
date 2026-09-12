import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // লগইন কুকিটি মুছে ফেলা হচ্ছে
  response.cookies.delete("isLoggedIn");
  return response;
}