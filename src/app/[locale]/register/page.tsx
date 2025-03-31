'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { localizeUrl } from '@/lib/route-utils';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { t } = useLanguage();
  const { addToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Basic validation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // In a demo environment, we'll simulate a successful registration
      setTimeout(() => {
        addToast({
          title: t('auth.demoMode'),
          description: 'Registration simulation completed. Redirecting to login.',
          variant: 'default',
        });
        
        router.push(localizeUrl('/login', locale));
      }, 1500);
      
      // In a real environment, we would use API call:
      /*
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      router.push(localizeUrl('/login', locale));
      */
    } catch (error) {
      console.error('Registration error:', error);
      addToast({
        title: t('auth.error'),
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setLoading(true);
      
      // Demo mode - simulate login
      setTimeout(() => {
        addToast({
          title: t('auth.demoMode'),
          description: `${provider} registration simulation completed. Redirecting to dashboard.`,
          variant: 'default',
        });
        
        router.push(localizeUrl('/dashboard', locale));
      }, 1000);
      
      // Real implementation would use:
      // await signIn(provider, { callbackUrl: localizeUrl('/dashboard', locale) });
    } catch (error) {
      console.error(`${provider} registration error:`, error);
      addToast({
        title: t('auth.error'),
        description: 'Social registration failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Golf Guru Zone</span>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">{t('auth.signUp')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.createAccount')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col gap-4 mb-6">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <FaGoogle /> {t('auth.signUpWith')} Google
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <FaGithub /> {t('auth.signUpWith')} GitHub
              </Button>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  {t('common.or')}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t('auth.name')}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t('auth.confirmPassword')}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.signUp')}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link 
                href={localizeUrl('/login', locale)}
                className="text-blue-600 hover:underline"
              >
                {t('auth.signIn')}
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Golf Guru Zone. {t('common.allRightsReserved')}</span>
        </div>
      </div>
    </div>
  );
} 