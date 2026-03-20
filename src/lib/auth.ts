import { cookies } from "next/headers";

const COOKIE_NAME = "visquanta-audit-auth";
const COOKIE_VALUE = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export function getAuthCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}
