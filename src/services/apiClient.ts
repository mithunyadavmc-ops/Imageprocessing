export interface ApiFailure {
  ok: false;
  status: number;
  error: string;
  details?: string;
  payload?: unknown;
}

export interface ApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const isPlaceholderApiBaseUrl = /your-render-backend-domain|<your-render-backend-domain>/i.test(rawApiBaseUrl);
const API_BASE_URL = (isPlaceholderApiBaseUrl ? '' : rawApiBaseUrl).replace(/\/$/, '');

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export async function apiFetchJson<T>(
  path: string,
  init: RequestInit,
  label: string
): Promise<ApiResult<T>> {
  const url = buildApiUrl(path);
  console.info(`[frontend] ${label}: request started`, {
    url,
    method: init.method || 'GET',
  });

  try {
    const response = await fetch(url, init);
    const rawText = await response.text();
    let payload: unknown = undefined;

    if (rawText) {
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = rawText;
      }
    }

    if (!response.ok) {
      const errorMessage =
        typeof payload === 'object' && payload && 'error' in payload
          ? String((payload as { error: unknown }).error)
          : `Request failed with status ${response.status}`;
      const details =
        typeof payload === 'object' && payload && 'details' in payload
          ? String((payload as { details: unknown }).details)
          : typeof payload === 'string'
          ? payload.slice(0, 300)
          : undefined;

      console.error(`[frontend] ${label}: request failed`, {
        url,
        status: response.status,
        errorMessage,
        details,
      });

      return {
        ok: false,
        status: response.status,
        error: errorMessage,
        details,
        payload,
      };
    }

    console.info(`[frontend] ${label}: request completed`, {
      url,
      status: response.status,
    });

    return {
      ok: true,
      status: response.status,
      data: (payload ?? {}) as T,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[frontend] ${label}: network error`, {
      url,
      message,
    });

    return {
      ok: false,
      status: 0,
      error: 'Network request failed.',
      details: message,
    };
  }
}

export function getApiErrorMessage(result: ApiResult<unknown>): string {
  if (result.ok) {
    return 'Unknown API error.';
  }

  const failure = result as ApiFailure;
  const payload = failure.payload;
  const step =
    typeof payload === 'object' && payload && 'step' in payload
      ? String((payload as { step: unknown }).step)
      : undefined;
  const solution =
    typeof payload === 'object' && payload && 'solution' in payload
      ? String((payload as { solution: unknown }).solution)
      : undefined;

  const parts = [failure.error, failure.details, step ? `Step: ${step}` : '', solution ? `Solution: ${solution}` : '']
    .filter(Boolean)
    .map((item) => String(item).trim());

  return parts.join(' ');
}