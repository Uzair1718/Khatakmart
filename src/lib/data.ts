import type { Category, Order, Product } from './types';
import { PlaceHolderImages } from './placeholder-images';
import fs from 'fs';
import path from 'path';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback to a default placeholder if the specific one isn't found
    const defaultPlaceholder = PlaceHolderImages.find(img => img.id === 'new-product-placeholder');
    if(defaultPlaceholder) return defaultPlaceholder;
    throw new Error(`Image with id "${id}" not found and no default placeholder is available.`);
  }
  return image;
};

export const categories: Category[] = [
  {
    id: 'dry-goods',
    name: 'Dry Grocery',
    image: findImage('category-dry'),
  },
  {
    id: 'frozen-foods',
    name: 'Frozen Foods',
    image: findImage('category-frozen'),
  },
  {
    id: 'packaged-milk',
    name: 'Packaged Milk & Dairy',
    image: findImage('category-dairy'),
  },
];

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');
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

export const getProducts = async (): Promise<Product[]> => {
    return readDataFromFile<Product>(productsFilePath, []);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const products = await getProducts();
    return products.find(p => p.id === id);
};

export const getCategories = async () => Promise.resolve(categories);

export const getFeaturedProducts = async () => {
    const products = await getProducts();
    return products.filter(p => p.isFeatured);
};

export const getOrders = async (): Promise<Order[]> => {
    return readDataFromFile<Order>(ordersFilePath, []);
}

export const getOrderById = async (id: string) => {
    const orders = await getOrders();
    return orders.find(o => o.id === id);
};

export const getDashboardStats = async () => {
    const orders = await getOrders();
    const totalOrders = orders.length;
    const pendingCOD = orders.filter(o => o.paymentMethod === 'COD' && o.paymentStatus.startsWith('Pending')).length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid').length;
    return Promise.resolve({ totalOrders, pendingCOD, paidOrders });
}
