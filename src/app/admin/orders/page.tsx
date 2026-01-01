import { getOrders } from "@/lib/data";
import { OrdersClient } from "./OrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Orders</h1>
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
