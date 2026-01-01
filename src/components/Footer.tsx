import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl text-foreground">
                Khattak MART
              </span>
            </Link>
            <p className="text-sm">
              Your trusted online grocery store in Islamabad, Pakistan.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/checkout" className="hover:text-primary transition-colors">Checkout</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>DHA Phase 2, Islamabad, Pakistan</li>
              <li>WhatsApp: +92 330 5913399</li>
              <li>Email: orders@khattakmart.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground mb-4">Information</h3>
            <ul className="space-y-2">
              <li><p>No Delivery Charges</p></li>
              <li><p>Cash on Delivery Available</p></li>
               <li className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin Login</Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} KhattakMart Online. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
