export interface Callbacks<Res> {
  onSuccess?: (res: Res) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

/**
 * Выполняет любой Promise-запрос и пробрасывает колбэки.
 */
export async function executeWithCallbacks<Res>(
  promise: Promise<Res>,
  callbacks: Callbacks<Res> = {}
) {
  const { onSuccess, onError, onFinally } = callbacks;
  try {
    const res = await promise;
    onSuccess?.(res);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    onError?.(error);
  } finally {
    onFinally?.();
  }
}
