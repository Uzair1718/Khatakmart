import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, CreditCard, Package } from "lucide-react"
import type { Order } from '@/lib/types';
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

const getDashboardStats = async () => {
    const orders = await getOrders();
    const totalOrders = orders.length;
    const pendingCOD = orders.filter(o => o.paymentMethod === 'COD' && o.paymentStatus.startsWith('Pending')).length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid').length;
    return Promise.resolve({ totalOrders, pendingCOD, paidOrders });
}

export default async function DashboardPage() {
    const stats = await getDashboardStats();
  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Orders
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Pending COD
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.pendingCOD}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.paidOrders}</div>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Recent activity feed will be shown here in a future update.</p>
            </CardContent>
        </Card>
    </div>
  )
}
