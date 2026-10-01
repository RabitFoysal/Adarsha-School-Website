import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "লগআউট সফল!" });
  
  response.cookies.delete("admin_session");
  response.cookies.delete("isLoggedIn");
  
  // Also set expired cookies to force immediate browser clearance
  response.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
  response.cookies.set("isLoggedIn", "", { path: "/", maxAge: 0 });

  return response;
}
