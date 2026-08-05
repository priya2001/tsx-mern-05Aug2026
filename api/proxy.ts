import type { IncomingMessage, ServerResponse } from 'node:http';

const SWAPI_ORIGIN = 'https://swapi.dev';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

interface ApiRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
}

const getProxyPath = (request: ApiRequest): string => {
  const rawPath = request.query.path;
  const pathValue = Array.isArray(rawPath) ? rawPath[0] : rawPath;
  const trimmedPath = (pathValue ?? '').trim().replace(/^\/+/, '');

  return trimmedPath.length > 0 ? trimmedPath : '';
};

const getTargetUrl = (request: ApiRequest): URL => {
  const targetPath = getProxyPath(request);
  const baseUrl = new URL(`api/${targetPath}`, `${SWAPI_ORIGIN}/`);

  for (const [key, value] of Object.entries(request.query)) {
    if (key === 'path') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined) {
          baseUrl.searchParams.append(key, item);
        }
      }
      continue;
    }

    if (value !== undefined) {
      baseUrl.searchParams.set(key, value);
    }
  }

  return baseUrl;
};

const sendJsonError = (response: ServerResponse, statusCode: number, message: string): void => {
  response.writeHead(statusCode, {
    ...corsHeaders,
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify({ message }));
};

export default async function handler(
  request: ApiRequest,
  response: ServerResponse,
): Promise<void> {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJsonError(response, 405, 'Method not allowed.');
    return;
  }

  const targetUrl = getTargetUrl(request);

  try {
    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        Accept: request.headers.accept ?? 'application/json',
      },
      method: request.method,
    });

    const body = request.method === 'HEAD' ? null : await upstreamResponse.arrayBuffer();

    response.writeHead(upstreamResponse.status, {
      ...corsHeaders,
      'Content-Type': upstreamResponse.headers.get('content-type') ?? 'application/json; charset=utf-8',
    });
    response.end(body ? Buffer.from(body) : undefined);
  } catch {
    sendJsonError(response, 502, 'Unable to reach the SWAPI upstream service.');
  }
}
