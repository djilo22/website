import { createServerSupabase } from "@/lib/supabase-server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Maximize, BedDouble, Bath } from "lucide-react";
import Link from "next/link";
import { formatPrice, getPropertyTypeLabel } from "@/lib/utils";

import type { Property } from "@/types";

export const dynamic = "force-dynamic";

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; type?: string; property_type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (params.city) query = query.eq("city", params.city);
  if (params.type) query = query.eq("type", params.type);
  if (params.property_type) query = query.eq("property_type", params.property_type);

  const { data: properties } = await query;

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text">تصفح العقارات</h1>
            <p className="text-text-light mt-1">اكتشف أفضل العروض العقارية في الجزائر</p>
          </div>

          {!properties || properties.length === 0 ? (
            <div className="text-center py-20">
              <Building className="w-16 h-16 text-text-light/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">لا توجد عقارات حالياً</h3>
              <p className="text-text-light">سيتم إضافة عقارات جديدة قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(properties as Property[]).map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="h-52 bg-gray-200 relative">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-primary text-white">
                        {property.type === "sale" ? "للبيع" : "للكراء"}
                      </Badge>
                    </div>
                    <CardContent>
                      <h3 className="font-semibold text-text text-lg mb-1 truncate">{property.title}</h3>
                      <p className="text-primary font-bold text-xl mb-2">{formatPrice(property.price)}</p>
                      <div className="flex items-center gap-1 text-text-light text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{property.city}</span>
                        <span className="mx-1">•</span>
                        <span>{getPropertyTypeLabel(property.property_type)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-text-light text-sm border-t border-border pt-3">
                        {property.area > 0 && (
                          <div className="flex items-center gap-1"><Maximize className="w-4 h-4" /><span>{property.area} م²</span></div>
                        )}
                        {property.rooms > 0 && (
                          <div className="flex items-center gap-1"><BedDouble className="w-4 h-4" /><span>{property.rooms} غرف</span></div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center gap-1"><Bath className="w-4 h-4" /><span>{property.bathrooms}</span></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
