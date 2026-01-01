import { StoreLayout } from "@/components/StoreLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@/lib/types";
import fs from 'fs/promises';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders.json');

const getOrderById = async (id: string) => {
    try {
        await fs.access(ordersFilePath);
        const fileContent = await fs.readFile(ordersFilePath, 'utf-8');
        const orders: Order[] = JSON.parse(fileContent);
        return orders.find(o => o.id === id);
    } catch (error) {
        return undefined;
    }
};

export default async function OrderConfirmationPage({ params }: { params: { id: string }}) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <StoreLayout>
      <div className="container py-12 md:py-20">
        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/50 p-6 text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-headline">Thank You For Your Order!</CardTitle>
            <p className="text-muted-foreground">Your order has been placed successfully. A confirmation has been sent via WhatsApp.</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <h3 className="font-headline text-xl mb-4">Order Summary (ID: {order.id})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image src={item.image.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.image.imageHint} />
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">PKR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h4 className="font-semibold font-headline">Shipping Address</h4>
                    <p className="text-muted-foreground">{order.customerName}</p>
                    <p className="text-muted-foreground">{order.customerAddress}</p>
                    <p className="text-muted-foreground">{order.customerPhone}</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold font-headline">Payment Details</h4>
                    <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Payment Status:</span>
                        <span>{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Paid:</span>
                        <span>PKR {order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
}
