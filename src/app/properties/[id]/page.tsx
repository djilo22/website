import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { Navbar } from "@/components/layout/navbar";

import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize, BedDouble, Bath, Phone, Mail, Building, ArrowRight } from "lucide-react";

import Link from "next/link";
import { formatPrice, getPropertyTypeLabel, formatDate } from "@/lib/utils";
import type { Property, Agency } from "@/types";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!property) notFound();

  const p = property as Property;

  // Fetch agency contact info
  const { data: agency } = await supabase
    .from("agencies")
    .select("name, phone, email")
    .eq("id", p.agency_id)
    .single();

  const agencyPhone = agency?.phone || "";
  const agencyEmail = agency?.email || "";
  const agencyName = agency?.name || "الوكالة";

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/properties" className="inline-flex items-center gap-1 text-primary hover:underline mb-6">
            <ArrowRight className="w-4 h-4" />
            العودة إلى القائمة
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <div className="rounded-xl overflow-hidden bg-gray-200">
                {p.images && p.images.length > 0 ? (
                  <div>
                    <img src={p.images[0]} alt={p.title} className="w-full h-96 object-cover" />
                    {p.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-1 mt-1">
                        {p.images.slice(1, 5).map((img, i) => (
                          <img key={i} src={img} alt={`${p.title} ${i + 2}`} className="w-full h-24 object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center">
                    <Building className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <Card>
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-text mb-2">{p.title}</h1>
                      <div className="flex items-center gap-2 text-text-light">
                        <MapPin className="w-4 h-4" />
                        <span>{p.city}{p.address ? ` - ${p.address}` : ""}</span>
                      </div>
                    </div>
                    <Badge className="bg-primary text-white text-sm px-3 py-1">
                      {p.type === "sale" ? "للبيع" : "للكراء"}
                    </Badge>
                  </div>

                  <p className="text-primary font-bold text-3xl mb-6">{formatPrice(p.price)}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-background rounded-lg">
                    <div className="text-center">
                      <p className="text-text-light text-sm">النوع</p>
                      <p className="font-semibold text-text">{getPropertyTypeLabel(p.property_type)}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Maximize className="w-4 h-4 text-text-light" />
                      </div>
                      <p className="font-semibold text-text">{p.area} م²</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <BedDouble className="w-4 h-4 text-text-light" />
                      </div>
                      <p className="font-semibold text-text">{p.rooms} غرف</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Bath className="w-4 h-4 text-text-light" />
                      </div>
                      <p className="font-semibold text-text">{p.bathrooms} حمامات</p>
                    </div>
                  </div>

                  {p.description && (
                    <div>
                      <h2 className="text-lg font-semibold text-text mb-2">الوصف</h2>
                      <p className="text-text-light leading-relaxed whitespace-pre-wrap">{p.description}</p>
                    </div>
                  )}

                  <p className="text-sm text-text-light mt-6">تاريخ النشر: {formatDate(p.created_at)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Contact */}
            <div>
              <Card className="sticky top-24">
                <CardContent>
                  <h3 className="text-lg font-semibold text-text mb-4">تواصل مع {agencyName}</h3>
                  <div className="space-y-3">
                    {agencyPhone && (
                      <a href={`tel:${agencyPhone}`}>
                        <Button variant="primary" className="w-full">
                          <Phone className="w-4 h-4 ml-2" />
                          اتصل الآن
                        </Button>
                      </a>
                    )}
                    {agencyEmail && (
                      <a href={`mailto:${agencyEmail}`}>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 ml-2" />
                          أرسل بريد
                        </Button>
                      </a>
                    )}
                    {!agencyPhone && !agencyEmail && (
                      <p className="text-text-light text-sm text-center">لا توجد معلومات اتصال متاحة</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
