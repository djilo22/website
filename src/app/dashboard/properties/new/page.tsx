import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { PropertyForm } from "@/components/dashboard/property-form";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const agencyId = user.user_metadata?.agency_id || user.id;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">إضافة عقار جديد</h1>
        <p className="text-text-light mt-1">أضف تفاصيل العقار لنشره</p>
      </div>
      <PropertyForm agencyId={agencyId} />
    </div>
  );
}
