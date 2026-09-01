import React from 'react';
import { AlertCircle, Inbox, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '../ui/Button';

interface ApiStateProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  loadingMessage?: string;
}

export const ApiState: React.FC<ApiStateProps> = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No data available yet.',
  onRetry,
  children,
  loadingMessage = 'Loading...',
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
        <p className="text-sm font-medium">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    const isConnectionError = error.toLowerCase().includes('unable to connect');
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
          {isConnectionError ? (
            <WifiOff className="w-6 h-6 text-rose-500" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-500" />
          )}
        </div>
        <div className="space-y-1 max-w-sm">
          <p className="text-sm font-semibold text-slate-800">
            {isConnectionError ? 'Unable to connect' : 'Something went wrong'}
          </p>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Inbox className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};
