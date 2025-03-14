'use client';

import { ShoppingBag } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { EquipmentRecommenderHub } from '@/components/equipment/EquipmentRecommenderHub';

export default function EquipmentPage() {
  return (
    <>
      <PageHeader
        title="Equipment Recommender"
        description="Get personalized club recommendations and analysis based on your body metrics, swing attributes, and performance data."
        icon={ShoppingBag}
        gradient
      />
      
      <Section>
        <EquipmentRecommenderHub />
      </Section>
    </>
  );
} 