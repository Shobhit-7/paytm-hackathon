export type TrackCondition = 'DRY' | 'DAMP' | 'WET' | 'DRYING';

export type TrendDirection = 'IMPROVING' | 'WORSENING' | 'STABLE' | 'UNCERTAIN';

export type SessionType = 'IMAGE' | 'VIDEO' | 'BATCH' | 'DEMO';

export interface Probabilities {
  DRY: number;
  DAMP: number;
  WET: number;
  DRYING: number;
}

export interface FramePrediction {
  timestamp: number;
  condition: TrackCondition;
  confidence: number;
  wetness_score: number;
  probabilities?: Probabilities;
}

export interface ImageAnalysisResponse {
  condition: TrackCondition;
  confidence: number;
  probabilities: Probabilities;
  wetness_score: number;
  timestamp: string;
}

export interface VideoAnalysisResponse {
  frames: FramePrediction[];
  trend: TrendDirection;
  current_condition: TrackCondition;
  change_rate?: number;
  trend_confidence?: number;
  explanation?: string;
}

export interface BatchAnalysisResponse {
  predictions: ImageAnalysisResponse[];
  trend: TrendDirection;
  current_condition: TrackCondition;
  recommendation: Recommendation;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rain_probability: number;
  wind_speed: number;
  track_temperature?: number;
}

export interface Recommendation {
  condition: TrackCondition;
  trend: TrendDirection;
  suggestion: string;
  reason: string;
  tyre_window?: string;
  window_status?: string;
  confidence: number;
}

export interface AnalysisSession {
  id: string;
  created_at: string;
  track_name: string;
  race_name: string;
  session_type: SessionType;
  current_condition: TrackCondition;
  confidence: number;
  trend: TrendDirection;
  recommendation: string;
  wetness_score?: number;
  frame_count?: number;
}

export interface AnalysisSessionDetail extends AnalysisSession {
  frames: FramePrediction[];
  weather?: WeatherData;
  recommendation_detail?: Recommendation;
}

export interface TrendPoint {
  time: string;
  timestamp: number;
  condition: TrackCondition;
  confidence: number;
  wetness_score: number;
}

export interface ApiError {
  error: string;
  code: string;
  message: string;
}

export interface RaceStatus {
  race_name: string;
  track_name: string;
  lap: number;
  total_laps: number;
  weather_temp: number;
}

export const CONDITION_WETNESS: Record<TrackCondition, number> = {
  WET: 1.0,
  DAMP: 0.7,
  DRYING: 0.4,
  DRY: 0.1,
};

export const CONDITION_COLORS: Record<TrackCondition, string> = {
  DRY: '#22c55e',
  DAMP: '#eab308',
  WET: '#3b82f6',
  DRYING: '#f97316',
};

export const CONDITION_TEXT_COLORS: Record<TrackCondition, string> = {
  DRY: 'text-racing-green',
  DAMP: 'text-racing-yellow',
  WET: 'text-racing-blue',
  DRYING: 'text-racing-orange',
};

export const CONDITION_GLOW: Record<TrackCondition, string> = {
  DRY: 'text-glow-green',
  DAMP: 'text-glow-yellow',
  WET: 'text-glow-blue',
  DRYING: 'text-glow-orange',
};

export const CONDITION_LABELS: Record<TrackCondition, string> = {
  DRY: 'Dry',
  DAMP: 'Damp',
  WET: 'Wet',
  DRYING: 'Drying',
};

export const TYRE_SUGGESTIONS: Record<TrackCondition, string> = {
  DRY: 'DRY / SLICK',
  DAMP: 'INTERMEDIATE',
  WET: 'WET',
  DRYING: 'INTERMEDIATE → SLICK',
};
