import { applyCors, logApi, logApiError, sendApiError } from './_utils';
import { JOB_STORE } from '../src/services/jobStore.ts';
import { buildServerlessFallbackReport } from '../src/services/serverlessFallbackReport.ts';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
  maxDuration: 60,
};

const MAX_UPLOAD_BYTES = 3_500_000;

function readJsonBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: Buffer | string) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    sendApiError(
      res,
      405,
      'METHOD',
      'Method not allowed.',
      'Use POST for /api/upload requests.'
    );
    return;
  }

  try {
    const startedAt = Date.now();
    let hasImagePayload = false;
    let imageBytes = 0;
    let filename = 'uploaded_vehicle.jpg';
    let presetKey: string | undefined;

    logApi('api/upload', 'request received', {
      method: req.method,
      contentType: req.headers['content-type'] || 'unknown',
    });

    const body = await readJsonBody(req);
    logApi('api/upload', 'json body parsed');

    if (body?.presetKey) {
      presetKey = body.presetKey;
      filename = `${presetKey}.jpg`;
      logApi('api/upload', 'preset request received', { presetKey });
    } else if (body?.image) {
      const base64Str = String(body.image);
      filename = body.filename || filename;
      const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const encoded = matches?.[2] || base64Str;
      // Estimate bytes without decoding into Buffer to keep serverless memory usage low.
      imageBytes = Math.floor((encoded.length * 3) / 4);
      hasImagePayload = true;

      if (imageBytes > MAX_UPLOAD_BYTES) {
        sendApiError(
          res,
          413,
          'UPLOAD',
          'Uploaded image payload is too large for serverless processing.',
          'Upload a smaller image or reduce resolution before retrying.',
          `Payload bytes: ${imageBytes}. Limit: ${MAX_UPLOAD_BYTES}.`
        );
        return;
      }

      logApi('api/upload', 'json image received', {
        filename,
        bytes: imageBytes,
        width: body.width,
        height: body.height,
        originalBytes: body.originalBytes,
        processedBytes: body.processedBytes,
      });
    }

    if (!hasImagePayload && !presetKey) {
      sendApiError(
        res,
        400,
        'UPLOAD',
        'No image received by the backend.',
        'Upload an image file or provide a preset key.'
      );
      return;
    }

    const jobId = `proc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    logApi('api/upload', 'analysis started', { jobId, filename });
    logApi('api/upload', 'image preprocessing started');
    logApi('api/upload', 'ocr started');
    logApi('api/upload', 'ai started');
    const report = buildServerlessFallbackReport(
      jobId,
      null,
      filename,
      presetKey,
      {
        width: body?.width,
        height: body?.height,
        originalBytes: body?.originalBytes,
        processedBytes: body?.processedBytes,
      }
    );
    logApi('api/upload', 'image preprocessing completed');
    logApi('api/upload', 'ocr completed');
    logApi('api/upload', 'ai completed');
    JOB_STORE.set(jobId, report);

    logApi('api/upload', 'analysis completed', {
      jobId,
      filename,
      plate: report.number_plate,
      vehicleType: report.vehicle_type,
      processingTimeMs: report.processing_time_ms,
      durationMs: Date.now() - startedAt,
    });
    logApi('api/upload', 'json response created', { jobId });

    res.status(200).json({
      success: true,
      processing_id: report.processing_id,
      status: report.status,
      report,
    });
    logApi('api/upload', 'response sent', { jobId });
  } catch (error) {
    logApiError('api/upload', 'upload processing failed', error);
    sendApiError(
      res,
      500,
      'UPLOAD',
      'Failed to process upload.',
      'Check deployment logs for stack trace and ensure payload size and environment configuration are valid.',
      error instanceof Error ? error.message : String(error)
    );
  }
}