"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { type Product } from "@/lib/types";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartProvider";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, PlusCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/lib/data";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null | undefined>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    // This is now a client-side only call, but getProductById needs to be adjusted
    const fetchProduct = async () => {
        const data = await getProductById(params.id);
        setProduct(data);
    }
    fetchProduct();
  }, [params.id]);

  if (product === undefined) {
    notFound();
  }

  if (product === null) {
    return (
      <StoreLayout>
        <div className="container py-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  return (
    <StoreLayout>
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="relative aspect-square w-full bg-muted rounded-lg overflow-hidden shadow-lg">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={product.image.imageHint}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl lg:text-5xl font-bold font-headline">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">PKR {product.price.toFixed(2)}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            
            {product.expiryDate && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Expiry Date:</span>
                <Badge variant="outline">{product.expiryDate}</Badge>
              </div>
            )}
            
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
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
