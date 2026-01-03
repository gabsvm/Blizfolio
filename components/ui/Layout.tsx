import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export const Layout = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { language, setLanguage, t } = useLanguageStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      isActive
        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 translate-x-1'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:translate-x-1'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      
      {/* Abstract Background Blobs for specific vibes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 glass border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col fixed h-full z-20 hidden md:flex backdrop-blur-md">
        <div className="p-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-500 tracking-tight">
            BizFolio
          </h1>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">Workspace</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavLink to="/" className={navItemClass}>
            <span className="text-xl">📊</span> <span className="font-medium">{t('nav.dashboard')}</span>
          </NavLink>
          <NavLink to="/profile" className={navItemClass}>
            <span className="text-xl">🏢</span> <span className="font-medium">{t('nav.profile')}</span>
          </NavLink>
          <NavLink to="/folders" className={navItemClass}>
            <span className="text-xl">📁</span> <span className="font-medium">{t('nav.folders')}</span>
          </NavLink>
        </nav>

        <div className="p-6 m-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 backdrop-blur-sm">
           {/* Language Switcher */}
           <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setLanguage('en')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${language === 'en' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('es')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${language === 'es' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              ES
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 rounded-lg mb-2 flex items-center transition-colors"
          >
            {isDark ? `☀️ ${t('nav.mode.light')}` : `🌙 ${t('nav.mode.dark')}`}
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center transition-colors"
          >
            🚪 {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full glass border-b border-gray-200/50 dark:border-gray-700/50 z-20 flex justify-between items-center p-4 backdrop-blur-md">
        <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-500">BizFolio</span>
        <button onClick={handleLogout} className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('nav.logout')}</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 pt-24 md:pt-8 overflow-y-auto h-screen relative z-10">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
            <Outlet />
        </div>
      </main>
    </div>
  );
};