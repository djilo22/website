"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("بيانات الدخول غير صحيحة. تأكد من البريد وكلمة المرور.");
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Building2 className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold text-text">عقار SaaS</span>
          </Link>
          <h1 className="text-2xl font-bold text-text">تسجيل الدخول</h1>
          <p className="text-text-light mt-1">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="pr-10"
                required
                dir="ltr"
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-9 w-5 h-5 text-text-light" />
              <Input
                label="كلمة المرور"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
                dir="ltr"
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              تسجيل الدخول
            </Button>
          </form>
        </div>

        <p className="text-center text-text-light mt-4">
          ليس لديك حساب؟{" "}
          <Link href="/auth/signup" className="text-primary font-medium hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}
