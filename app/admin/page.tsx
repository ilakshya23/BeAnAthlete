import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminSession } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    const host = (await headers()).get("host") || "";
    redirect(host.startsWith("admin.") ? "/login" : "/admin/login");
  }
  const content = await getSiteContent();
  return <AdminDashboard initialContent={content} username={session.username} />;
}
