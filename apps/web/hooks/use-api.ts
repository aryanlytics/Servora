"use client";

import { useState, useCallback } from "react";

export function useApi<T, Args extends any[]>(
  apiFunc: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: any) {
        const errMsg = err instanceof Error ? err.message : "Something went wrong";
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    error,
    isLoading,
    execute,
  };
}
