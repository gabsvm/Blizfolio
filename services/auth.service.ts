import { AuthResponse, User } from '../types';
import { db, mockDelay } from './mockDb';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await mockDelay();
    if (email === 'demo@bizfolio.com' && password === 'password') {
      const user: User = {
        id: 'u1',
        email,
        name: 'Alex Founder',
        role: 'admin',
        avatar: 'https://picsum.photos/100/100',
      };
      const token = 'mock-jwt-token-' + Date.now();
      db.setUser(user);
      db.setToken(token);
      return { user, token };
    }
    throw new Error('Invalid credentials');
  },

  register: async (email: string, _password: string): Promise<AuthResponse> => {
    await mockDelay();
    const user: User = {
      id: `u-${Date.now()}`,
      email,
      name: 'New User',
      role: 'user',
    };
    const token = 'mock-jwt-token-' + Date.now();
    db.setUser(user);
    db.setToken(token);
    return { user, token };
  },

  logout: async (): Promise<void> => {
    await mockDelay(200);
    db.clearAuth();
  },

  getCurrentUser: (): User | null => {
    return db.getUser();
  }
};