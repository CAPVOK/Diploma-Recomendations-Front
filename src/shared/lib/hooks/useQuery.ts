import { useState, useEffect, useCallback } from "react";

type QueryOptions = {
  enabled?: boolean; // запускать автоматический запрос
};

export function useQuery<Res, Req>(
  queryFn: (arg: Req) => Promise<Res>,
  arg: Req,
  options: QueryOptions | undefined = {}
) {
  const { enabled = true } = options;
  const [data, setData] = useState<Res | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn(arg);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [queryFn, arg]);

  // автоматически вызываем при изменении arg, если enabled
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  return { data, error, isLoading, refetch: fetchData };
}
