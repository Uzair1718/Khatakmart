import { getCategories } from "@/lib/data";
import { ProductsClient } from "./ProductsClient";
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


export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Products</h1>
      <ProductsClient products={products} categories={categories} />
    </div>
  );
}
