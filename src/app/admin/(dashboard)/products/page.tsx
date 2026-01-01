import { getProducts } from "@/lib/data";
import { ProductsClient } from "./ProductsClient";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Products</h1>
      <ProductsClient products={products} />
    </div>
  );
}
