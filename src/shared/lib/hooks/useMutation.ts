import { useState, useCallback } from "react";

type MutationOptions<Res> = {
  onSuccess?: (data: Res) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
};

export function useMutation<Res, Req>(
  mutationFn: (arg: Req) => Promise<Res>,
  options: MutationOptions<Res> = {}
): [
  (arg: Req) => Promise<Res>,
  { data: Res | null; error: Error | null; isLoading: boolean }
] {
  const { onSuccess, onError, onFinally } = options;
  const [data, setData] = useState<Res | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const mutate = useCallback(
    async (arg: Req) => {
      setLoading(true);
      setError(null);
      try {
        const result = await mutationFn(arg);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        onError?.(errorObj);
        throw errorObj;
      } finally {
        setLoading(false);
        onFinally?.();
      }
    },
    [mutationFn, onSuccess, onError, onFinally]
  );

  return [mutate, { data, error, isLoading }];
}
