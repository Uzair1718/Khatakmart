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

const readProductsFromFile = (): Product[] => {
    try {
        const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Could not read products.json, starting with empty list", error);
        return [];
    }
}

const writeProductsToFile = (products: Product[]) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
        console.error("Could not write to products.json", error);
    }
}


export let products: Product[] = readProductsFromFile();

let orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Ahmed Khan',
      customerPhone: '03001234567',
      customerAddress: 'House 123, Street 4, Sector G-10, Islamabad',
      items: [
        { ...products.find(p => p.id === 'prod-001')!, quantity: 1 },
        { ...products.find(p => p.id === 'prod-010')!, quantity: 4 }
      ].filter(item => item.id), // ensure no undefined items
      total: 1850 + (260 * 4),
      paymentMethod: 'COD',
      paymentStatus: 'Pending Payment - COD',
      orderStatus: 'Pending',
      createdAt: new Date('2024-05-20T10:30:00Z')
    },
    {
      id: 'ORD-002',
      customerName: 'Fatima Ali',
      customerPhone: '03217654321',
      customerAddress: 'Apartment 5, Block B, F-11 Markaz, Islamabad',
      items: [
        { ...products.find(p => p.id === 'prod-007')!, quantity: 2 },
        { ...products.find(p => p.id === 'prod-008')!, quantity: 1 }
      ].filter(item => item.id),
      total: (1100 * 2) + 550,
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      createdAt: new Date('2024-05-19T14:00:00Z'),
      paymentProofUrl: 'https://picsum.photos/seed/proof1/200/300'
    },
    {
      id: 'ORD-003',
      customerName: 'Zainab Bibi',
      customerPhone: '03339876543',
      customerAddress: 'House 45, Lane 6, DHA Phase 2, Islamabad',
      items: [
        { ...products.find(p => p.id === 'prod-004')!, quantity: 2 }
      ].filter(item => item.id),
      total: 150 * 2,
      paymentMethod: 'Card',
      paymentStatus: 'Pending Verification',
      orderStatus: 'Confirmed',
      createdAt: new Date('2024-05-21T09:00:00Z'),
      paymentProofUrl: 'https://picsum.photos/seed/proof2/200/300'
    }
  ];

// Mock database functions
export const getProducts = async () => {
    products = readProductsFromFile();
    return Promise.resolve(products);
};
export const getProductById = async (id: string) => {
    products = readProductsFromFile();
    return Promise.resolve(products.find(p => p.id === id));
};
export const getCategories = async () => Promise.resolve(categories);
export const getFeaturedProducts = async () => {
    products = readProductsFromFile();
    return Promise.resolve(products.filter(p => p.isFeatured));
};

export const addProduct = async (productData: Omit<Product, 'id' | 'image'> & { image: { id: string } }) => {
    products = readProductsFromFile();
    const newProduct: Product = {
        ...productData,
        id: `prod-${String(products.length + 1).padStart(3, '0')}`,
        image: findImage(productData.image.id),
    };
    const updatedProducts = [newProduct, ...products];
    writeProductsToFile(updatedProducts);
    products = updatedProducts;
    return Promise.resolve(newProduct);
}

export const getOrders = async () => Promise.resolve(orders);
export const getOrderById = async (id: string) => Promise.resolve(orders.find(o => o.id === id));
export const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
        ...order,
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
    };
    orders.push(newOrder);
    return Promise.resolve(newOrder);
}
export const updateOrderStatus = async (id: string, orderStatus: Order['orderStatus'], paymentStatus: Order['paymentStatus']) => {
    const orderIndex = orders.findIndex(o => o.id === id);
    if(orderIndex !== -1) {
        orders[orderIndex].orderStatus = orderStatus;
        orders[orderIndex].paymentStatus = paymentStatus;
        return Promise.resolve(orders[orderIndex]);
    }
    return Promise.resolve(null);
}

export const getDashboardStats = async () => {
    const totalOrders = orders.length;
    const pendingCOD = orders.filter(o => o.paymentMethod === 'COD' && o.paymentStatus.startsWith('Pending')).length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid').length;
    return Promise.resolve({ totalOrders, pendingCOD, paidOrders });
}
