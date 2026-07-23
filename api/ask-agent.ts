import { answerAgentQuestion } from '../src/services/aiAgent';
import { JOB_STORE } from '../src/services/imagePipeline';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const { processing_id, question, report } = req.body || {};
  if (!question) {
    res.status(400).json({ error: 'Missing question.' });
    return;
  }

  const job = (processing_id ? JOB_STORE.get(processing_id) : undefined) || report;
  if (!job) {
    res.status(404).json({ error: 'Job not found.' });
    return;
  }

  try {
    const answer = await answerAgentQuestion(job, question);
    res.status(200).json({ answer });
  } catch {
    res.status(500).json({ error: 'Failed to generate answer from AI Agent.' });
  }
}