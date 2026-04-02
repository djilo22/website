import React from "react";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-primary-light" />
              <span className="text-lg font-bold text-white">عقار SaaS</span>
            </div>
            <p className="text-sm text-gray-400">
              منصة متكاملة لإدارة الوكالات العقارية في الجزائر
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">المميزات</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">الأسعار</a></li>
              <li><a href="/auth/signup" className="hover:text-white transition-colors">إنشاء حساب</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li>contact@aqar-saas.dz</li>
              <li>+213 555 123 456</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} عقار SaaS. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
