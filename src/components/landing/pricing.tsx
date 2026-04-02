import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/types";

export function Pricing() {
  const planKeys = Object.keys(PLANS);

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            خطط بسيطة وشفافة
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            اختر الخطة المناسبة لحجم وكالتك — يمكنك الترقية في أي وقت
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planKeys.map((key) => {
            const plan = PLANS[key];
            const isPopular = key === "pro";
            return (
              <div
                key={key}
                className={`relative bg-white rounded-xl border-2 p-6 flex flex-col ${
                  isPopular ? "border-primary shadow-lg scale-105" : "border-border"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    الأكثر شيوعاً
                  </div>
                )}
                <h3 className="text-xl font-bold text-text mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-text">
                    {plan.price === 0 ? "مجاني" : plan.price.toLocaleString()}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-text-light text-sm mr-1">د.ج / شهر</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-light">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button
                    variant={isPopular ? "primary" : "outline"}
                    className="w-full"
                  >
                    ابدأ الآن
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
