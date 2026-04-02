import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
