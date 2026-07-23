import { answerAgentQuestion } from '../src/services/aiAgent';
import { JOB_STORE } from '../src/services/jobStore.ts';
import { applyCors, logApi, logApiError, sendApiError } from './_utils';

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    sendApiError(res, 405, 'METHOD', 'Method not allowed.', 'Use POST for /api/ask-agent requests.');
    return;
  }

  const { processing_id, question, report } = req.body || {};
  logApi('api/ask-agent', 'request received', {
    processingId: processing_id,
    hasReportPayload: Boolean(report),
  });
  if (!question) {
    sendApiError(res, 400, 'INPUT', 'Missing question.', 'Provide a non-empty question in the request body.');
    return;
  }

  const job = (processing_id ? JOB_STORE.get(processing_id) : undefined) || report;
  if (!job) {
    sendApiError(
      res,
      404,
      'LOOKUP',
      'Job not found.',
      'Provide a valid processing_id or include a report payload in the request body.'
    );
    return;
  }

  try {
    const answer = await answerAgentQuestion(job, question);
    logApi('api/ask-agent', 'response generated', { processingId: processing_id });
    res.status(200).json({ success: true, answer });
  } catch (error) {
    logApiError('api/ask-agent', 'response generation failed', error, { processingId: processing_id });
    sendApiError(
      res,
      500,
      'AI',
      'Failed to generate answer from AI Agent.',
      'Verify GEMINI_API_KEY, model availability, and request timeout limits.',
      error instanceof Error ? error.message : String(error)
    );
  }
}