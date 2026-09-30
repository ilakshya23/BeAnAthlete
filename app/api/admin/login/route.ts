import { NextResponse } from "next/server";
import {
  authenticate,
  clearLoginFailures,
  isLoginLocked,
  loginRateLimitKey,
  recordLoginFailure,
  setAdminSession,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim() || "";
    const password = body.password || "";
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const attemptKey = await loginRateLimitKey(username, ip);

    if (await isLoginLocked(attemptKey)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const user = await authenticate(username, password);
    if (!user) {
      await recordLoginFailure(attemptKey);
      return NextResponse.json({ error: "Incorrect user ID or password." }, { status: 401 });
    }

    await clearLoginFailures(attemptKey);
    await setAdminSession(user);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
