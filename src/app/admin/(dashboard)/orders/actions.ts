'use server';

import { revalidatePath } from 'next/cache';
import type { Order } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders.json');

const readDataFromFile = <T>(filePath: string, defaultData: T[] = []): T[] => {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        }
        return defaultData;
    } catch (error) {
        console.error(`Could not read ${path.basename(filePath)}, starting with empty list`, error);
        return defaultData;
    }
}

const writeDataToFile = <T>(filePath: string, data: T[]) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) => {
        console.error(`Could not write to ${path.basename(filePath)}`, error);
    }
}


const updateExistingOrder = (id: string, orderStatus: Order['orderStatus'], paymentStatus: Order['paymentStatus']): Order | null => {
    const orders = readDataFromFile<Order>(ordersFilePath, []);
    const orderIndex = orders.findIndex(o => o.id === id);
    if(orderIndex !== -1) {
        orders[orderIndex].orderStatus = orderStatus;
        orders[orderIndex].paymentStatus = paymentStatus;
        writeDataToFile(ordersFilePath, orders);
        return orders[orderIndex];
    }
    return null;
}


export async function handleUpdateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], paymentStatus: Order['paymentStatus']) {
    try {
        const updatedOrder = updateExistingOrder(orderId, orderStatus, paymentStatus);
        if (updatedOrder) {
            revalidatePath('/admin/orders');
            return { success: true, updatedOrder, message: 'Order updated successfully' };
        }
        return { success: false, message: 'Order not found' };
    } catch(e) {
        return { success: false, message: 'Failed to update order' };
    }
}
