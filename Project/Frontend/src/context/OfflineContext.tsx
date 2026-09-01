import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { offlineQueue, PendingCounselling } from '../lib/offline';
import { counsellingApi, decisionTreeApi, reportApi } from '../lib/api';
import { useAuth } from './AuthContext';

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  pendingItems: PendingCounselling[];
  queueSubmission: (item: Omit<PendingCounselling, 'id' | 'timestamp'>) => void;
  syncAll: () => Promise<{ success: number; failed: number }>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingItems, setPendingItems] = useState<PendingCounselling[]>([]);

  const refreshQueue = () => {
    setPendingItems(offlineQueue.getQueue());
  };

  const syncAll = useCallback(async (): Promise<{ success: number; failed: number }> => {
    if (!user?.id) return { success: 0, failed: 0 };

    const queue = offlineQueue.getQueue();
    if (queue.length === 0) return { success: 0, failed: 0 };

    let success = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        const session = await counsellingApi.create({
          beneficiary: item.beneficiaryId,
          aww: user.id,
          tier: item.tier,
          answers: item.answers,
        });

        const evaluation = await decisionTreeApi.evaluate(item.tier, item.answers);
        await counsellingApi.markAttendance(session._id);

        await reportApi.create({
          counselling: session._id,
          beneficiary: item.beneficiaryId,
          aww: user.id,
          riskLevel: evaluation.riskLevel,
          actions: evaluation.actions,
          aiGuidance: `Offline synced session for ${item.beneficiaryName}. Evaluated as ${evaluation.riskLevel} risk.`,
        });

        offlineQueue.dequeue(item.id);
        success++;
      } catch (err) {
        console.error('Failed to sync offline item:', item, err);
        failed++;
      }
    }

    refreshQueue();
    return { success, failed };
  }, [user?.id]);

  useEffect(() => {
    refreshQueue();

    const handleOnline = () => {
      setIsOnline(true);
      syncAll();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncAll]);

  const queueSubmission = (item: Omit<PendingCounselling, 'id' | 'timestamp'>) => {
    const fullItem: PendingCounselling = {
      ...item,
      id: 'pending_' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    offlineQueue.enqueue(fullItem);
    refreshQueue();
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingCount: pendingItems.length,
        pendingItems,
        queueSubmission,
        syncAll,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
