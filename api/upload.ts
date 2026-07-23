import multer from 'multer';
import { applyCors, logApi, logApiError } from './_utils';
import { buildVehicleProcessingReport, JOB_STORE } from '../src/services/imagePipeline';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
  maxDuration: 60,
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

function runUpload(req: any, res: any): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: unknown) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

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
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const startedAt = Date.now();
    let imageBuffer: Buffer | null = null;
    let filename = 'uploaded_vehicle.jpg';
    let presetKey: string | undefined;

    logApi('api/upload', 'request received', {
      method: req.method,
      contentType: req.headers['content-type'] || 'unknown',
    });

    const contentType = String(req.headers['content-type'] || '');
    if (contentType.includes('multipart/form-data')) {
      await runUpload(req, res);
      if (req.file) {
        imageBuffer = req.file.buffer;
        filename = req.file.originalname;
        logApi('api/upload', 'multipart image received', {
          filename,
          bytes: imageBuffer.length,
        });
      }
    } else {
      const body = await readJsonBody(req);
      if (body?.presetKey) {
        presetKey = body.presetKey;
        filename = `${presetKey}.jpg`;
        logApi('api/upload', 'preset request received', { presetKey });
      } else if (body?.image) {
        const base64Str = String(body.image);
        filename = body.filename || filename;
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        imageBuffer = Buffer.from(matches?.[2] || base64Str, 'base64');
        logApi('api/upload', 'json image received', {
          filename,
          bytes: imageBuffer.length,
          width: body.width,
          height: body.height,
          originalBytes: body.originalBytes,
          processedBytes: body.processedBytes,
        });
      }
    }

    if (!imageBuffer && !presetKey) {
      res.status(400).json({
        error: 'No image received by the backend.',
        details: 'Upload an image file or provide a preset key.',
      });
      return;
    }

    const jobId = `proc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    logApi('api/upload', 'analysis started', { jobId, filename });
    const report = await buildVehicleProcessingReport(jobId, imageBuffer, filename, presetKey);
    JOB_STORE.set(jobId, report);

    logApi('api/upload', 'analysis completed', {
      jobId,
      filename,
      plate: report.number_plate,
      vehicleType: report.vehicle_type,
      processingTimeMs: report.processing_time_ms,
      durationMs: Date.now() - startedAt,
    });

    res.status(200).json({
      processing_id: report.processing_id,
      status: report.status,
      report,
    });
  } catch (error) {
    logApiError('api/upload', 'upload processing failed', error);
    res.status(500).json({
      error: 'Failed to process upload.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}