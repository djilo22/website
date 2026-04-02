"use client";

import React, { useState } from "react";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PLANS } from "@/types";
import { Modal } from "@/components/ui/modal";

export default function SubscriptionPage() {
  const [currentPlan] = useState("free");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleSelectPlan = (planKey: string) => {
    setSelectedPlan(planKey);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">الاشتراك</h1>
        <p className="text-text-light mt-1">أدِر خطة اشتراكك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const isCurrent = key === currentPlan;
          const isPopular = key === "pro";
          return (
            <Card key={key} className={`relative ${isPopular ? "border-2 border-primary" : ""} ${isCurrent ? "ring-2 ring-accent" : ""}`}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> الأكثر شيوعاً
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  خطتك الحالية
                </div>
              )}
              <CardHeader>
                <h3 className="text-xl font-bold text-text">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-text">
                    {plan.price === 0 ? "مجاني" : plan.price.toLocaleString()}
                  </span>
                  {plan.price > 0 && <span className="text-text-light text-sm mr-1">د.ج / شهر</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-light">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="ghost" className="w-full" disabled>الخطة الحالية</Button>
                ) : (
                  <Button variant={isPopular ? "primary" : "outline"} className="w-full" onClick={() => handleSelectPlan(key)}>
                    {key === "free" ? "تخفيض" : "ترقية"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="تأكيد تغيير الخطة">
        <div className="space-y-4">
          <p className="text-text-light">
            سيتم تفعيل خطة <strong>{PLANS[selectedPlan]?.name}</strong> على حسابك.
          </p>
          <p className="text-sm text-text-light">
            هذه نسخة تجريبية. في النسخة النهائية سيتم ربط نظام الدفع.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowModal(false)}>إلغاء</Button>
            <Button onClick={() => { setShowModal(false); alert("سيتم تفعيل نظام الدفع قريباً!"); }}>تأكيد</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
