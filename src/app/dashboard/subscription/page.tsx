'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CalendarDays, CreditCard, Settings } from 'lucide-react';

interface SubscriptionData {
  status: string;
  plan: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
}

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (!response.ok) throw new Error('Failed to fetch subscription data');
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError('Unable to load subscription information');
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      await fetchSubscriptionData(); // Refresh data
    } catch (err) {
      setError('Failed to cancel subscription');
      console.error('Error canceling subscription:', err);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/resume', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to resume subscription');
      await fetchSubscriptionData(); // Refresh data
    } catch (err) {
      setError('Failed to resume subscription');
      console.error('Error resuming subscription:', err);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      const response = await fetch('/api/subscription/update-payment', {
        method: 'POST',
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      setError('Failed to update payment method');
      console.error('Error updating payment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading subscription details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchSubscriptionData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        
        {/* Subscription Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Plan
              <Badge variant={subscription?.status === 'active' ? 'default' : 'destructive'}>
                {subscription?.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {subscription?.plan} Plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Current Period</p>
                <p className="text-sm text-muted-foreground">
                  Renews on {new Date(subscription?.currentPeriodEnd || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {subscription?.paymentMethod && (
              <div className="flex items-center space-x-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.paymentMethod.brand.toUpperCase()} ending in {subscription.paymentMethod.last4}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              {subscription?.status === 'active' && !subscription?.cancelAtPeriodEnd && (
                <Button variant="destructive" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              )}
              {subscription?.cancelAtPeriodEnd && (
                <Button variant="default" onClick={handleResumeSubscription}>
                  Resume Subscription
                </Button>
              )}
              <Button variant="outline" onClick={handleUpdatePaymentMethod}>
                Update Payment Method
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                Change Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Usage Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Rounds Analyzed:</span> Coming soon
              </p>
              <p className="text-sm">
                <span className="font-medium">AI Coaching Sessions:</span> Coming soon
              </p>
              <p className="text-sm">
                <span className="font-medium">Equipment Recommendations:</span> Coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 