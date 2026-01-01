'use server';

import { revalidatePath } from 'next/cache';
import { updateExistingOrder } from '@/lib/data';
import type { Order } from '@/lib/types';

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
