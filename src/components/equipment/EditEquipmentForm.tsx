'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface EditEquipmentFormProps {
  equipmentId: string;
  initialData: {
    type: string;
    brand: string;
    model: string;
  };
  onSuccess?: () => void;
}

export function EditEquipmentForm({ equipmentId, initialData, onSuccess }: EditEquipmentFormProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/equipment/${equipmentId}/performance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update equipment');
      }

      addToast({
        title: 'Success',
        description: 'Equipment updated successfully',
      });

      onSuccess?.();
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to update equipment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="e.g., Driver, Iron, Putter"
          required
        />
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="e.g., TaylorMade, Callaway, Titleist"
          required
        />
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          placeholder="e.g., Stealth 2, Rogue ST, Pro V1"
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Equipment'}
      </Button>
    </form>
  );
} 