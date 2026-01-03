import { Company, Folder, Product, User } from '../types';

const STORAGE_KEYS = {
  USER: 'bizfolio_user',
  TOKEN: 'bizfolio_token',
  COMPANY: 'bizfolio_company',
  FOLDERS: 'bizfolio_folders',
  PRODUCTS: 'bizfolio_products',
};

const INITIAL_COMPANY: Company = {
  id: 'c1',
  legalName: 'Acme Innovations Ltd.',
  commercialName: 'Acme Studio',
  industry: 'Technology',
  foundedYear: 2020,
  size: '1-10',
  email: 'contact@acme.com',
  phone: '+1 555 0123',
  social: { website: 'https://acme.com' },
  location: {
    country: 'USA',
    province: 'California',
    city: 'San Francisco',
    addressLine: '123 Innovation Dr',
    postalCode: '94103',
  },
  fiscal: {
    taxType: 'Corporation',
    fiscalId: 'US-99887766',
    vatCondition: 'Registered',
    fiscalAddress: 'Same as location',
  },
  plan: 'Pro',
  status: 'Active',
  profileCompletion: 85,
};

const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'f1',
    name: 'Summer Collection 2024',
    description: 'New arrivals for the summer season',
    category: 'Apparel',
    tags: ['summer', 'beach', 'new'],
    status: 'Published',
    productCount: 2,
    createdAt: new Date().toISOString(),
    coverImage: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 'f2',
    name: 'Digital Assets',
    description: 'Downloadable templates',
    category: 'Digital',
    tags: ['templates', 'pdf'],
    status: 'Draft',
    productCount: 1,
    createdAt: new Date().toISOString(),
    coverImage: 'https://picsum.photos/400/300?random=2',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    folderId: 'f1',
    name: 'Sunset T-Shirt',
    sku: 'TSH-001',
    shortDescription: 'Cotton beach t-shirt',
    longDescription: 'High quality 100% cotton t-shirt perfect for summer days.',
    type: 'physical',
    stock: 45,
    minStockAlert: 10,
    basePrice: 29.99,
    images: [{ id: 'img1', url: 'https://picsum.photos/300/300?random=3', isPrimary: true }],
    variants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    folderId: 'f1',
    name: 'Canvas Tote',
    sku: 'TOT-002',
    shortDescription: 'Durable canvas bag',
    longDescription: 'Eco-friendly tote bag.',
    type: 'physical',
    stock: 5,
    minStockAlert: 10,
    basePrice: 15.00,
    images: [{ id: 'img2', url: 'https://picsum.photos/300/300?random=4', isPrimary: true }],
    variants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    folderId: 'f2',
    name: 'Business Plan Template',
    sku: 'DIG-001',
    shortDescription: 'PDF Template',
    longDescription: 'Complete business plan structure.',
    type: 'digital',
    stock: 999,
    minStockAlert: 0,
    basePrice: 49.00,
    images: [{ id: 'img3', url: 'https://picsum.photos/300/300?random=5', isPrimary: true }],
    variants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockDelay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = {
  getUser: (): User | null => {
    const s = localStorage.getItem(STORAGE_KEYS.USER);
    return s ? JSON.parse(s) : null;
  },
  setUser: (user: User) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getCompany: (): Company => {
    const s = localStorage.getItem(STORAGE_KEYS.COMPANY);
    return s ? JSON.parse(s) : INITIAL_COMPANY;
  },
  setCompany: (company: Company) => localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company)),

  getFolders: (): Folder[] => {
    const s = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    return s ? JSON.parse(s) : INITIAL_FOLDERS;
  },
  setFolders: (folders: Folder[]) => localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders)),

  getProducts: (): Product[] => {
    const s = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return s ? JSON.parse(s) : INITIAL_PRODUCTS;
  },
  setProducts: (products: Product[]) => localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)),
};