import { env } from '../config/env';

const trimLeadingSlash = (value: string): string => value.replace(/^\/+/, '');
const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');
const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//i.test(value);

export const swapiBaseUrl = env.apiBaseUrl;
export const directSwapiBaseUrl = 'https://swapi.dev/api';

export const buildSwapiUrl = (path: string): string => {
  const normalizedPath = trimLeadingSlash(path);

  if (swapiBaseUrl.startsWith('http://') || swapiBaseUrl.startsWith('https://')) {
    return new URL(normalizedPath, `${trimTrailingSlash(swapiBaseUrl)}/`).toString();
  }

  return `${trimTrailingSlash(swapiBaseUrl)}/${normalizedPath}`;
};

export const buildDirectSwapiUrl = (path: string): string => {
  const normalizedPath = trimLeadingSlash(path);

  return new URL(normalizedPath, `${directSwapiBaseUrl}/`).toString();
};

export const buildSwapiUrlCandidates = (path: string): string[] => {
  const primaryUrl = buildSwapiUrl(path);
  const fallbackUrl = buildDirectSwapiUrl(path);

  return primaryUrl === fallbackUrl ? [primaryUrl] : [primaryUrl, fallbackUrl];
};

export const buildSwapiRequestCandidates = (value: string): string[] => {
  if (isAbsoluteUrl(value)) {
    const parsedUrl = new URL(value);

    if (parsedUrl.hostname === 'swapi.dev') {
      const proxyUrl = `${parsedUrl.pathname}${parsedUrl.search}`;

      return proxyUrl === value ? [proxyUrl] : [proxyUrl, value];
    }

    return [value];
  }

  return buildSwapiUrlCandidates(value);
};

export const buildPeopleUrl = (page: number): string => {
  const baseUrl = buildSwapiUrl('/people/');

  if (page <= 1) {
    return baseUrl;
  }

  const queryDelimiter = baseUrl.includes('?') ? '&' : '?';

  return `${baseUrl}${queryDelimiter}page=${page}`;
};
