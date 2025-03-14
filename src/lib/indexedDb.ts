/**
 * IndexedDB utility for offline data storage in Golf Guru Zone
 */

// Database configuration
const DB_NAME = 'GolfGuruOfflineDB';
const DB_VERSION = 1;
const ROUND_STORE = 'offlineRounds';

/**
 * Opens IndexedDB connection
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Browser does not support IndexedDB'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(ROUND_STORE)) {
        const store = db.createObjectStore(ROUND_STORE, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('syncStatus', 'syncStatus', { unique: false });
      }
    };
  });
};

/**
 * Save a round to IndexedDB for offline storage
 */
export const saveOfflineRound = async (round: any): Promise<string> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      // Add a unique ID and sync status
      const offlineRound = {
        ...round,
        id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        syncStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      const transaction = db.transaction([ROUND_STORE], 'readwrite');
      const store = transaction.objectStore(ROUND_STORE);
      const request = store.add(offlineRound);

      request.onsuccess = () => {
        resolve(offlineRound.id);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error saving offline round:', error);
    throw error;
  }
};

/**
 * Get all offline rounds stored in IndexedDB
 */
export const getOfflineRounds = async (): Promise<any[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ROUND_STORE], 'readonly');
      const store = transaction.objectStore(ROUND_STORE);
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error getting offline rounds:', error);
    return [];
  }
};

/**
 * Delete a round from IndexedDB
 */
export const deleteOfflineRound = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ROUND_STORE], 'readwrite');
      const store = transaction.objectStore(ROUND_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error deleting offline round:', error);
    throw error;
  }
};

/**
 * Update a round's sync status in IndexedDB
 */
export const updateRoundSyncStatus = async (id: string, status: 'pending' | 'synced' | 'failed'): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ROUND_STORE], 'readwrite');
      const store = transaction.objectStore(ROUND_STORE);
      const getRoundRequest = store.get(id);

      getRoundRequest.onsuccess = (event) => {
        const round = (event.target as IDBRequest).result;
        if (round) {
          round.syncStatus = status;
          round.updatedAt = new Date().toISOString();
          
          const updateRequest = store.put(round);
          updateRequest.onsuccess = () => {
            resolve();
          };
          
          updateRequest.onerror = (event) => {
            reject((event.target as IDBRequest).error);
          };
        } else {
          reject(new Error(`Round with ID ${id} not found`));
        }
      };

      getRoundRequest.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error updating round sync status:', error);
    throw error;
  }
};

// Extend ServiceWorkerRegistration interface to include sync
declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    }
  }
  
  interface Window {
    SyncManager: any;
  }
}

/**
 * Register for background sync
 */
export const registerBackgroundSync = async (): Promise<void> => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('offline-rounds-sync');
      console.log('Background sync registered!');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  } else {
    console.log('Background sync is not supported by your browser');
  }
};

/**
 * Manually trigger sync for offline rounds
 */
export const syncOfflineRounds = async (): Promise<{ success: boolean, message: string }> => {
  try {
    const offlineRounds = await getOfflineRounds();
    let syncedCount = 0;
    
    // Only attempt to sync if we have offline rounds
    if (offlineRounds.length === 0) {
      return { success: true, message: 'No offline rounds to sync' };
    }
    
    // Try to sync each round
    for (const round of offlineRounds) {
      try {
        // Skip already synced rounds
        if (round.syncStatus === 'synced') continue;
        
        const response = await fetch('/api/rounds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(round)
        });
        
        if (response.ok) {
          await updateRoundSyncStatus(round.id, 'synced');
          syncedCount++;
        } else {
          await updateRoundSyncStatus(round.id, 'failed');
        }
      } catch (error) {
        await updateRoundSyncStatus(round.id, 'failed');
      }
    }
    
    return {
      success: true,
      message: `Synced ${syncedCount} of ${offlineRounds.length} offline rounds`
    };
  } catch (error) {
    console.error('Error syncing offline rounds:', error);
    return {
      success: false,
      message: 'Failed to sync offline rounds'
    };
  }
}; 