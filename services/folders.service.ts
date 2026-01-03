import { Folder } from '../types';
import { db, mockDelay } from './mockDb';

export const foldersService = {
  getAll: async (): Promise<Folder[]> => {
    await mockDelay();
    const folders = db.getFolders();
    // Update product counts dynamically
    const products = db.getProducts();
    const updatedFolders = folders.map(f => ({
      ...f,
      productCount: products.filter(p => p.folderId === f.id).length
    }));
    return updatedFolders;
  },

  create: async (data: Omit<Folder, 'id' | 'createdAt' | 'productCount'>): Promise<Folder> => {
    await mockDelay();
    const newFolder: Folder = {
      ...data,
      id: `f-${Date.now()}`,
      createdAt: new Date().toISOString(),
      productCount: 0,
    };
    const folders = db.getFolders();
    db.setFolders([...folders, newFolder]);
    return newFolder;
  },

  update: async (id: string, data: Partial<Folder>): Promise<Folder> => {
    await mockDelay();
    const folders = db.getFolders();
    const index = folders.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Folder not found');
    
    const updated = { ...folders[index], ...data };
    folders[index] = updated;
    db.setFolders(folders);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await mockDelay();
    const folders = db.getFolders().filter(f => f.id !== id);
    db.setFolders(folders);
    // Also delete associated products
    const products = db.getProducts().filter(p => p.folderId !== id);
    db.setProducts(products);
  }
};
