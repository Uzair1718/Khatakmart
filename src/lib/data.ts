import type { Category } from './types';
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


export const getCategories = async () => Promise.resolve(categories);
