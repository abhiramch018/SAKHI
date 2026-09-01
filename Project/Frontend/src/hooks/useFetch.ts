import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '../lib/api';

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Hook for fetching data from the backend with loading, error, and retry states.
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setData(null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, retry: load };
}
