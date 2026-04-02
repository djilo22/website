"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building,
  Plus,
  CreditCard,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";

const navItems = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "العقارات", icon: Building },
  { href: "/dashboard/properties/new", label: "إضافة عقار", icon: Plus },
  { href: "/dashboard/subscription", label: "الاشتراك", icon: CreditCard },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white border-l border-border min-h-screen sticky top-0 hidden lg:block">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Building2 className="w-7 h-7 text-primary" />
          <span className="text-lg font-bold text-text">عقار SaaS</span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-light hover:bg-gray-50 hover:text-text"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-light hover:bg-gray-50 hover:text-text transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </aside>
  );
}
