export function getAllowedOrigin(req: any): string {
  const configured = process.env.CORS_ORIGIN || process.env.ALLOWED_ORIGIN;
  if (configured) {
    return configured;
  }

  return req.headers.origin || '*';
}

export function applyCors(req: any, res: any): boolean {
  const origin = getAllowedOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}

export function logApi(scope: string, message: string, details?: Record<string, unknown>) {
  if (details) {
    console.info(`[${scope}] ${message}`, details);
    return;
  }

  console.info(`[${scope}] ${message}`);
}

export function logApiError(scope: string, message: string, error: unknown, details?: Record<string, unknown>) {
  console.error(`[${scope}] ${message}`, {
    ...(details || {}),
    error: error instanceof Error ? error.message : String(error),
  });
}