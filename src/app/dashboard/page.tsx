import { createServerSupabase } from "@/lib/supabase-server";
import { Building, Eye, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("agency_id", user?.user_metadata?.agency_id || "");

  const { count: activeCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("agency_id", user?.user_metadata?.agency_id || "")
    .eq("status", "active");

  const stats = [
    {
      label: "إجمالي العقارات",
      value: propertiesCount || 0,
      icon: Building,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "إعلانات نشطة",
      value: activeCount || 0,
      icon: Eye,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "المشاهدات",
      value: 0,
      icon: TrendingUp,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">
            مرحباً، {user?.user_metadata?.full_name || "مستخدم"} 👋
          </h1>
          <p className="text-text-light mt-1">إليك نظرة عامة على وكالتك</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            إضافة عقار
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-text-light">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-text-light/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">ابدأ بإضافة أول عقار</h3>
            <p className="text-text-light mb-4">أضف عقاراتك لتبدأ في إدارتها ونشرها لعملائك</p>
            <Link href="/dashboard/properties/new">
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
