import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CompanyProfile } from './pages/CompanyProfile';
import { Folders } from './pages/Folders';
import { FolderDetails } from './pages/FolderDetails';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { ToastContainer } from './components/ui/Toast.tsx';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { checkSession } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="folders" element={<Folders />} />
          <Route path="folders/:id" element={<FolderDetails />} />
        </Route>
      </Routes>
      <ToastContainer />
    </HashRouter>
  );
};

export default App;
