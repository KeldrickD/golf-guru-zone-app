'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  specs: string | null;
  purchaseDate: string | null;
  notes: string | null;
}

export default function EquipmentPage() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { addToast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment');
      if (!response.ok) {
        throw new Error('Failed to fetch equipment');
      }
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch equipment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Equipment</h1>
          <Link href={`/${locale}/equipment/new`}>
            <Button>Add New Equipment</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{item.type}</CardTitle>
                <CardDescription>{item.brand} {item.model}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.specs && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specifications:</span>
                      <span className="font-medium">{item.specs}</span>
                    </div>
                  )}
                  {item.purchaseDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Purchase Date:</span>
                      <span className="font-medium">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {item.notes && (
                    <div className="mt-2">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-sm mt-1">{item.notes}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Link href={`/${locale}/equipment/${item.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/equipment/${item.id}`, {
                          method: 'DELETE',
                        });
                        if (!response.ok) throw new Error('Failed to delete equipment');
                        setEquipment(equipment.filter(e => e.id !== item.id));
                        addToast({
                          title: 'Success',
                          description: 'Equipment deleted successfully',
                        });
                      } catch (error) {
                        addToast({
                          title: 'Error',
                          description: 'Failed to delete equipment',
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {equipment.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">No equipment added yet</h2>
            <p className="text-gray-500 mt-2">Add your first piece of equipment to get started</p>
          </div>
        )}
      </div>
    </div>
  );
} 