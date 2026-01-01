import { getOrders } from "@/lib/data";
import { OrdersClient } from "./OrdersClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminOrdersPage() {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("khattak_mart_auth");

    if (authCookie?.value !== "true") {
      redirect("/admin/login");
    }
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Orders</h1>
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
