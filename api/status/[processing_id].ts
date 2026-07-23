import { JOB_STORE } from '../../src/services/jobStore.ts';
import { applyCors, sendApiError } from '../_utils';

export default function handler(req: any, res: any) {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method && req.method !== 'GET') {
    sendApiError(res, 405, 'METHOD', 'Method not allowed.', 'Use GET for /api/status/:processing_id requests.');
    return;
  }

  const jobId = req.query?.processing_id;
  const job = JOB_STORE.get(jobId);

  if (!job) {
    sendApiError(
      res,
      404,
      'LOOKUP',
      `Processing ID '${jobId}' not found.`,
      'In serverless deployments, use the report returned directly by /api/upload.'
    );
    return;
  }

  res.status(200).json({
    processing_id: job.processing_id,
    status: job.status,
    progress: job.progress,
    pipeline_steps: job.pipeline_steps || [],
    filename: job.filename,
    upload_time: job.upload_time,
  });
}