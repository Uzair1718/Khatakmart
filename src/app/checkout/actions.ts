
"use server";

import { addNewOrder } from "@/lib/data";
import { CartItem } from "@/lib/types";

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

        const newOrder = addNewOrder({
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
        const whatsappNumber = "+923155770026";
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
