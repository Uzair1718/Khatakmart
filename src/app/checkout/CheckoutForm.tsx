"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeOrder } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^03\d{9}$/, { message: "Please enter a valid Pakistani phone number (03xxxxxxxxx)." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  paymentMethod: z.enum(["COD", "Card"], { required_error: "Please select a payment method." }),
  paymentProof: z.any().optional(),
}).refine(data => {
    if (data.paymentMethod === 'Card') {
        return data.paymentProof && data.paymentProof.size > 0;
    }
    return true;
}, {
    message: 'Payment proof is required for card payments.',
    path: ['paymentProof'],
});


export function CheckoutForm() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      paymentMethod: "COD",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(cartItems.length === 0) {
      toast({ title: "Your cart is empty", description: "Please add items to your cart before checking out.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phone', values.phone);
    formData.append('address', values.address);
    formData.append('paymentMethod', values.paymentMethod);
    if (values.paymentMethod === 'Card' && values.paymentProof) {
        formData.append('paymentProof', values.paymentProof);
    }
    formData.append('cartItems', JSON.stringify(cartItems));
    formData.append('cartTotal', String(cartTotal));

    try {
        const result = await placeOrder(formData);
        
        if (result.success && result.orderId && result.whatsappUrl) {
            toast({
              title: "Order Placed!",
              description: "Redirecting you to WhatsApp to confirm your order.",
            });
            clearCart();
            window.open(result.whatsappUrl, '_blank');
            router.push(`/order-confirmation/${result.orderId}`);
        } else {
            throw new Error(result.message || "An unknown error occurred.");
        }
    } catch (error) {
        toast({
            title: "Order Failed",
            description: error instanceof Error ? error.message : "Could not place your order. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ahmed Khan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="03xxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your full delivery address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-headline text-lg">Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="COD" />
                        </FormControl>
                        <FormLabel className="font-normal w-full">
                          Cash on Delivery (COD)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="Card" />
                        </FormControl>
                        <FormLabel className="font-normal w-full">
                           Card / Bank Transfer (Pay Now)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "Card" && (
                <FormField
                    control={form.control}
                    name="paymentProof"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Payment Proof</FormLabel>
                        <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

            <Button type="submit" className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...
                </>
              ) : (
                `Place Order (PKR ${cartTotal.toFixed(2)})`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
