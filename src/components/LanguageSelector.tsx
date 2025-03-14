'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useLanguage } from '@/context/LanguageContext';

// Supported languages with their display names
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export default function LanguageSelector() {
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 px-2 md:px-3"
        >
          <Globe className="h-4 w-4 md:mr-1" />
          <span className="hidden md:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="inline md:hidden">{currentLanguage.flag}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center gap-2 py-2"
            onClick={() => setLanguage(lang.code)}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.name}</span>
            {lang.code === language && (
              <Check className="h-4 w-4 ml-auto text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 