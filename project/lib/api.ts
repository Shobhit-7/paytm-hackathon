import axios, { AxiosError } from 'axios';
import {
  AnalysisSession,
  AnalysisSessionDetail,
  BatchAnalysisResponse,
  FramePrediction,
  ImageAnalysisResponse,
  Recommendation,
  TrackCondition,
  TrendDirection,
  VideoAnalysisResponse,
  WeatherData,
} from '@/types/analysis';
import { calculateTrendFromFrames, getWetnessScore } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const demoFrames: FramePrediction[] = [
  { timestamp: 0, condition: 'WET', confidence: 0.94, wetness_score: 0.95 },
  { timestamp: 2, condition: 'WET', confidence: 0.92, wetness_score: 0.9 },
  { timestamp: 4, condition: 'DAMP', confidence: 0.86, wetness_score: 0.72 },
  { timestamp: 6, condition: 'DAMP', confidence: 0.89, wetness_score: 0.68 },
  { timestamp: 8, condition: 'DRYING', confidence: 0.84, wetness_score: 0.5 },
  { timestamp: 10, condition: 'DRYING', confidence: 0.91, wetness_score: 0.42 },
  { timestamp: 12, condition: 'DRY', confidence: 0.88, wetness_score: 0.18 },
];

const demoRecommendation: Recommendation = {
  condition: 'DRYING',
  trend: 'IMPROVING',
  suggestion: 'Potential tyre-change window approaching.',
  reason: 'Wetness has decreased consistently across the last 4 observations.',
  tyre_window: 'INTERMEDIATE → SLICK',
  window_status: 'APPROACHING',
  confidence: 0.82,
};

export const demoSession: AnalysisSessionDetail = {
  id: 'demo-silverstone-001',
  created_at: new Date().toISOString(),
  track_name: 'Silverstone GP',
  race_name: 'British Grand Prix',
  session_type: 'DEMO',
  current_condition: 'DRYING',
  confidence: 0.91,
  trend: 'IMPROVING',
  recommendation: 'Potential tyre-change window approaching.',
  wetness_score: 0.42,
  frame_count: demoFrames.length,
  frames: demoFrames,
  weather: {
    temperature: 24,
    humidity: 78,
    rain_probability: 42,
    wind_speed: 12,
    track_temperature: 31,
  },
  recommendation_detail: demoRecommendation,
};

export const demoHistory: AnalysisSession[] = [
  demoSession,
  {
    id: 'session-002',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    track_name: 'Spa-Francorchamps',
    race_name: 'Belgian Grand Prix',
    session_type: 'VIDEO',
    current_condition: 'WET',
    confidence: 0.87,
    trend: 'WORSENING',
    recommendation: 'Potential deterioration detected. Prepare for wetter conditions.',
    wetness_score: 0.88,
    frame_count: 18,
  },
  {
    id: 'session-003',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    track_name: 'Monza Circuit',
    race_name: 'Italian Grand Prix',
    session_type: 'IMAGE',
    current_condition: 'DRY',
    confidence: 0.96,
    trend: 'STABLE',
    recommendation: 'Dry tyre conditions appear suitable.',
    wetness_score: 0.1,
    frame_count: 1,
  },
];

function isDemo(): boolean {
  return typeof window !== 'undefined' && localStorage.getItem('trackpulse_demo') === 'true';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.response?.data?.detail || error.message;
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

export async function analyzeImage(file: File): Promise<ImageAnalysisResponse> {
  if (isDemo()) {
    return {
      condition: 'DRYING',
      confidence: 0.91,
      probabilities: { DRY: 0.07, DAMP: 0.12, WET: 0.04, DRYING: 0.77 },
      wetness_score: 0.42,
      timestamp: new Date().toISOString(),
    };
  }

  const formData = new FormData();
  formData.append('image', file);
  try {
    const response = await axios.post<ImageAnalysisResponse>(`${API_URL}/api/analyze/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function analyzeVideo(file: File, frameInterval = 2): Promise<VideoAnalysisResponse> {
  if (isDemo()) {
    const { trend, changeRate } = calculateTrendFromFrames(demoFrames);
    return {
      frames: demoFrames,
      trend,
      current_condition: 'DRYING',
      change_rate: changeRate,
      trend_confidence: 0.86,
      explanation: 'Wetness has decreased across recent observations.',
    };
  }

  const formData = new FormData();
  formData.append('video', file);
  formData.append('frame_interval', String(frameInterval));
  try {
    const response = await axios.post<VideoAnalysisResponse>(`${API_URL}/api/analyze/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function analyzeBatch(files: File[]): Promise<BatchAnalysisResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  try {
    const response = await axios.post<BatchAnalysisResponse>(`${API_URL}/api/analyze/batch`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getHistory(): Promise<AnalysisSession[]> {
  if (isDemo()) return demoHistory;
  try {
    const response = await axios.get<AnalysisSession[]>(`${API_URL}/api/history`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getSession(sessionId: string): Promise<AnalysisSessionDetail> {
  if (isDemo() || sessionId.startsWith('demo')) return demoSession;
  try {
    const response = await axios.get<AnalysisSessionDetail>(`${API_URL}/api/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getRecommendation(sessionId: string): Promise<Recommendation> {
  if (isDemo() || sessionId.startsWith('demo')) return demoRecommendation;
  try {
    const response = await axios.get<Recommendation>(`${API_URL}/api/recommendation/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function submitWeather(weather: WeatherData, sessionId?: string): Promise<WeatherData> {
  if (isDemo()) return weather;
  try {
    const response = await axios.post<WeatherData>(`${API_URL}/api/weather`, { ...weather, session_id: sessionId });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
    return response.data.status === 'ok';
  } catch {
    return false;
  }
}

export function buildRecommendation(condition: TrackCondition, trend: TrendDirection, confidence: number): Recommendation {
  const suggestions: Record<TrackCondition, string> = {
    DRY: 'Dry tyre conditions appear suitable.',
    DAMP: 'Intermediate tyres may be worth considering.',
    WET: 'Wet-weather tyres may be appropriate.',
    DRYING: 'Track is drying. Monitor the transition toward slick conditions.',
  };
  const reason = trend === 'IMPROVING'
    ? 'Wetness has decreased consistently across recent observations.'
    : trend === 'WORSENING'
      ? 'Wetness has increased across recent observations.'
      : 'Recent visual observations show limited change.';
  const suggestion = trend === 'IMPROVING' && condition === 'DRYING'
    ? 'Potential tyre-change window approaching.'
    : trend === 'WORSENING'
      ? 'Potential deterioration detected. Prepare for wetter conditions.'
      : suggestions[condition];
  return {
    condition,
    trend,
    suggestion,
    reason,
    tyre_window: condition === 'DRYING' ? 'INTERMEDIATE → SLICK' : condition === 'WET' ? 'WET' : condition === 'DAMP' ? 'INTERMEDIATE' : 'DRY / SLICK',
    window_status: trend === 'IMPROVING' && condition === 'DRYING' ? 'APPROACHING' : 'MONITORING',
    confidence,
  };
}

export { getWetnessScore };
