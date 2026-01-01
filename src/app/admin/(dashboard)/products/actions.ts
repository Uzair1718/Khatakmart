'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

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

const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    const defaultPlaceholder = PlaceHolderImages.find(img => img.id === 'new-product-placeholder');
    if(defaultPlaceholder) return defaultPlaceholder;
    throw new Error(`Image with id "${id}" not found and no default placeholder is available.`);
  }
  return image;
};

export const addNewProduct = (productData: Omit<Product, 'id' | 'image'> & { image: { id: string } }) => {
    const products = readDataFromFile<Product>(productsFilePath, []);
    const newProduct: Product = {
        ...productData,
        id: `prod-${String(products.length + 1 + Math.random()).padStart(3, '0')}`,
        image: findImage(productData.image.id),
    };
    const updatedProducts = [newProduct, ...products];
    writeDataToFile(productsFilePath, updatedProducts);
    return newProduct;
}


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
