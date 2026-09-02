/**
 * Run asynchronous work behind a hard deadline and abort its underlying
 * transport at the same instant. Promise.race is intentional: some thenable
 * clients do not settle promptly when their AbortSignal fires.
 */
export async function withAbortDeadline<T>(
  label: string,
  timeoutMs: number,
  operation: (signal: AbortSignal) => T
): Promise<Awaited<T>> {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`${label} exceeded ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      Promise.resolve(operation(controller.signal)),
      deadline,
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
