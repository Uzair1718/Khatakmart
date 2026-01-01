"use client";

import { CartProvider } from "@/context/CartProvider";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}
