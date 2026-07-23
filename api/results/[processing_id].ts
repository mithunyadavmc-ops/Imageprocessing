import { JOB_STORE } from '../../src/services/imagePipeline';
import { applyCors } from '../_utils';

export default function handler(req: any, res: any) {
  if (applyCors(req, res)) {
    return;
  }

  const jobId = req.query?.processing_id;
  const job = JOB_STORE.get(jobId);

  if (!job) {
    res.status(404).json({
      error: `Processing ID '${jobId}' not found. In serverless deployments, /api/upload returns the completed report directly.`,
    });
    return;
  }

  res.status(200).json(job);
}