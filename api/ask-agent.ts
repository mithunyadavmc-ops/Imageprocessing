import { answerAgentQuestion } from '../src/services/aiAgent';
import { JOB_STORE } from '../src/services/imagePipeline';
import { applyCors, logApi, logApiError } from './_utils';

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const { processing_id, question, report } = req.body || {};
  logApi('api/ask-agent', 'request received', {
    processingId: processing_id,
    hasReportPayload: Boolean(report),
  });
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
    logApi('api/ask-agent', 'response generated', { processingId: processing_id });
    res.status(200).json({ answer });
  } catch (error) {
    logApiError('api/ask-agent', 'response generation failed', error, { processingId: processing_id });
    res.status(500).json({ error: 'Failed to generate answer from AI Agent.' });
  }
}