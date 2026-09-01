import React, { useState } from 'react';
import { useOffline } from '../../context/OfflineContext';
import { WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingCount, syncAll } = useOffline();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncAll();
      setSyncStatus(`Successfully synced ${res.success} session(s)!`);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (e) {
      setSyncStatus('Sync failed. Will retry automatically.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && pendingCount === 0 && !syncStatus) {
    return null;
  }

  return (
    <div className="w-full bg-amber-500 text-white px-4 py-2 text-xs sm:text-sm font-medium shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 text-white animate-pulse" />
              <span>
                <strong>Offline</strong> — Counselling records are saved locally on your device.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>
                <strong>Online</strong> — {pendingCount} session(s) waiting for sync.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {syncStatus ? (
            <span className="bg-white/20 px-2.5 py-1 rounded text-xs">
              {syncStatus}
            </span>
          ) : isOnline && pendingCount > 0 ? (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-1 bg-white text-amber-900 px-3 py-1 rounded font-bold hover:bg-amber-100 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : `Sync Now (${pendingCount})`}
            </button>
          ) : (
            <span className="text-xs bg-amber-600/60 px-2 py-0.5 rounded">
              {pendingCount} item(s) pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

