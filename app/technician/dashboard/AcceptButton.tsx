"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface AcceptButtonProps {
  orderId: string;
}

export default function AcceptButton({ orderId }: AcceptButtonProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    if (!confirm("Apakah Anda yakin ingin menerima pesanan ini?")) return;

    setIsAccepting(true);
    try {
      const res = await fetch("/api/orders/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menerima pesanan.");

      alert("Pesanan berhasil diterima!");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleAccept}
      variant="primary"
      size="sm"
      className="shadow-[0_0_10px_rgba(249,115,22,0.2)]"
      disabled={isAccepting}
    >
      {isAccepting ? "Memproses..." : "Terima Pesanan"}
    </Button>
  );
}
