import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    const host = (await headers()).get("host") || "";
    redirect(host.startsWith("admin.") ? "/" : "/admin");
  }
  return <AdminLogin />;
}
