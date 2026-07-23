import { JOB_STORE } from '../src/services/jobStore.ts';
import { applyCors, sendApiError } from './_utils';

export default function handler(_req: any, res: any) {
  if (applyCors(_req, res)) {
    return;
  }

  if (_req.method && _req.method !== 'GET') {
    sendApiError(res, 405, 'METHOD', 'Method not allowed.', 'Use GET for /api/jobs requests.');
    return;
  }

  const jobs = Array.from(JOB_STORE.values()).sort(
    (a, b) => new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
  );
  res.status(200).json(jobs);
}