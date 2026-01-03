import { Product } from '../types';
import { db, mockDelay } from './mockDb';

export const productsService = {
  getByFolder: async (folderId: string): Promise<Product[]> => {
    await mockDelay();
    return db.getProducts().filter(p => p.folderId === folderId);
  },

  getAll: async (): Promise<Product[]> => {
    await mockDelay();
    return db.getProducts();
  },

  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await mockDelay();
    const newProduct: Product = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const products = db.getProducts();
    db.setProducts([...products, newProduct]);
    return newProduct;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    await mockDelay();
    const products = db.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const updated = { ...products[index], ...data, updatedAt: new Date().toISOString() };
    products[index] = updated;
    db.setProducts(products);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await mockDelay();
    const products = db.getProducts().filter(p => p.id !== id);
    db.setProducts(products);
  }
};
