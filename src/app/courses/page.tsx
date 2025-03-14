'use client';

import React from 'react';
import { Map } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { useLanguage } from '@/context/LanguageContext';
import { CourseDiscoveryTool } from '@/components/courses/CourseDiscoveryTool';

export default function CoursesPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <PageHeader
        title={t('courses.title')}
        description={t('courses.description')}
        icon={Map}
        gradient
      />
      
      <Section>
        <CourseDiscoveryTool />
      </Section>
    </>
  );
} 