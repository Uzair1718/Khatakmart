'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addNewProduct } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }),
  category: z.string().min(1, { message: "Please select a category" }),
});

export async function handleAddProduct(prevState: any, formData: FormData) {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
      success: false,
    };
  }

  try {
    const newProduct = addNewProduct({
      ...validatedFields.data,
      image: { id: 'new-product-placeholder' }, // Placeholder
      isFeatured: false,
    });
    revalidatePath('/admin/products');
    return { message: `${newProduct.name} has been added.`, success: true };
  } catch (error) {
    return { message: 'Failed to add product.', success: false };
  }
}
