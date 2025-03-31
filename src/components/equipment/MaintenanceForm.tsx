'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

interface MaintenanceFormProps {
  equipmentId: string;
  onSuccess?: () => void;
}

export function MaintenanceForm({ equipmentId, onSuccess }: MaintenanceFormProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/equipment/${equipmentId}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add maintenance record');
      }

      addToast({
        title: 'Success',
        description: 'Maintenance record added successfully',
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: '',
        notes: '',
      });

      onSuccess?.();
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to add maintenance record',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Maintenance Type</Label>
        <Input
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="e.g., Cleaning, Regripping, Shaft Replacement"
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional details about the maintenance..."
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Maintenance Record'}
      </Button>
    </form>
  );
} 