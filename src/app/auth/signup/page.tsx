"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, User, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    agencyName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            agency_name: formData.agencyName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Building2 className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold text-text">عقار SaaS</span>
          </Link>
          <h1 className="text-2xl font-bold text-text">إنشاء حساب جديد</h1>
          <p className="text-text-light mt-1">ابدأ بإدارة عقاراتك مجاناً</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <User className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="الاسم الكامل"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="محمد أمين"
                className="pr-10"
                required
              />
            </div>

            <div className="relative">
              <Building2 className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="اسم الوكالة"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                placeholder="وكالة النجاح العقارية"
                className="pr-10"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="البريد الإلكتروني"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="pr-10"
                required
                dir="ltr"
              />
            </div>

            <div className="relative">
              <Phone className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="رقم الهاتف"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0555 123 456"
                className="pr-10"
                dir="ltr"
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="كلمة المرور"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pr-10"
                required
                dir="ltr"
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="تأكيد كلمة المرور"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="pr-10"
                required
                dir="ltr"
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              إنشاء الحساب
            </Button>
          </form>
        </div>

        <p className="text-center text-text-light mt-4">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
