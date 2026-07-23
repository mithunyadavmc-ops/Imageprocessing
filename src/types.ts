export type JobStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export type BlurCategory = 'Sharp' | 'Slight Blur' | 'Moderate Blur' | 'Highly Blurred';

export type QualityRating = 'Excellent' | 'Good' | 'Average' | 'Poor';

export type DetectionCategory =
  | 'Car'
  |'Auto'
  | 'Bike'
  | 'Motorcycle'
  | 'Scooter'
  | 'Truck'
  | 'Mini Truck'
  | 'Pickup Truck'
  | 'Bus'
  | 'Van'
  | 'Auto Rickshaw'
  | 'Electric Vehicle'
  | 'SUV'
  | 'Sedan'
  | 'Hatchback'
  | 'Luxury Car'
  | 'Sports Car'
  | 'Jeep'
  | 'Tractor'
  | 'Ambulance'
  | 'Police Vehicle'
  | 'Fire Truck'
  | 'Construction Vehicle'
  | 'Bulldozer'
  | 'Excavator'
  | 'Road Roller'
  | 'Trailer'
  | 'Container Truck'
  | 'Military Vehicle';

export interface BoundingBox {
  label: string;
  confidence: number;
  // Normalized coordinates [ymin, xmin, ymax, xmax] in 0..100 percentage
  box: [number, number, number, number];
  color?: string;
}

export interface ExifMetadata {
  camera: string;
  device: string;
  gps: string;
  capture_time: string;
  software?: string;
  resolution?: string;
  focal_length?: string;
  iso?: string;
}

export interface ImageQualityMetrics {
  image_quality: QualityRating;
  resolution: string;
  dimensions: { width: number; height: number };
  brightness: 'Good' | 'Overexposed' | 'Underexposed' | 'Average';
  contrast: 'Good' | 'High' | 'Low';
  sharpness_score: number;
  blur_score: number; // Laplacian variance score
  blur_category: BlurCategory;
  noise: 'Low' | 'Moderate' | 'High';
  compression_artifacts: boolean;
  over_exposure: boolean;
  under_exposure: boolean;
  shadow_detected: boolean;
  reflection_detected: boolean;
  lens_distortion: boolean;
  perspective_distortion: boolean;
  image_rotation: number; // degrees
}

export interface AuthenticityMetrics {
  tampered: boolean;
  tampering_score: number; // 0..100
  tampering_details?: string;
  screenshot: boolean;
  screenshot_type?: 'Original Camera Photo' | 'Screenshot' | 'Photo of Monitor' | 'Photo of Printed Image';
  duplicate: boolean;
  similarity_score: number;
  phash: string; // Perceptual Hash
  ahash: string; // Average Hash
  dhash: string; // Difference Hash
}

export interface OcrPlateResult {
  number_plate: string;
  plate_valid: boolean;
  invalid_reason?: string;
  ocr_confidence: number;
  state_code?: string;
  state_name?: string;
  district_code?: string;
  district_name?: string;
  plate_type?: string;
  plate_color?: string;
  registration_number?: string;
  vehicle_series?: string;
  bounding_box?: BoundingBox;
}

export interface VehicleClassification {
  vehicle_type: string;
  vehicle_category: DetectionCategory;
  manufacturer: string;
  model: string;
  body_type: string;
  vehicle_color: string;
  estimated_year: string;
  orientation: 'Frontal' | 'Front 3/4' | 'Side' | 'Rear' | 'Top-down';
  detection_confidence: number;
  bounding_box: BoundingBox;
}

export interface PipelineStepStatus {
  step: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
  durationMs?: number;
}

export interface VehicleProcessingReport {
  processing_id: string;
  filename: string;
  upload_time: string;
  status: JobStatus;
  progress: number;
  processing_time_ms?: number;
  pipeline_steps?: PipelineStepStatus[];
  image_url?: string;
  
  // Classification
  vehicle_type: string;
  vehicle_category: DetectionCategory;
  manufacturer: string;
  model: string;
  body_type?: string;
  vehicle_color: string;
  estimated_year: string;
  
  // Plate & OCR
  number_plate: string;
  plate_valid: boolean;
  invalid_reason?: string;
  ocr_confidence: number;
  state_code?: string;
  state_name?: string;
  district_code?: string;
  district_name?: string;
  plate_type?: string;
  plate_color?: string;
  
  // Quality & Blur
  image_quality: QualityRating;
  blur_score: number;
  blur_category?: BlurCategory;
  brightness: string;
  contrast: string;
  noise: string;
  quality_details?: ImageQualityMetrics;
  
  // Security & Authenticity
  tampered: boolean;
  duplicate: boolean;
  screenshot: boolean;
  authenticity_details?: AuthenticityMetrics;
  
  // Detection boxes
  bounding_boxes?: BoundingBox[];
  
  // Metadata
  metadata: ExifMetadata;
  
  // Confidence Scores
  confidence_scores?: {
    vehicle_detection: number;
    ocr: number;
    blur: number;
    brightness: number;
    tampering: number;
    screenshot: number;
    overall_quality: number;
  };
  
  overall_confidence: number;
  ai_summary: string;
  ai_suitability?: string;
}
