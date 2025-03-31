'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { EquipmentStats } from '@/components/equipment/EquipmentStats';
import { EditEquipmentForm } from '@/components/equipment/EditEquipmentForm';
import { MaintenanceForm } from '@/components/equipment/MaintenanceForm';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  brand: string;
  model: string;
  type?: string;
  specs?: string;
  purchaseDate?: string;
  notes?: string;
}

export default function EquipmentPerformancePage() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { addToast } = useToast();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [selectedEquipmentData, setSelectedEquipmentData] = useState<Equipment | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchEquipmentList();
    }
  }, [session]);

  useEffect(() => {
    if (selectedEquipmentId) {
      fetchEquipmentData(selectedEquipmentId);
    }
  }, [selectedEquipmentId]);

  const fetchEquipmentList = async () => {
    try {
      const response = await fetch('/api/equipment');
      const data = await response.json();
      setEquipmentList(data);
      if (data.length > 0 && !selectedEquipmentId) {
        setSelectedEquipmentId(data[0].id);
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch equipment list',
        variant: 'destructive',
      });
    }
  };

  const fetchEquipmentData = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/equipment/${id}/performance`);
      const data = await response.json();
      setSelectedEquipmentData(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch equipment data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipmentId(id);
    setShowEditForm(false);
    setShowMaintenanceForm(false);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchEquipmentData(selectedEquipmentId as string);
  };

  const handleMaintenanceSuccess = () => {
    setShowMaintenanceForm(false);
    fetchEquipmentData(selectedEquipmentId as string);
  };

  if (!session) {
    return <div>Please sign in to view equipment performance.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {equipmentList.map((equipment) => (
            <Button
              key={equipment.id}
              onClick={() => handleEquipmentSelect(equipment.id)}
              className={selectedEquipmentId === equipment.id ? 'bg-primary' : ''}
            >
              {equipment.brand} {equipment.model}
            </Button>
          ))}
        </div>

        {loading ? (
          <div>Loading equipment data...</div>
        ) : selectedEquipmentData ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedEquipmentData.brand} {selectedEquipmentData.model}
              </h2>
              <div className="space-x-4">
                <Button
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="bg-secondary"
                >
                  {showEditForm ? 'Cancel Edit' : 'Edit Equipment'}
                </Button>
                <Button
                  onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
                  className="bg-secondary"
                >
                  {showMaintenanceForm ? 'Cancel Maintenance' : 'Add Maintenance'}
                </Button>
              </div>
            </div>

            {showEditForm ? (
              <EditEquipmentForm
                equipmentId={selectedEquipmentId || ''}
                initialData={selectedEquipmentData}
                onSuccess={handleEditSuccess}
                locale={locale}
              />
            ) : showMaintenanceForm ? (
              <MaintenanceForm
                equipmentId={selectedEquipmentId || ''}
                onSuccess={handleMaintenanceSuccess}
                locale={locale}
              />
            ) : (
              <EquipmentStats stats={selectedEquipmentData} />
            )}
          </div>
        ) : (
          <div>No equipment data available.</div>
        )}
      </div>
    </div>
  );
} 