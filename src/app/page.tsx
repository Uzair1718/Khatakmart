import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StoreLayout } from "@/components/StoreLayout";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  return (
    <StoreLayout>
      <section className="relative w-full h-[50vh] md:h-[60vh] text-white">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight tracking-tight">
            Quality Groceries, Delivered Fast
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-primary-foreground/90">
            Freshness from our store to your door in Islamabad. No delivery charges, ever.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group block">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
                  <div className="relative h-48">
                    <Image
                      src={category.image.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-ai-hint={category.image.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <CardContent className="absolute inset-0 flex items-center justify-center p-0">
                    <h3 className="text-2xl font-bold text-white font-headline text-center p-4">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container text-center">
             <div className="max-w-3xl mx-auto">
                 <h2 className="text-3xl font-bold font-headline mb-4">Why Shop With Us?</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                     <div className="p-4">
                         <h3 className="text-xl font-headline font-semibold">Cash on Delivery</h3>
                         <p className="text-muted-foreground mt-2">Pay for your order when it arrives at your doorstep. Simple and secure.</p>
                     </div>
                     <div className="p-4">
                         <h3 className="text-xl font-headline font-semibold">No Delivery Charges</h3>
                         <p className="text-muted-foreground mt-2">Enjoy free delivery on all orders within Islamabad. No minimum purchase required.</p>
                     </div>
                     <div className="p-4">
                         <h3 className="text-xl font-headline font-semibold">WhatsApp Ordering</h3>
                         <p className="text-muted-foreground mt-2">Get instant order confirmation and support directly on your WhatsApp.</p>
                     </div>
                 </div>
             </div>
        </div>
      </section>

    </StoreLayout>
  );
}
