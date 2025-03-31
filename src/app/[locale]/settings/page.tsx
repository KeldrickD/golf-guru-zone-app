'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { localizeUrl } from '@/lib/route-utils';

interface UserSettings {
  handicap: number | null;
  homeClub: string | null;
  preferredUnits: 'metric' | 'imperial';
  notifications: {
    roundReminders: boolean;
    performanceUpdates: boolean;
    equipmentMaintenance: boolean;
  };
  displayPreferences: {
    darkMode: boolean;
    compactView: boolean;
  };
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { addToast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    handicap: null,
    homeClub: null,
    preferredUnits: 'imperial',
    notifications: {
      roundReminders: true,
      performanceUpdates: true,
      equipmentMaintenance: true,
    },
    displayPreferences: {
      darkMode: false,
      compactView: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Mock data for now
      setSettings({
        handicap: 12.5,
        homeClub: 'Pine Valley Golf Club',
        preferredUnits: 'imperial',
        notifications: {
          roundReminders: true,
          performanceUpdates: true,
          equipmentMaintenance: true,
        },
        displayPreferences: {
          darkMode: false,
          compactView: false,
        },
      });
      
      addToast({
        title: 'Notice',
        description: 'Using sample settings data',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Demo version - just show success message
      setTimeout(() => {
        addToast({
          title: 'Success',
          description: 'Settings updated successfully',
        });
        setSaving(false);
      }, 1000);
      
      // API integration would be:
      /*
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      */
    } catch (error) {
      console.error('Error saving settings:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access settings</h1>
        <Button asChild>
          <a href={localizeUrl('/login', locale)}>Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your golf profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="handicap" className="block text-sm font-medium text-gray-700">
                  Handicap
                </label>
                <input
                  type="number"
                  id="handicap"
                  value={settings.handicap || ''}
                  onChange={(e) => setSettings({ ...settings, handicap: e.target.value ? parseFloat(e.target.value) : null })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  step="0.1"
                  min="0"
                  max="54"
                />
              </div>

              <div>
                <label htmlFor="homeClub" className="block text-sm font-medium text-gray-700">
                  Home Club
                </label>
                <input
                  type="text"
                  id="homeClub"
                  value={settings.homeClub || ''}
                  onChange={(e) => setSettings({ ...settings, homeClub: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="preferredUnits" className="block text-sm font-medium text-gray-700">
                  Preferred Units
                </label>
                <select
                  id="preferredUnits"
                  value={settings.preferredUnits}
                  onChange={(e) => setSettings({ ...settings, preferredUnits: e.target.value as 'metric' | 'imperial' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="imperial">Imperial (yards, miles)</option>
                  <option value="metric">Metric (meters, kilometers)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="roundReminders"
                  checked={settings.notifications.roundReminders}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, roundReminders: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="roundReminders" className="ml-2 block text-sm text-gray-700">
                  Round Reminders
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="performanceUpdates"
                  checked={settings.notifications.performanceUpdates}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, performanceUpdates: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="performanceUpdates" className="ml-2 block text-sm text-gray-700">
                  Performance Updates
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="equipmentMaintenance"
                  checked={settings.notifications.equipmentMaintenance}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, equipmentMaintenance: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="equipmentMaintenance" className="ml-2 block text-sm text-gray-700">
                  Equipment Maintenance Reminders
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize how the app looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={settings.displayPreferences.darkMode}
                  onChange={(e) => setSettings({
                    ...settings,
                    displayPreferences: { ...settings.displayPreferences, darkMode: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                  Dark Mode
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="compactView"
                  checked={settings.displayPreferences.compactView}
                  onChange={(e) => setSettings({
                    ...settings,
                    displayPreferences: { ...settings.displayPreferences, compactView: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="compactView" className="ml-2 block text-sm text-gray-700">
                  Compact View
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 