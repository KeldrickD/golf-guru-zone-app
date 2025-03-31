'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { signOut, useSession } from 'next-auth/react';
import { localizeUrl } from '@/lib/route-utils';
import {
  BarChart2,
  Settings,
  Club,
  LineChart,
  GoalIcon,
  Menu,
  X,
} from 'lucide-react';

const routes = [
  { name: 'Dashboard', href: '/', icon: BarChart2 },
  { name: 'Rounds', href: '/rounds', icon: GoalIcon },
  { name: 'Courses', href: '/courses', icon: Club },
  { name: 'Equipment', href: '/equipment', icon: Club },
  { name: 'Equipment Performance', href: '/equipment/performance', icon: LineChart },
  { name: 'Statistics', href: '/statistics', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // Map the base routes to include the locale
  const navigation = routes.map(item => ({
    ...item,
    href: localizeUrl(item.href, locale),
    isActive: pathname === localizeUrl(item.href, locale),
  }));

  return (
    <>
      {/* Mobile Menu Toggle Button - Fixed to the top left */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop (only shown when mobile menu is open) */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation sidebar */}
      <div 
        className={cn(
          "h-full flex-col border-r bg-white transition-all duration-300 ease-in-out",
          isMobile ? "fixed z-40 w-64" : "w-64",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b">
          <Link href={localizeUrl('/', locale)} className="text-xl font-bold hover:opacity-80 transition-opacity">
            Golf Guru Zone
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  item.isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center px-4 py-2 text-sm">
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              className="h-8 w-8 rounded-full mr-3"
            />
            <div className="flex-1 truncate">
              <p className="font-medium">{session?.user?.name || 'Guest'}</p>
              <p className="text-gray-500 truncate">{session?.user?.email || ''}</p>
            </div>
          </div>
          
          {session ? (
            <Button
              variant="ghost"
              className="w-full justify-start mt-2"
              onClick={() => signOut({ callbackUrl: localizeUrl('/login', locale) })}
            >
              Sign out
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start mt-2"
              asChild
            >
              <Link href={localizeUrl('/login', locale)}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
} 