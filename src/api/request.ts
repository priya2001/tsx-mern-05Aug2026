const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(typeof value === 'string' ? value : 'Unknown API error.');

export const fetchValidatedJsonFromCandidates = async <T>(
  candidates: string[],
  isValue: (value: unknown) => value is T,
  errorMessage: string,
): Promise<T> => {
  let lastError: Error | null = null;

  for (const url of candidates) {
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
    }
  }

  throw lastError ?? new Error(errorMessage);
};
