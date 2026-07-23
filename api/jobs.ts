import { JOB_STORE } from '../src/services/imagePipeline';

export default function handler(_req: any, res: any) {
  const jobs = Array.from(JOB_STORE.values()).sort(
    (a, b) => new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
  );
  res.status(200).json(jobs);
}