import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_VEHICLES } from './src/data/sampleVehicles';
import { answerAgentQuestion } from './src/services/aiAgent';
import { JOB_STORE, processVehicleImageJob } from './src/services/imagePipeline';
import { VehicleProcessingReport } from './src/types';

// Configure multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
});

// Seed initial sample jobs into memory store for immediate dashboard preview
function seedInitialJobs() {
  SAMPLE_VEHICLES.forEach((preset, idx) => {
    const report = preset.mockReport;
    const jobId = `proc_preset_${idx + 1}`;
    const initialReport: VehicleProcessingReport = {
      processing_id: jobId,
      filename: `${preset.id}.jpg`,
      upload_time: new Date(Date.now() - (idx + 1) * 3600000).toISOString().replace('T', ' ').slice(0, 19),
      status: 'Completed',
      progress: 100,
      image_url: preset.imageUrl,
      vehicle_type: report.vehicle_type || 'SUV',
      vehicle_category: (report.vehicle_category as any) || 'SUV',
      manufacturer: report.manufacturer || 'Tata Motors',
      model: report.model || 'Nexon EV',
      body_type: report.body_type || 'Compact SUV',
      vehicle_color: report.vehicle_color || 'Pearl White',
      estimated_year: report.estimated_year || '2023',
      number_plate: report.number_plate || 'KA01AB1234',
      plate_valid: report.plate_valid ?? true,
      invalid_reason: report.invalid_reason,
      ocr_confidence: report.ocr_confidence || 98.4,
      state_code: report.state_code || 'KA',
      state_name: report.state_name || 'Karnataka',
      district_code: report.district_code || '01',
      district_name: report.district_name || 'Bengaluru Central',
      image_quality: report.image_quality || 'Excellent',
      blur_score: report.blur_score || 215.8,
      blur_category: report.blur_category || 'Sharp',
      brightness: report.brightness || 'Good',
      contrast: report.contrast || 'Good',
      noise: report.noise || 'Low',
      quality_details: report.quality_details,
      tampered: report.tampered ?? false,
      duplicate: report.duplicate ?? false,
      screenshot: report.screenshot ?? false,
      authenticity_details: report.authenticity_details,
      bounding_boxes: [
        {
          label: `${report.manufacturer} ${report.model}`,
          confidence: 97.5,
          box: [18, 12, 82, 88],
          color: '#3b82f6',
        },
        {
          label: `Plate: ${report.number_plate}`,
          confidence: report.ocr_confidence || 98.4,
          box: [64, 38, 76, 62],
          color: report.tampered ? '#ef4444' : '#10b981',
        },
      ],
      metadata: report.metadata || {
        camera: 'Sony Alpha 7 IV',
        device: 'ILCE-7M4',
        gps: '12.9716° N, 77.5946° E',
        capture_time: new Date().toISOString(),
      },
      confidence_scores: {
        vehicle_detection: 97.8,
        ocr: report.ocr_confidence || 98.4,
        blur: 96.5,
        brightness: 95.0,
        tampering: 96.0,
        screenshot: 94.0,
        overall_quality: 96.0,
      },
      overall_confidence: report.overall_confidence || 97.8,
      ai_summary: report.ai_summary || 'Analysis complete.',
      ai_suitability: report.ai_suitability || 'Approved for Verification',
    };

    JOB_STORE.set(jobId, initialReport);
  });
}

seedInitialJobs();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Route: POST /upload or /api/upload
  const handleUpload = async (req: Request, res: Response) => {
    try {
      let imageBuffer: Buffer | null = null;
      let filename = 'uploaded_vehicle.jpg';
      let presetKey: string | undefined = undefined;

      if (req.file) {
        imageBuffer = req.file.buffer;
        filename = req.file.originalname;
      } else if (req.body?.presetKey) {
        presetKey = req.body.presetKey;
        filename = `${presetKey}.jpg`;
      } else if (req.body?.image) {
        const base64Str = req.body.image as string;
        filename = req.body.filename || 'uploaded_vehicle.jpg';
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches[2]) {
          imageBuffer = Buffer.from(matches[2], 'base64');
        } else {
          imageBuffer = Buffer.from(base64Str, 'base64');
        }
      }

      const jobId = `proc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

      // Create initial pending record
      const initialJobRecord: VehicleProcessingReport = {
        processing_id: jobId,
        filename,
        upload_time: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'Pending',
        progress: 0,
        vehicle_type: 'Analyzing...',
        vehicle_category: 'Car',
        manufacturer: 'Processing',
        model: 'Processing',
        vehicle_color: 'Analyzing',
        estimated_year: '2023',
        number_plate: 'Detecting...',
        plate_valid: false,
        ocr_confidence: 0,
        image_quality: 'Good',
        blur_score: 0,
        brightness: 'Good',
        contrast: 'Good',
        noise: 'Low',
        tampered: false,
        duplicate: false,
        screenshot: false,
        metadata: {
          camera: 'Extracting...',
          device: 'Processing',
          gps: 'Reading GPS',
          capture_time: new Date().toISOString(),
        },
        overall_confidence: 0,
        ai_summary: 'Image queued for Computer Vision & Gemini Agent processing...',
      };

      JOB_STORE.set(jobId, initialJobRecord);

      // Trigger background processing asynchronously without blocking response
      processVehicleImageJob(jobId, imageBuffer, filename, presetKey);

      return res.status(200).json({
        processing_id: jobId,
        status: 'Pending',
        message: 'Image queued successfully for asynchronous processing.',
      });
    } catch (err) {
      console.error('Error in /upload handler:', err);
      return res.status(500).json({
        error: 'Failed to initiate processing task.',
        details: err instanceof Error ? err.message : String(err),
      });
    }
  };

  app.post('/upload', upload.single('image'), handleUpload);
  app.post('/api/upload', upload.single('image'), handleUpload);

  // API Route: GET /status/:processing_id or /api/status/:processing_id
  const handleStatus = (req: Request, res: Response) => {
    const jobId = req.params.processing_id;
    const job = JOB_STORE.get(jobId);

    if (!job) {
      return res.status(404).json({
        error: `Processing ID '${jobId}' not found.`,
      });
    }

    return res.status(200).json({
      processing_id: jobId,
      status: job.status,
      progress: job.progress,
      pipeline_steps: job.pipeline_steps || [],
      filename: job.filename,
      upload_time: job.upload_time,
    });
  };

  app.get('/status/:processing_id', handleStatus);
  app.get('/api/status/:processing_id', handleStatus);

  // API Route: GET /results/:processing_id or /api/results/:processing_id
  const handleResults = (req: Request, res: Response) => {
    const jobId = req.params.processing_id;
    const job = JOB_STORE.get(jobId);

    if (!job) {
      return res.status(404).json({
        error: `Processing ID '${jobId}' not found.`,
      });
    }

    return res.status(200).json(job);
  };

  app.get('/results/:processing_id', handleResults);
  app.get('/api/results/:processing_id', handleResults);

  // API Route: GET /api/jobs - List all recent jobs
  app.get('/api/jobs', (_req: Request, res: Response) => {
    const jobsList = Array.from(JOB_STORE.values()).sort(
      (a, b) => new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
    );
    return res.status(200).json(jobsList);
  });

  // API Route: POST /api/ask-agent - AI Agent follow-up chat endpoint
  app.post('/api/ask-agent', async (req: Request, res: Response) => {
    const { processing_id, question } = req.body;
    if (!processing_id || !question) {
      return res.status(400).json({ error: 'Missing processing_id or question.' });
    }

    const job = JOB_STORE.get(processing_id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    try {
      const answer = await answerAgentQuestion(job, question);
      return res.status(200).json({ answer });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to generate answer from AI Agent.' });
    }
  });

  // Vite Middleware integration for dev mode vs static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Vehicle Processing Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
