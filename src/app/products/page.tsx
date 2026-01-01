import { getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { StoreLayout } from "@/components/StoreLayout";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

const getProducts = async (): Promise<Product[]> => {
    try {
        await fs.access(productsFilePath);
        const fileContent = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

type ProductsPageProps = {
  searchParams: {
    category?: string;
  };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const allProducts = await getProducts();
  const allCategories = await getCategories();
  const selectedCategory = searchParams.category;

  const filteredProducts = selectedCategory
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;
  
  const currentCategoryName = allCategories.find(c => c.id === selectedCategory)?.name || 'All Products';

  return (
    <StoreLayout>
      <div className="container py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-headline text-center">{currentCategoryName}</h1>
          <nav className="mt-6">
            <ul className="flex justify-center gap-2 md:gap-4 flex-wrap">
              <li>
                <Link
                  href="/products"
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  )}
                >
                  All
                </Link>
              </li>
              {allCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
