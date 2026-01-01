"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Settings
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleLogout } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: Home },
        { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold font-headline">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="">Khattak MART</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map(item => (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                    >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{item.badge}</Badge>}
                </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
             <form action={handleLogout}>
                <Button size="sm" variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}
