'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/Popover';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import { getOfflineRounds, syncOfflineRounds } from '@/lib/indexedDb';

/**
 * OfflineIndicator component that shows network status and manages offline data
 */
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingRounds, setPendingRounds] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  // Check online status and pending rounds when component mounts
  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      checkPendingRounds();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending rounds on mount
    checkPendingRounds();

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for pending offline rounds
  const checkPendingRounds = async () => {
    try {
      const offlineRounds = await getOfflineRounds();
      const pendingCount = offlineRounds.filter(round => round.syncStatus !== 'synced').length;
      setPendingRounds(pendingCount);
    } catch (error) {
      console.error('Error checking offline rounds:', error);
      setHasError(true);
    }
  };

  // Sync offline rounds when back online
  const handleSync = async () => {
    if (!isOnline) {
      setSyncMessage('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);
    setHasError(false);

    try {
      const result = await syncOfflineRounds();
      setSyncMessage(result.message);
      
      if (!result.success) {
        setHasError(true);
      }
      
      // Refresh pending rounds count
      await checkPendingRounds();
    } catch (error) {
      console.error('Error syncing rounds:', error);
      setSyncMessage('Failed to sync rounds');
      setHasError(true);
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't render anything if online and no pending rounds
  if (isOnline && pendingRounds === 0 && !hasError) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`fixed bottom-4 right-4 z-50 ${!isOnline ? 'bg-amber-100 hover:bg-amber-200' : ''} ${hasError ? 'bg-red-100 hover:bg-red-200' : ''}`}
        >
          {!isOnline ? (
            <WifiOff className="h-4 w-4 mr-1 text-amber-600" />
          ) : (
            <Wifi className="h-4 w-4 mr-1 text-green-600" />
          )}
          {pendingRounds > 0 && (
            <Badge variant="secondary" className="ml-1">
              {pendingRounds}
            </Badge>
          )}
          {hasError && <AlertCircle className="h-4 w-4 ml-1 text-red-600" />}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {isOnline ? (
                <>
                  <Wifi className="h-5 w-5 mr-2 text-green-600" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 mr-2 text-amber-600" />
                  Offline Mode
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isOnline
                ? "You're connected to the internet."
                : "You're working offline. Changes will be synced when you reconnect."}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {pendingRounds > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Pending Rounds</h4>
                <p className="text-sm text-muted-foreground">
                  You have {pendingRounds} round{pendingRounds !== 1 ? 's' : ''} waiting to be synced.
                </p>
              </div>
            )}
            
            {syncMessage && (
              <div className={`p-2 rounded text-sm ${hasError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {syncMessage}
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            {pendingRounds > 0 && (
              <Button 
                onClick={handleSync} 
                disabled={!isOnline || isSyncing}
                className="w-full"
              >
                {isSyncing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default OfflineIndicator; 