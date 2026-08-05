export async function mapWithConcurrency<T, U>(
  items: readonly T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  if (limit < 1) {
    throw new Error('Concurrency limit must be at least 1.');
  }

  const results: U[] = new Array(items.length);
  let nextIndex = 0;

  const worker = async (): Promise<void> => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex] as T, currentIndex);
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());

  await Promise.all(workers);

  return results;
}
