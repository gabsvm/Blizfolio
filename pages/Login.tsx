import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useLanguageStore } from '../store/useLanguageStore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useLanguageStore();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'demo@bizfolio.com', password: 'password' }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login(data.email, data.password);
      login(response.user, response.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0f172a] overflow-hidden">
        
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="glass-card bg-white/70 dark:bg-gray-900/60 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/40 dark:border-white/10 relative z-10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-500 tracking-tight">BizFolio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('login.title')}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label={t('login.email')} 
            {...register('email')} 
            error={errors.email?.message} 
            placeholder="demo@bizfolio.com"
          />
          <Input 
            label={t('login.password')} 
            type="password" 
            {...register('password')} 
            error={errors.password?.message} 
            placeholder="••••••"
          />
          
          <Button type="submit" className="w-full text-lg shadow-xl shadow-brand-500/20 mt-2" isLoading={isLoading}>
            {t('login.btn')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('login.footer')} <Link to="/register" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">{t('login.create')}</Link>
        </div>
      </div>
    </div>
  );
};