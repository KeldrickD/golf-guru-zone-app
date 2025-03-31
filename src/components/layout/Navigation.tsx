'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { signOut, useSession } from 'next-auth/react';
import {
  BarChart2,
  Settings,
  Club,
  LineChart,
  GoalIcon,
} from 'lucide-react';

const navigation = [
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
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold">Golf Guru Zone</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                isActive
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
          <div className="flex-1">
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start mt-2"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
} 