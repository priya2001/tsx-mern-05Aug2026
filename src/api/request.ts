const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(typeof value === 'string' ? value : 'Unknown API error.');

const delay = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const fetchValidatedJsonFromCandidates = async <T>(
  candidates: string[],
  isValue: (value: unknown) => value is T,
  errorMessage: string,
): Promise<T> => {
  let lastError: Error | null = null;

  for (const url of candidates) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`${errorMessage} Server responded with ${response.status}.`);
        }

        const data: unknown = await response.json();

        if (!isValue(data)) {
          throw new Error(errorMessage);
        }

        return data;
      } catch (error: unknown) {
        lastError = toError(error);

        if (attempt === 0) {
          await delay(120);
        }
      }
    }
  }

  throw lastError ?? new Error(errorMessage);
};
