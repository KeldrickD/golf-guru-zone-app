'use client';

import RulesAssistant from '@/components/RulesAssistant';
import { Toaster } from '@/components/ui/Toaster';

export default function RulesPage() {
  return (
    <div className="container mx-auto py-8">
      <RulesAssistant />
      <Toaster />
    </div>
  )
} 