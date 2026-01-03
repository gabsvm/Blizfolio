import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { foldersService } from '../services/folders.service';
import { productsService } from '../services/products.service';
import { companyService } from '../services/company.service';
import { DashboardStats } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguageStore();

  useEffect(() => {
    const fetchData = async () => {
      const [folders, products, company] = await Promise.all([
        foldersService.getAll(),
        productsService.getAll(),
        companyService.getCompany()
      ]);

      setStats({
        totalFolders: folders.length,
        totalProducts: products.length,
        lowStockCount: products.filter(p => p.stock <= p.minStockAlert).length,
        profileCompletion: company.profileCompletion,
        recentActivity: [
          { id: '1', action: 'Created product', target: 'Summer T-Shirt', date: '2 hours ago' },
          { id: '2', action: 'Updated stock', target: 'Canvas Tote', date: '5 hours ago' },
          { id: '3', action: 'Published folder', target: 'Summer Collection', date: '1 day ago' },
        ]
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !stats) return <div className="p-8 text-center text-brand-600 font-medium animate-pulse">{t('common.loading')}</div>;

  const StatCard = ({ title, value, icon, gradient }: any) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-lg border border-white/20 group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${gradient}`}>
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/20 blur-2xl group-hover:scale-110 transition-transform"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-extrabold text-white mt-2 drop-shadow-sm">{value}</h3>
        </div>
        <span className="p-3 rounded-xl bg-white/20 backdrop-blur-md text-2xl shadow-inner border border-white/10">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('dash.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-lg">{t('dash.subtitle')}</p>
        </div>
        <div className="hidden md:block text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-4 py-2 rounded-full border border-brand-100 dark:border-brand-700/50">
            Current Plan: <span className="font-bold">Pro</span> 🚀
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('dash.totalFolders')} value={stats.totalFolders} icon="📁" gradient="from-blue-500 to-blue-600" />
        <StatCard title={t('dash.totalProducts')} value={stats.totalProducts} icon="📦" gradient="from-violet-500 to-purple-600" />
        <StatCard title={t('dash.lowStock')} value={stats.lowStockCount} icon="⚠️" gradient="from-amber-400 to-orange-500" />
        <StatCard title={t('dash.profile')} value={`${stats.profileCompletion}%`} icon="🏢" gradient="from-emerald-400 to-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-brand-100 dark:bg-brand-900/50 p-1.5 rounded-lg text-brand-600">⚡</span> 
            {t('dash.quickActions')}
          </h2>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <Link to="/folders" className="group p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-brand-50/50 dark:hover:bg-brand-900/20 hover:border-brand-300 transition-all text-center flex flex-col items-center justify-center gap-2">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">➕</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{t('dash.newProduct')}</span>
            </Link>
            <Link to="/folders" className="group p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-brand-50/50 dark:hover:bg-brand-900/20 hover:border-brand-300 transition-all text-center flex flex-col items-center justify-center gap-2">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">📁</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{t('dash.newFolder')}</span>
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
             <span className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-lg text-blue-600">🕒</span> 
             {t('dash.recentActivity')}
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                    <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{activity.action}</p>
                        <p className="text-xs text-gray-500 font-medium">{activity.target}</p>
                    </div>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};