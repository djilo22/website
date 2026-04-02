"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { ALGERIAN_CITIES } from "@/lib/utils";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    agency_name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData({
          full_name: user.user_metadata?.full_name || "",
          agency_name: user.user_metadata?.agency_name || "",
          phone: user.user_metadata?.phone || "",
          email: user.email || "",
          city: user.user_metadata?.city || "",
          address: user.user_metadata?.address || "",
        });
      }
    };
    loadUser();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          agency_name: formData.agency_name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
        },
      });
      setSuccess(true);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">الإعدادات</h1>
        <p className="text-text-light mt-1">إدارة معلومات حسابك ووكالتك</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><h2 className="text-lg font-semibold text-text">معلومات الحساب</h2></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  تم حفظ التعديلات بنجاح
                </div>
              )}
              <Input label="الاسم الكامل" name="full_name" value={formData.full_name} onChange={handleChange} />
              <Input label="البريد الإلكتروني" name="email" value={formData.email} disabled dir="ltr" />
              <Input label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleChange} dir="ltr" />
              <Input label="اسم الوكالة" name="agency_name" value={formData.agency_name} onChange={handleChange} />
              <Select label="المدينة" name="city" value={formData.city} onChange={handleChange} options={ALGERIAN_CITIES.map((c) => ({ value: c, label: c }))} />
              <Input label="العنوان" name="address" value={formData.address} onChange={handleChange} />
              <Button type="submit" loading={loading}>حفظ التعديلات</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
