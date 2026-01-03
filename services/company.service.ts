import { Company } from '../types';
import { db, mockDelay } from './mockDb';

export const companyService = {
  getCompany: async (): Promise<Company> => {
    await mockDelay();
    return db.getCompany();
  },

  updateCompany: async (data: Partial<Company>): Promise<Company> => {
    await mockDelay();
    const current = db.getCompany();
    const updated = { ...current, ...data };
    
    // Recalculate completion profile logic (simplified)
    let score = 0;
    if (updated.legalName) score += 20;
    if (updated.email) score += 20;
    if (updated.location.country) score += 20;
    if (updated.fiscal.fiscalId) score += 20;
    if (updated.logoUrl) score += 20;
    updated.profileCompletion = score;

    db.setCompany(updated);
    return updated;
  }
};
