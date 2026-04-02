"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await supabase.from("properties").delete().eq("id", propertyId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)}>
        <Trash2 className="w-3 h-3" />
      </Button>
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="تأكيد الحذف">
        <p className="text-text-light mb-4">هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>إلغاء</Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>حذف</Button>
        </div>
      </Modal>
    </>
  );
}
