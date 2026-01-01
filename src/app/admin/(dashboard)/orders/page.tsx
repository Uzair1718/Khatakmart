import { OrdersClient } from "./OrdersClient";
import type { Order } from "@/lib/types";
import fs from 'fs/promises';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders.json');

const getOrders = async (): Promise<Order[]> => {
    try {
        await fs.access(ordersFilePath);
        const fileContent = await fs.readFile(ordersFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}


export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Orders</h1>
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
