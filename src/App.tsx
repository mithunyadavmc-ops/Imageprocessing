import React, { useCallback, useEffect, useState } from 'react';
import {
  Download,
  FileJson,
  FileText,
  Sparkles,
  Layers,
  Cpu,
  Car,
  Activity,
  Zap,
  CheckCircle2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { AiAgentSummaryCard } from './components/AiAgentSummaryCard';
import { AuthenticityCard } from './components/AuthenticityCard';
import { ImageBoundingBoxViewer } from './components/ImageBoundingBoxViewer';
import { ImageDescriptionCard } from './components/ImageDescriptionCard';
import { LiveQueueTable } from './components/LiveQueueTable';
import { Navbar } from './components/Navbar';
import { OcrAnalysisCard } from './components/OcrAnalysisCard';
import { generatePdfReport } from './components/PdfExportService';
import { PipelineTracker } from './components/PipelineTracker';
import { QualityAndBlurCard } from './components/QualityAndBlurCard';
import { UploadSection } from './components/UploadSection';
import { VehicleInfoCard } from './components/VehicleInfoCard';
import { SampleVehiclePreset } from './data/sampleVehicles';
import { apiFetchJson, getApiErrorMessage } from './services/apiClient';
import { validateIndianNumberPlate } from './services/indianRtoDatabase';
import { prepareImageForUpload } from './services/uploadClient';
import { VehicleProcessingReport } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'queue' | 'architecture'>('analyzer');
  const [jobs, setJobs] = useState<VehicleProcessingReport[]>([]);
  const [currentReport, setCurrentReport] = useState<VehicleProcessingReport | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeProcessingId, setActiveProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Select an image to start analysis.');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasRenderableReport = Boolean(
    currentReport && (
      currentReport.status === 'Completed' ||
      currentReport.progress >= 100 ||
      (currentReport.bounding_boxes?.length ?? 0) > 0 ||
      currentReport.ocr_confidence > 0 ||
      ![
        'Analyzing Image...',
        'Analyzing...',
        'Processing',
        'Unable to determine',
      ].includes(currentReport.vehicle_type)
    )
  );

  const handleCompletedReport = useCallback((reportData: VehicleProcessingReport) => {
    console.info('[frontend] analysis completed', {
      processingId: reportData.processing_id,
      plate: reportData.number_plate,
      vehicleType: reportData.vehicle_type,
      processingTimeMs: reportData.processing_time_ms,
    });
    setCurrentReport(reportData);
    setJobs((prev) => {
      const next = [...prev];
      const idx = next.findIndex((job) => job.processing_id === reportData.processing_id);
      if (idx >= 0) {
        next[idx] = reportData;
      } else {
        next.unshift(reportData);
      }
      return next;
    });
    setErrorMessage(null);
    setStatusMessage(
      `Analysis completed for ${reportData.filename}. ${reportData.number_plate || 'Number plate not detected.'}`
    );
    setIsUploading(false);
    setActiveProcessingId(null);
  }, []);

  const handleRequestError = useCallback((userMessage: string, details?: string) => {
    const fullMessage = details ? `${userMessage} ${details}` : userMessage;
    console.error('[frontend] request error', { userMessage, details });
    setErrorMessage(fullMessage);
    setStatusMessage('Processing stopped.');
    setIsUploading(false);
    setActiveProcessingId(null);
  }, []);

  // Fetch jobs list on load and periodically
  const fetchJobs = useCallback(async () => {
    const result = await apiFetchJson<VehicleProcessingReport[]>(
      '/api/jobs',
      { method: 'GET' },
      'fetch jobs'
    );

    if (result.ok) {
      setJobs(result.data);
      if (!currentReport && result.data.length > 0) {
        setCurrentReport(result.data[0]);
      }
      return;
    }

    console.warn('[frontend] fetch jobs failed', result);
  }, [currentReport]);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  // Poll for job status during async pipeline execution
  const pollJobStatus = async (processingId: string) => {
    setActiveProcessingId(processingId);
    setStatusMessage(`Image uploaded successfully. Processing request ${processingId}...`);
    let completed = false;
    let attempts = 0;

    while (!completed) {
      attempts += 1;
      try {
        const statusResult = await apiFetchJson<{
          processing_id: string;
          status: VehicleProcessingReport['status'];
          progress: number;
          pipeline_steps?: VehicleProcessingReport['pipeline_steps'];
          filename?: string;
          upload_time?: string;
          error?: string;
        }>(`/api/status/${processingId}`, { method: 'GET' }, 'poll job status');

        if (!statusResult.ok) {
          handleRequestError(
            'Unable to fetch processing status from the backend.',
            getApiErrorMessage(statusResult)
          );
          completed = true;
          break;
        }

        const statusData = statusResult.data;
        setStatusMessage(`Processing ${statusData.filename || processingId}: ${statusData.status} (${statusData.progress || 0}%)`);

          // Update currentReport with real-time status and steps during processing
          if (statusData.status === 'Processing' || statusData.status === 'Pending') {
            setCurrentReport((prev) => {
              if (prev) {
                return {
                  ...prev,
                  status: statusData.status,
                  progress: statusData.progress || 0,
                  pipeline_steps: statusData.pipeline_steps || [],
                };
              }
              const tempReport: VehicleProcessingReport = {
                processing_id: processingId,
                image_url: `/uploads/${statusData.filename || 'uploaded_image.jpg'}`,
                filename: statusData.filename || 'uploaded_image.jpg',
                upload_time: statusData.upload_time || new Date().toISOString(),
                status: statusData.status,
                progress: statusData.progress || 0,
                pipeline_steps: statusData.pipeline_steps || [],
                number_plate: 'Reading Plate...',
                plate_valid: false,
                ocr_confidence: 0,
                blur_score: 0,
                blur_category: 'Sharp',
                tampered: false,
                duplicate: false,
                screenshot: false,
                vehicle_type: 'Analyzing Image...',
                vehicle_category: 'Car',
                manufacturer: 'Analyzing...',
                model: 'Analyzing...',
                body_type: 'Analyzing...',
                vehicle_color: 'Analyzing...',
                estimated_year: '2024',
                image_quality: 'Good',
                brightness: 'Good',
                contrast: 'Good',
                noise: 'Low',
                bounding_boxes: [],
                metadata: {
                  camera: 'Standard Input',
                  device: 'Web Client',
                  gps: 'N/A',
                  capture_time: new Date().toISOString(),
                },
                overall_confidence: 0,
                ai_summary: 'Processing image through AI Computer Vision pipeline...',
              };
              return tempReport;
            });
          }

          if (statusData.status === 'Completed' || statusData.status === 'Failed') {
            completed = true;
            // Fetch final result report
            const reportResult = await apiFetchJson<VehicleProcessingReport>(
              `/api/results/${processingId}`,
              { method: 'GET' },
              'fetch job result'
            );

            if (!reportResult.ok) {
              handleRequestError(
                'Processing finished but the final analysis response could not be loaded.',
                getApiErrorMessage(reportResult)
              );
              break;
            }

            handleCompletedReport(reportResult.data);
          }
      } catch (err) {
        handleRequestError(
          'Job polling failed unexpectedly.',
          err instanceof Error ? err.message : String(err)
        );
        completed = true;
      }
      if (attempts >= 180) {
        handleRequestError('Processing timed out.', 'The backend did not finish within the expected time window.');
        completed = true;
      }
      if (!completed) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    setIsUploading(false);
    setActiveProcessingId(null);
  };

  const handleUpdatePlate = (newPlateText: string) => {
    if (!currentReport) return;
    const validation = validateIndianNumberPlate(newPlateText);
    const updated: VehicleProcessingReport = {
      ...currentReport,
      number_plate: validation.cleanedText || newPlateText.toUpperCase().trim(),
      plate_valid: validation.isValid,
      invalid_reason: validation.reason,
      state_code: validation.stateCode,
      state_name: validation.stateName,
      district_code: validation.districtCode,
      district_name: validation.districtName,
      ocr_confidence: 99.0,
      ai_summary: `Vehicle registration manually verified as ${validation.cleanedText || newPlateText}. State: ${validation.stateName || 'Indian State'} (${validation.districtName || 'RTO Authority'}).`,
    };
    setCurrentReport(updated);
    setJobs((prev) =>
      prev.map((j) => (j.processing_id === updated.processing_id ? updated : j))
    );
  };

  // Upload file handler
  const handleUploadFile = async (file: File) => {
    console.info('[frontend] selected file for upload', {
      filename: file.name,
      size: file.size,
      type: file.type,
    });
    setIsUploading(true);
    setActiveTab('analyzer');
    setCurrentReport(null);
    setErrorMessage(null);
    setStatusMessage(`Preparing ${file.name} for upload...`);

    try {
      const prepared = await prepareImageForUpload(file);
      console.info('[frontend] image prepared for upload', prepared);
      setStatusMessage(`Image uploaded successfully. Processing ${prepared.filename}...`);

      const uploadResult = await apiFetchJson<{
        processing_id?: string;
        status?: string;
        report?: VehicleProcessingReport;
        error?: string;
        details?: string;
      }>('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prepared),
      }, 'upload image');

      if (!uploadResult.ok) {
        handleRequestError(
          'Image upload failed.',
          getApiErrorMessage(uploadResult)
        );
        return;
      }

      const data = uploadResult.data;
      if (data.report) {
        handleCompletedReport(data.report);
      } else if (data.processing_id) {
        void pollJobStatus(data.processing_id);
      } else {
        handleRequestError('The backend did not return an analysis result.', 'Please check the deployment logs.');
      }
    } catch (err) {
      handleRequestError(
        'Image upload failed before processing started.',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  // Preset scenario selector handler
  const handleSelectPreset = async (preset: SampleVehiclePreset) => {
    console.info('[frontend] preset selected', { presetId: preset.id });
    setIsUploading(true);
    setActiveTab('analyzer');
    setErrorMessage(null);
    setStatusMessage(`Loading preset ${preset.title}...`);

    try {
      const uploadResult = await apiFetchJson<{
        processing_id?: string;
        status?: string;
        report?: VehicleProcessingReport;
        error?: string;
        details?: string;
      }>('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetKey: preset.id }),
      }, 'load preset');

      if (!uploadResult.ok) {
        handleRequestError(
          'Preset analysis failed.',
          getApiErrorMessage(uploadResult)
        );
        return;
      }

      const data = uploadResult.data;
      if (data.report) {
        handleCompletedReport(data.report);
      } else if (data.processing_id) {
        void pollJobStatus(data.processing_id);
      } else {
        handleRequestError('The backend did not return preset analysis output.', 'Please check the deployment logs.');
      }
    } catch (err) {
      handleRequestError(
        'Preset analysis request failed.',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  const [viewMode, setViewMode] = useState<'report' | 'json'>('report');

  // Download JSON report
  const handleDownloadJson = () => {
    if (!currentReport) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentReport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `report_${currentReport.processing_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalProcessed={jobs.length}
        activeProcessing={Boolean(activeProcessingId || isUploading)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Zone & Presets Section */}
        <UploadSection
          onUploadFile={handleUploadFile}
          onSelectPreset={handleSelectPreset}
          isUploading={isUploading}
        />

        <div className={`rounded-2xl border px-5 py-4 shadow-lg ${
          errorMessage
            ? 'border-rose-500/30 bg-rose-500/10 text-rose-100'
            : isUploading
            ? 'border-blue-500/30 bg-blue-500/10 text-blue-100'
            : 'border-emerald-500/20 bg-emerald-500/5 text-slate-100'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">
                {errorMessage ? 'Processing Error' : isUploading ? 'Processing...' : 'Processing Status'}
              </div>
              <p className="mt-1 text-xs sm:text-sm opacity-90">
                {errorMessage || statusMessage}
              </p>
            </div>
            {currentReport && !errorMessage && (
              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div>
                  <div className="text-slate-400">Vehicle Registration Number</div>
                  <div className="font-semibold text-slate-100">{currentReport.number_plate || 'Number plate not detected.'}</div>
                </div>
                <div>
                  <div className="text-slate-400">Vehicle Type</div>
                  <div className="font-semibold text-slate-100">{currentReport.vehicle_type || 'Unable to identify vehicle.'}</div>
                </div>
                <div>
                  <div className="text-slate-400">OCR Confidence</div>
                  <div className="font-semibold text-slate-100">{currentReport.ocr_confidence}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Processing Time</div>
                  <div className="font-semibold text-slate-100">
                    {currentReport.processing_time_ms ? `${(currentReport.processing_time_ms / 1000).toFixed(2)}s` : 'Calculating...'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Live Analyzer View */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            {/* Pipeline Status Tracker */}
            {currentReport && (
              <PipelineTracker
                status={currentReport.status}
                progress={currentReport.progress}
                steps={currentReport.pipeline_steps || []}
                processingId={currentReport.processing_id}
              />
            )}

            {/* Results Inspection Dashboard */}
            {hasRenderableReport && currentReport && (
              <div className="space-y-6">
                {/* Export Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-3 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-200">
                      Vehicle Report Inspection
                    </span>
                    <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      ID: {currentReport.processing_id}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      Uploaded {currentReport.upload_time}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'report' ? 'json' : 'report')}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition-all shadow ${
                        viewMode === 'json'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <FileJson className="h-4 w-4 text-amber-400" />
                      <span>{viewMode === 'json' ? 'Visual Report' : 'Structured JSON'}</span>
                    </button>

                    <button
                      onClick={handleDownloadJson}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow"
                    >
                      <Download className="h-4 w-4 text-emerald-400" />
                      <span>Download JSON</span>
                    </button>

                    <button
                      onClick={() => generatePdfReport(currentReport)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Download PDF Audit</span>
                    </button>
                  </div>
                </div>

                {viewMode === 'json' ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-5 w-5 text-amber-400" />
                        <h3 className="font-bold text-slate-100 text-sm">
                          Raw Pipeline Structured JSON Output
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        schema: VehicleProcessingReport
                      </span>
                    </div>
                    <pre className="max-h-[600px] overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-amber-300/90 border border-slate-800 leading-relaxed selection:bg-amber-500/30">
                      {JSON.stringify(currentReport, null, 2)}
                    </pre>
                  </div>
                ) : (
                  /* Main 2-Column Grid */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Image Bounding Box Stage + Vehicle Info */}
                    <div className="lg:col-span-7 space-y-6">
                      <ImageBoundingBoxViewer
                        imageUrl={currentReport.image_url}
                        filename={currentReport.filename}
                        boundingBoxes={currentReport.bounding_boxes}
                        plateText={currentReport.number_plate}
                        isTampered={currentReport.tampered}
                        blurScore={currentReport.blur_score}
                      />

                      <ImageDescriptionCard report={currentReport} />

                      <VehicleInfoCard
                        vehicleType={currentReport.vehicle_type}
                        vehicleCategory={currentReport.vehicle_category}
                        manufacturer={currentReport.manufacturer}
                        model={currentReport.model}
                        bodyType={currentReport.body_type}
                        vehicleColor={currentReport.vehicle_color}
                        estimatedYear={currentReport.estimated_year}
                        confidence={currentReport.confidence_scores?.vehicle_detection || 97.5}
                      />
                    </div>

                    {/* Right Column: OCR, Quality/Blur, Security & AI Agent */}
                    <div className="lg:col-span-5 space-y-6">
                      <OcrAnalysisCard
                        numberPlate={currentReport.number_plate}
                        plateValid={currentReport.plate_valid}
                        invalidReason={currentReport.invalid_reason}
                        ocrConfidence={currentReport.ocr_confidence}
                        onPlateChange={handleUpdatePlate}
                        stateCode={currentReport.state_code}
                        stateName={currentReport.state_name}
                        districtCode={currentReport.district_code}
                        districtName={currentReport.district_name}
                        plateType={currentReport.plate_type}
                        plateColor={currentReport.plate_color}
                      />

                      <QualityAndBlurCard
                        imageQuality={currentReport.image_quality}
                        blurScore={currentReport.blur_score}
                        blurCategory={currentReport.blur_category}
                        brightness={currentReport.brightness}
                        contrast={currentReport.contrast}
                        noise={currentReport.noise}
                        resolution={currentReport.quality_details?.resolution}
                      />

                      <AuthenticityCard
                        tampered={currentReport.tampered}
                        duplicate={currentReport.duplicate}
                        screenshot={currentReport.screenshot}
                        authenticityDetails={currentReport.authenticity_details}
                        metadata={currentReport.metadata}
                      />

                      <AiAgentSummaryCard report={currentReport} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Queue Table View */}
        {activeTab === 'queue' && (
          <LiveQueueTable
            jobs={jobs}
            selectedJobId={currentReport?.processing_id}
            onSelectJob={(report: VehicleProcessingReport) => {
              setCurrentReport(report);
              setActiveTab('analyzer');
            }}
          />
        )}

        {/* Tab 3: Architecture & Pipeline Specs */}
        {activeTab === 'architecture' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Layers className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  AI Vehicle Processing System Architecture
                </h2>
                <p className="text-xs text-slate-400">
                  Modular, Scalable, Production-Ready Asynchronous Pipeline Specs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-blue-400 text-sm">1. OpenCV & Image Preprocessing</div>
                <p className="text-slate-300 leading-relaxed">
                  Decodes raw buffer, resizes, normalizes, removes pixel noise, and computes histogram equalization for contrast optimization.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-indigo-400 text-sm">2. CNN & Object Detection</div>
                <p className="text-slate-300 leading-relaxed">
                  Extracts spatial features to classify vehicle into 28+ categories and generates bounding boxes for Vehicle, License Plate, and Parts.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-amber-400 text-sm">3. OCR & Indian RTO Matcher</div>
                <p className="text-slate-300 leading-relaxed">
                  EasyOCR / PaddleOCR text recognition paired with Indian High-Security Registration Plate (HSRP) regex validator and RTO database.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-emerald-400 text-sm">4. Laplacian Blur Variance</div>
                <p className="text-slate-300 leading-relaxed">
                  Computes second-order spatial derivatives on grayscale image matrix to measure focus sharpness score (Sharp, Slight, Moderate, Blurred).
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-rose-400 text-sm">5. ELA Tamper & pHash Duplicate</div>
                <p className="text-slate-300 leading-relaxed">
                  Error Level Analysis identifies compression disparities & cloned pixels while Perceptual Hashing (pHash) flags database duplicates.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="font-bold text-purple-400 text-sm">6. Gemini LLM Reasoning Agent</div>
                <p className="text-slate-300 leading-relaxed">
                  Gemini 3.6 Flash synthesizes computer vision features, OCR metrics, and forensic checks into a human-readable executive verification report.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
