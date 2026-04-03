import { redirect, notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { PropertyForm } from "@/components/dashboard/property-form";
import type { Property } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const agencyId = user.user_metadata?.agency_id || user.id;

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("agency_id", agencyId)
    .single();

  if (!property) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">تعديل العقار</h1>
        <p className="text-text-light mt-1">عدّل تفاصيل العقار</p>
      </div>
      <PropertyForm property={property as Property} agencyId={agencyId} />
    </div>
  );
}
