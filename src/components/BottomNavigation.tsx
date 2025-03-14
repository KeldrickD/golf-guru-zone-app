import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/stats', label: 'Stats', icon: '📊' },
    { path: '/modern-ui', label: 'Bets', icon: '🏌️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation; 