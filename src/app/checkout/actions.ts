
"use server";

import type { CartItem, Order } from "@/lib/types";
import fs from 'fs';
import path from 'path';


const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders.json');

const readDataFromFile = <T,>(filePath: string, defaultData: T[] = []): T[] => {
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

const writeDataToFile = <T,>(filePath: string, data: T[]) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Could not write to ${path.basename(filePath)}`, error);
    }
}

export const addNewOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const orders = readDataFromFile<Order>(ordersFilePath, []);
    const newOrder: Order = {
        ...order,
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
    };
    const updatedOrders = [...orders, newOrder];
    writeDataToFile(ordersFilePath, updatedOrders);
    return newOrder;
}


// In a real app, you would upload to a blob store like Cloud Storage
async function uploadPaymentProof(file: File): Promise<string> {
    // This is a mock upload. We'll just return a placeholder URL.
    console.log(`Uploading file: ${file.name}, size: ${file.size}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
    return "https://picsum.photos/seed/proof/200/300";
}

export async function placeOrder(formData: FormData) {
    try {
        const cartItems: CartItem[] = JSON.parse(formData.get("cartItems") as string);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const paymentMethod = formData.get("paymentMethod") as "COD" | "Card";
        const total = parseFloat(formData.get("cartTotal") as string);
        const paymentProofFile = formData.get('paymentProof') as File | null;

        let paymentProofUrl: string | undefined;
        if (paymentMethod === 'Card' && paymentProofFile) {
            paymentProofUrl = await uploadPaymentProof(paymentProofFile);
        }

        const newOrder = await addNewOrder({
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            items: cartItems,
            total,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'Pending Payment - COD' : 'Pending Verification',
            orderStatus: 'Pending',
            paymentProofUrl,
        });

        // WhatsApp Integration
        const whatsappNumber = "923155770026";
        let message = `*New Order from Khattak MART Website*\n\n`;
        message += `*Order ID:* ${newOrder.id}\n`;
        message += `*Customer:* ${name}\n`;
        message += `*Phone:* ${phone}\n`;
        message += `*Address:* ${address}\n\n`;
        message += `*Items:*\n`;
        cartItems.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - PKR ${item.price * item.quantity}\n`;
        });
        message += `\n*Total Amount:* PKR ${total.toFixed(2)}\n`;
        message += `*Payment:* ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}\n`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

        return { success: true, orderId: newOrder.id, whatsappUrl };

    } catch (error) {
        console.error("Failed to place order:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred." };
    }
}
