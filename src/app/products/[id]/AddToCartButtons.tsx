"use client";

import { useState } from "react";
import { type Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartProvider";
import { PlusCircle, MinusCircle } from "lucide-react";

export function AddToCartButtons({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
            <MinusCircle className="h-5 w-5"/>
        </Button>
        <Input 
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 h-10 text-center text-lg font-bold"
          min="1"
        />
        <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
            <PlusCircle className="h-5 w-5"/>
        </Button>
      </div>
      <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart}>
        <PlusCircle className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
