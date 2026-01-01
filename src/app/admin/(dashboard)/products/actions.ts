'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdir(uploadsDir, { recursive: true });


const readDataFromFile = async <T,>(filePath: string, defaultData: T[] = []): Promise<T[]> => {
    try {
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Could not read ${path.basename(filePath)}, starting with empty list`, error);
        return defaultData;
    }
}

const writeDataToFile = async <T,>(filePath: string, data: T[]) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Could not write to ${path.basename(filePath)}`, error);
    }
}

const uploadImage = async (image: File): Promise<string> => {
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
    const imagePath = path.join(uploadsDir, filename);
    await fs.writeFile(imagePath, buffer);
    return `/uploads/${filename}`;
}


export const addNewProduct = async (productData: Omit<Product, 'id' | 'image'> & { imageUrl: string; imageHint: string }) => {
    const products = await readDataFromFile<Product>(productsFilePath, []);
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        isFeatured: productData.isFeatured,
        image: {
            id: `img-${Date.now()}`,
            description: productData.name,
            imageUrl: productData.imageUrl,
            imageHint: productData.imageHint,
        }
    };
    const updatedProducts = [newProduct, ...products];
    await writeDataToFile(productsFilePath, updatedProducts);
    return newProduct;
}

const addFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }),
  category: z.string().min(1, { message: "Please select a category" }),
  isFeatured: z.coerce.boolean(),
  image: z.instanceof(File).refine(file => file.size > 0, { message: 'Image is required.' })
});

export async function handleAddProduct(prevState: any, formData: FormData) {
  const validatedFields = addFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    isFeatured: formData.get('isFeatured') === 'on',
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
      success: false,
    };
  }

  try {
    const { image, name, ...rest } = validatedFields.data;
    const imageUrl = await uploadImage(image);

    const newProduct = await addNewProduct({
      ...rest,
      name,
      imageUrl,
      imageHint: "product package", // a default hint
    });
    revalidatePath('/admin/products');
    return { message: `${newProduct.name} has been added.`, success: true };
  } catch (error) {
    return { message: 'Failed to add product.', success: false };
  }
}

const updateFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }),
  category: z.string().min(1, { message: "Please select a category" }),
  isFeatured: z.coerce.boolean(),
  image: z.instanceof(File).optional(),
});

export async function handleUpdateProduct(prevState: any, formData: FormData) {
    const validatedFields = updateFormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        isFeatured: formData.get('isFeatured') === 'on',
        image: formData.get('image') && (formData.get('image') as File).size > 0 ? formData.get('image') : undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid form data.',
            success: false,
        };
    }

    try {
        const products = await readDataFromFile<Product>(productsFilePath, []);
        const productIndex = products.findIndex(p => p.id === validatedFields.data.id);

        if (productIndex === -1) {
            return { message: 'Product not found.', success: false };
        }

        const productToUpdate = products[productIndex];
        const { image, ...updateData } = validatedFields.data;

        // Handle image upload if a new one is provided
        if (image) {
            const newImageUrl = await uploadImage(image);
            // Optional: delete old image from filesystem
            if (productToUpdate.image.imageUrl.startsWith('/uploads/')) {
                try {
                    await fs.unlink(path.join(process.cwd(), 'public', productToUpdate.image.imageUrl));
                } catch(e) {
                    console.error("Failed to delete old image:", e);
                }
            }
            productToUpdate.image.imageUrl = newImageUrl;
        }

        // Update product details
        products[productIndex] = {
            ...productToUpdate,
            ...updateData,
            isFeatured: updateData.isFeatured,
        };

        await writeDataToFile(productsFilePath, products);
        revalidatePath('/admin/products');
        revalidatePath(`/products/${validatedFields.data.id}`);

        return { message: `${validatedFields.data.name} has been updated.`, success: true };
    } catch (error) {
        return { message: 'Failed to update product.', success: false };
    }
}


export async function handleDeleteProduct(productId: string) {
    try {
        let products = await readDataFromFile<Product>(productsFilePath, []);
        const productToDelete = products.find(p => p.id === productId);

        if (!productToDelete) {
             return { success: false, message: "Product not found" };
        }
        
        products = products.filter(p => p.id !== productId);
        
        // Delete image file if it exists
        if (productToDelete.image.imageUrl.startsWith('/uploads/')) {
            try {
                await fs.unlink(path.join(process.cwd(), 'public', productToDelete.image.imageUrl));
            } catch(e) {
                console.error("Failed to delete product image:", e);
            }
        }

        await writeDataToFile(productsFilePath, products);
        revalidatePath('/admin/products');
        return { success: true, message: 'Product deleted successfully' };

    } catch (error) {
        return { success: false, message: 'Failed to delete product' };
    }
}
