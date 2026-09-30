import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const content = await saveSiteContent(await request.json());
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save changes." },
      { status: 400 }
    );
  }
}
