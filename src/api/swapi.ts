import { env } from '../config/env';

const trimLeadingSlash = (value: string): string => value.replace(/^\/+/, '');

export const swapiBaseUrl = env.apiBaseUrl;

export const buildSwapiUrl = (path: string): string => {
  const normalizedPath = trimLeadingSlash(path);

  return new URL(normalizedPath, `${swapiBaseUrl}/`).toString();
};

export const buildPeopleUrl = (page: number): string => {
  const url = new URL(buildSwapiUrl('/people/'));

  if (page > 1) {
    url.searchParams.set('page', String(page));
  }

  return url.toString();
};
