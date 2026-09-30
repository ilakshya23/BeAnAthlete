import { NextResponse } from "next/server";
import { changeAdminPassword, getAdminSession, setAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    const user = await changeAdminPassword(
      session.username,
      body.currentPassword || "",
      body.newPassword || ""
    );
    await setAdminSession(user);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to change password." },
      { status: 400 }
    );
  }
}
