'use client';

import { useEffect } from 'react';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

const PATCH_MARKER = Symbol.for('petpark.csrfFetchPatched');
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length) || null;
}

function resolveRequestUrl(input: RequestInfo | URL) {
  if (typeof input === 'string' || input instanceof URL) return new URL(input, window.location.origin);
  return new URL(input.url, window.location.origin);
}

function resolveMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase();
  if (typeof input === 'object' && 'method' in input && input.method) return input.method.toUpperCase();
  return 'GET';
}

export function CsrfFetchGuard() {
  useEffect(() => {
    const globalWithMarker = window as typeof window & { [PATCH_MARKER]?: boolean };
    if (globalWithMarker[PATCH_MARKER]) return;

    const nativeFetch = window.fetch.bind(window);

    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const method = resolveMethod(input, init);
      if (!MUTATING_METHODS.has(method)) return nativeFetch(input, init);

      const url = resolveRequestUrl(input);
      if (url.origin !== window.location.origin) return nativeFetch(input, init);

      const token = readCookie(CSRF_COOKIE_NAME);
      if (!token) return nativeFetch(input, init);

      const headers = new Headers(init?.headers || (typeof input === 'object' && 'headers' in input ? input.headers : undefined));
      if (!headers.has(CSRF_HEADER_NAME)) headers.set(CSRF_HEADER_NAME, token);

      return nativeFetch(input, { ...init, headers });
    };

    globalWithMarker[PATCH_MARKER] = true;
  }, []);

  return null;
}
