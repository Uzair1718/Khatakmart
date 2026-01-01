import type { Category, Order, Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

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

export let products: Product[] = [
  {
    id: 'prod-001',
    name: 'Basmati Rice 5kg',
    description: 'Premium quality long-grain Basmati rice, perfect for biryani and pulao.',
    price: 1850,
    image: findImage('rice'),
    category: 'dry-goods',
    stock: 50,
    isFeatured: true,
  },
  {
    id: 'prod-002',
    name: 'Whole Wheat Flour 10kg',
    description: 'Fine quality chakki atta for soft and fluffy rotis.',
    price: 1200,
    image: findImage('flour'),
    category: 'dry-goods',
    stock: 40,
  },
  {
    id: 'prod-003',
    name: 'Red Lentils (Masoor Dal) 1kg',
    description: 'High-protein red lentils, easy to cook and delicious.',
    price: 320,
    image: findImage('lentils'),
    category: 'dry-goods',
    stock: 100,
  },
  {
    id: 'prod-004',
    name: 'National Biryani Masala',
    description: 'A special blend of spices for authentic Sindhi Biryani.',
    price: 150,
    image: findImage('spices'),
    category: 'dry-goods',
    stock: 200,
    isFeatured: true,
  },
  {
    id: 'prod-005',
    name: 'Family Pack Potato Chips',
    description: 'Classic salted potato chips, a perfect snack for any time.',
    price: 100,
    image: findImage('snacks'),
    category: 'dry-goods',
    stock: 150,
  },
  {
    id: 'prod-006',
    name: 'Mixed Fruit Juice 1L',
    description: 'Refreshing and nutritious mixed fruit juice.',
    price: 280,
    image: findImage('beverages'),
    category: 'dry-goods',
    stock: 80,
  },
  {
    id: 'prod-007',
    name: 'Frozen Chicken Breast 1kg',
    description: 'Boneless and skinless chicken breast, frozen to maintain freshness.',
    price: 1100,
    image: findImage('frozen-chicken'),
    category: 'frozen-foods',
    stock: 30,
    isFeatured: true,
  },
  {
    id: 'prod-008',
    name: 'Frozen French Fries 1kg',
    description: 'Ready-to-cook french fries for a quick and tasty side.',
    price: 550,
    image: findImage('frozen-fries'),
    category: 'frozen-foods',
    stock: 60,
  },
  {
    id: 'prod-009',
    name: 'Chicken Nuggets 500g',
    description: 'Crispy and tender chicken nuggets, a favorite for all ages.',
    price: 750,
    image: findImage('nuggets'),
    category: 'frozen-foods',
    stock: 45,
    isFeatured: true,
  },
  {
    id: 'prod-010',
    name: 'Full Cream Milk 1L',
    description: 'UHT processed full cream milk, with a long shelf life.',
    price: 260,
    image: findImage('packaged-milk'),
    category: 'packaged-milk',
    expiryDate: '2024-12-31',
    stock: 120,
  },
  {
    id: 'prod-011',
    name: 'Cooking Oil 3L',
    description: 'Versatile cooking oil for all your frying and cooking needs.',
    price: 1600,
    image: findImage('cooking-oil'),
    category: 'dry-goods',
    stock: 70,
  },
  {
    id: 'prod-012',
    name: 'Refined Sugar 1kg',
    description: 'Clean and pure refined white sugar.',
    price: 180,
    image: findImage('sugar'),
    category: 'dry-goods',
    stock: 300,
  },
  {
    id: 'prod-013',
    name: 'Black Tea Bags (100 pack)',
    description: 'Rich and aromatic black tea for a perfect start to your day.',
    price: 450,
    image: findImage('tea'),
    category: 'dry-goods',
    stock: 90,
  },
  {
    id: 'prod-014',
    name: 'Chocolate Chip Biscuits',
    description: 'Deliciously sweet biscuits packed with chocolate chips.',
    price: 220,
    image: findImage('biscuits'),
    category: 'dry-goods',
    stock: 110,
    isFeatured: true,
  },
];

let orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Ahmed Khan',
      customerPhone: '03001234567',
      customerAddress: 'House 123, Street 4, Sector G-10, Islamabad',
      items: [
        { ...products[0], quantity: 1, image: products[0].image },
        { ...products[9], quantity: 4, image: products[9].image }
      ],
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
        { ...products[6], quantity: 2, image: products[6].image },
        { ...products[7], quantity: 1, image: products[7].image }
      ],
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
        { ...products[3], quantity: 2, image: products[3].image }
      ],
      total: 150 * 2,
      paymentMethod: 'Card',
      paymentStatus: 'Pending Verification',
      orderStatus: 'Confirmed',
      createdAt: new Date('2024-05-21T09:00:00Z'),
      paymentProofUrl: 'https://picsum.photos/seed/proof2/200/300'
    }
  ];

// Mock database functions
export const getProducts = async () => Promise.resolve(products);
export const getProductById = async (id: string) => Promise.resolve(products.find(p => p.id === id));
export const getCategories = async () => Promise.resolve(categories);
export const getFeaturedProducts = async () => Promise.resolve(products.filter(p => p.isFeatured));

export const addProduct = async (productData: Omit<Product, 'id' | 'image'> & { image: { id: string } }) => {
    const newProduct: Product = {
        ...productData,
        id: `prod-${String(products.length + 1).padStart(3, '0')}`,
        image: findImage(productData.image.id),
    };
    products.unshift(newProduct);
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
    const pendingCOD = orders.filter(o => o.paymentStatus === 'Pending Payment - COD').length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid').length;
    return Promise.resolve({ totalOrders, pendingCOD, paidOrders });
}
