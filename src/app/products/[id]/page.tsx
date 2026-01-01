import Image from "next/image";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { CalendarDays, PlusCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButtons } from "./AddToCartButtons";
import type { Product } from "@/lib/types";
import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

const getProductById = async (id: string): Promise<Product | undefined> => {
    try {
        await fs.access(productsFilePath);
        const fileContent = await fs.readFile(productsFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContent);
        return products.find(p => p.id === id);
    } catch (error) {
        return undefined;
    }
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

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
            
            <AddToCartButtons product={product} />

          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
