import type { IncomingMessage, ServerResponse } from 'node:http';

const SWAPI_BASE_URL = 'https://swapi.dev/api';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

const getRequestPath = (request: IncomingMessage): string => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const apiPath = requestUrl.pathname.startsWith('/api')
    ? requestUrl.pathname.slice('/api'.length)
    : requestUrl.pathname;
  const normalizedPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;

  return `${normalizedPath}${requestUrl.search}`;
};

const sendJsonError = (response: ServerResponse, statusCode: number, message: string): void => {
  response.writeHead(statusCode, {
    ...corsHeaders,
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify({ message }));
};

export default async function handler(
  request: IncomingMessage,
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

  const targetUrl = new URL(getRequestPath(request), `${SWAPI_BASE_URL}/`);

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

