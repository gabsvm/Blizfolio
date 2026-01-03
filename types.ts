export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Address {
  country: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  whatsapp?: string;
  website?: string;
}

export interface FiscalInfo {
  taxType: string;
  fiscalId: string;
  vatCondition: string;
  fiscalAddress: string;
}

export interface Company {
  id: string;
  legalName: string;
  commercialName: string;
  tagline?: string;
  industry: string;
  foundedYear: number;
  size: string;
  logoUrl?: string;
  bannerUrl?: string;
  email: string;
  phone: string;
  social: SocialLinks;
  location: Address;
  fiscal: FiscalInfo;
  plan: 'Free' | 'Pro' | 'Business';
  status: 'Active' | 'Pending' | 'Suspended';
  adminNotes?: string;
  profileCompletion: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Red / XL"
  price: number;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  metadata?: string;
}

export interface Product {
  id: string;
  folderId: string;
  name: string;
  sku: string;
  shortDescription: string;
  longDescription: string;
  type: 'physical' | 'service' | 'digital';
  stock: number;
  minStockAlert: number;
  basePrice: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  coverImage?: string;
  status: 'Draft' | 'Published';
  productCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalFolders: number;
  totalProducts: number;
  lowStockCount: number;
  profileCompletion: number;
  recentActivity: Array<{ id: string; action: string; target: string; date: string }>;
}
