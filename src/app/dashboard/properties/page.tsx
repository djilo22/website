import { createServerSupabase } from "@/lib/supabase-server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { formatPrice, getPropertyTypeLabel, getStatusLabel, getStatusColor } from "@/lib/utils";
import type { Property } from "@/types";
import { DeletePropertyButton } from "@/components/dashboard/delete-property-button";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("agency_id", user?.user_metadata?.agency_id || "")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">العقارات</h1>
          <p className="text-text-light mt-1">إدارة جميع عقاراتك</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            إضافة عقار
          </Button>
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-text-light/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">لا توجد عقارات بعد</h3>
              <p className="text-text-light mb-4">أضف أول عقار لتبدأ</p>
              <Link href="/dashboard/properties/new">
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة عقار جديد
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(properties as Property[]).map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <Badge className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}>
                  {getStatusLabel(property.status)}
                </Badge>
              </div>
              <CardContent>
                <h3 className="font-semibold text-text text-lg mb-1 truncate">{property.title}</h3>
                <p className="text-primary font-bold text-lg mb-1">{formatPrice(property.price)}</p>
                <p className="text-text-light text-sm mb-3">
                  {getPropertyTypeLabel(property.property_type)} • {property.city}
                </p>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/properties/${property.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="w-3 h-3 ml-1" />
                      تعديل
                    </Button>
                  </Link>
                  <DeletePropertyButton propertyId={property.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
