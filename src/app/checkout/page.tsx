"use client";

import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import { StoreLayout } from "@/components/StoreLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckoutForm } from "./CheckoutForm";
import { Truck } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  return (
    <StoreLayout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center font-headline mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <CheckoutForm />
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4 mb-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
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
                </ScrollArea>
                <Separator />
                <div className="space-y-2 mt-4 text-lg">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>PKR {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-primary font-semibold">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>PKR {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-primary/10 border-primary/50">
              <Truck className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-semibold">Free Delivery!</AlertTitle>
              <AlertDescription>
                All orders within Islamabad enjoy free and fast delivery. No hidden charges.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
