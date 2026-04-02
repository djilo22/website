import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-l from-primary-dark to-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          جاهز لبدء إدارة عقاراتك؟
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          انضم إلى مئات الوكالات العقارية التي تثق بمنصتنا لإدارة أعمالها
        </p>
        <Link href="/auth/signup">
          <Button size="lg" variant="secondary" className="text-lg px-8">
            أنشئ حسابك المجاني
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
