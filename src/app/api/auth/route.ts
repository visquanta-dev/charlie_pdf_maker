import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieConfig } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === process.env.AUDIT_PASSWORD) {
    const response = NextResponse.json({ success: true });
    const cookie = getAuthCookieConfig();
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
