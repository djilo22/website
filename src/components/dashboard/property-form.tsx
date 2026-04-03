"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ALGERIAN_CITIES } from "@/lib/utils";
import type { Property } from "@/types";
import { Upload, X, ImageIcon } from "lucide-react";

interface PropertyFormProps {
  property?: Property;
  agencyId: string;
}

export function PropertyForm({ property, agencyId }: PropertyFormProps) {
  const isEditing = !!property;
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    type: property?.type || "sale",
    property_type: property?.property_type || "apartment",
    price: property?.price?.toString() || "",
    city: property?.city || "",
    address: property?.address || "",
    area: property?.area?.toString() || "",
    rooms: property?.rooms?.toString() || "",
    bathrooms: property?.bathrooms?.toString() || "",
    status: property?.status || "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const newUrls: string[] = [];
      const failedFiles: string[] = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${agencyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("property-images").upload(fileName, file);
        if (uploadError) {
          console.error("Upload error:", uploadError);
          failedFiles.push(file.name);
          continue;
        }
        const { data } = supabase.storage.from("property-images").getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }
      setImageUrls((prev) => [...prev, ...newUrls]);
      if (failedFiles.length > 0) {
        setError(`فشل رفع الصور التالية: ${failedFiles.join("، ")}. تأكد من إنشاء bucket باسم "property-images" في Supabase Storage.`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("فشل رفع الصور. تأكد من إعداد Supabase Storage بشكل صحيح.");
    } finally { setUploading(false); }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.title || !formData.price || !formData.city) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const propertyData = {
        agency_id: agencyId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        property_type: formData.property_type,
        price: parseFloat(formData.price),
        city: formData.city,
        address: formData.address,
        area: formData.area ? parseFloat(formData.area) : 0,
        rooms: formData.rooms ? parseInt(formData.rooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        images: imageUrls,
        features: [],
        status: formData.status,
      };
      if (isEditing) {
        const { error } = await supabase.from("properties").update(propertyData).eq("id", property.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("properties").insert(propertyData);
        if (error) throw error;
      }
      router.push("/dashboard/properties");
      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      setError("فشل حفظ العقار. حاول مرة أخرى.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="text-lg font-semibold text-text">معلومات العقار</h2></CardHeader>
            <CardContent className="space-y-4">
              <Input label="عنوان الإعلان *" name="title" value={formData.title} onChange={handleChange} placeholder="مثال: شقة فاخرة في وسط المدينة" required />
              <Textarea label="الوصف" name="description" value={formData.description} onChange={handleChange} placeholder="اكتب وصفاً تفصيلياً للعقار..." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="نوع العرض *" name="type" value={formData.type} onChange={handleChange} options={[{ value: "sale", label: "للبيع" }, { value: "rent", label: "للكراء" }]} />
                <Select label="نوع العقار *" name="property_type" value={formData.property_type} onChange={handleChange} options={[{ value: "apartment", label: "شقة" }, { value: "house", label: "منزل" }, { value: "villa", label: "فيلا" }, { value: "land", label: "أرض" }, { value: "commercial", label: "تجاري" }, { value: "other", label: "أخرى" }]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="السعر (د.ج) *" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" required dir="ltr" />
                <Input label="المساحة (م²)" name="area" type="number" value={formData.area} onChange={handleChange} placeholder="0" dir="ltr" />
                <Select label="الحالة" name="status" value={formData.status} onChange={handleChange} options={[{ value: "active", label: "نشط" }, { value: "sold", label: "مباع" }, { value: "rented", label: "مؤجر" }, { value: "draft", label: "مسودة" }]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="عدد الغرف" name="rooms" type="number" value={formData.rooms} onChange={handleChange} placeholder="0" dir="ltr" />
                <Input label="عدد الحمامات" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} placeholder="0" dir="ltr" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><h2 className="text-lg font-semibold text-text">صور العقار</h2></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                    <img src={url} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
                  {uploading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <><Upload className="w-6 h-6 text-text-light mb-1" /><span className="text-xs text-text-light">رفع صور</span></>
                  )}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              {imageUrls.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                  <ImageIcon className="w-10 h-10 text-text-light/40 mx-auto mb-2" />
                  <p className="text-sm text-text-light">لم يتم رفع أي صور بعد</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-lg font-semibold text-text">الموقع</h2></CardHeader>
            <CardContent className="space-y-4">
              <Select label="المدينة *" name="city" value={formData.city} onChange={handleChange} options={ALGERIAN_CITIES.map((city) => ({ value: city, label: city }))} />
              <Input label="العنوان التفصيلي" name="address" value={formData.address} onChange={handleChange} placeholder="حي، شارع..." />
            </CardContent>
          </Card>
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {isEditing ? "حفظ التعديلات" : "نشر العقار"}
          </Button>
        </div>
      </div>
    </form>
  );
}
