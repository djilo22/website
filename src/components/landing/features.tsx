import React from "react";
import { Building, BarChart3, Shield, Globe, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Building,
    title: "إدارة العقارات",
    description: "أضف وعدّل وأدِر جميع عقاراتك من لوحة تحكم واحدة سهلة",
  },
  {
    icon: Globe,
    title: "صفحة عامة",
    description: "صفحة خاصة بوكالتك يمكن مشاركتها مع العملاء",
  },
  {
    icon: BarChart3,
    title: "إحصائيات",
    description: "تابع أداء إعلاناتك وعدد المشاهدات والتفاعلات",
  },
  {
    icon: Shield,
    title: "أمان تام",
    description: "بياناتك محمية ومعزولة تماماً عن بقية المستخدمين",
  },
  {
    icon: Smartphone,
    title: "متجاوب",
    description: "يعمل بكفاءة على جميع الأجهزة: حاسوب، هاتف، لوحة",
  },
  {
    icon: Zap,
    title: "سريع وبسيط",
    description: "واجهة بسيطة ومباشرة لا تحتاج أي خبرة تقنية",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            كل ما تحتاجه لإدارة وكالتك
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            أدوات قوية وبسيطة مصممة خصيصاً لسوق العقارات الجزائري
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
              <p className="text-text-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
