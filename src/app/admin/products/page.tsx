import { getProducts } from "@/lib/data";
import { ProductsClient } from "./ProductsClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminProductsPage() {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("khattak_mart_auth");

    if (authCookie?.value !== "true") {
      redirect("/admin/login");
    }
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Products</h1>
      <ProductsClient products={products} />
    </div>
  );
}
