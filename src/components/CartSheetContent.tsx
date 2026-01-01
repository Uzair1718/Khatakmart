"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartSheetContent() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-headline text-2xl">Shopping Cart</SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />
      {cartItems.length > 0 ? (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-grow pr-4">
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <Image
                      src={item.image.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      data-ai-hint={item.image.imageHint}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">PKR {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="h-8 w-16"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="mt-auto">
            <div className="w-full space-y-4">
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Subtotal</span>
                <span>PKR {cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                No Delivery Charges!
              </p>
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </SheetFooter>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
          <h3 className="mt-6 text-xl font-semibold font-headline">Your cart is empty</h3>
          <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
          <SheetClose asChild>
            <Button asChild className="mt-6">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </>
  );
}
