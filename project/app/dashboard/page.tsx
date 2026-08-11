'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Brain,
  Camera,
  ChevronRight,
  Circle,
  Clock,
  Cpu,
  Eye,
  Flag,
  Gauge,
  History,
  Loader2,
  MapPin,
  Play,
  Radio,
  ScanLine,
  Settings,
  Sparkles,
  Square,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  TrackCondition,
  TrendDirection,
  FramePrediction,
  ImageAnalysisResponse,
  VideoAnalysisResponse,
  Recommendation,
  WeatherData,
  CONDITION_COLORS,
  CONDITION_TEXT_COLORS,
  CONDITION_GLOW,
  TYRE_SUGGESTIONS,
} from '@/types/analysis';
import { calculateTrendFromFrames, formatConfidence, getWetnessScore } from '@/lib/utils';
import { analyzeImage, analyzeVideo, buildRecommendation, demoSession, demoHistory } from '@/lib/api';
import { RaceStatus } from '@/components/dashboard/RaceStatus';
import { DashboardMetrics } from '@/components/dashboard/MetricCards';
import { TrackConditionCard } from '@/components/dashboard/TrackConditionCard';
import { ConfidenceCard } from '@/components/dashboard/ConfidenceCard';
import { ConditionTimeline } from '@/components/dashboard/ConditionTimeline';
import { TireRecommendation } from '@/components/dashboard/TireRecommendation';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { CameraPreview } from '@/components/dashboard/CameraPreview';
import { FrameAnalysis } from '@/components/dashboard/FrameAnalysis';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { ImageUploader } from '@/components/upload/ImageUploader';
import { VideoUploader } from '@/components/upload/VideoUploader';
import { WeatherInput } from '@/components/upload/WeatherInput';
import { ConditionTrendChart } from '@/components/charts/ConditionTrendChart';
import { ConfidenceTrendChart } from '@/components/charts/ConfidenceTrendChart';

const SIM_SEQUENCE: TrackCondition[] = ['WET', 'WET', 'DAMP', 'DAMP', 'DRYING', 'DRYING', 'DRY'];
const SIM_CONFIDENCES = [0.92, 0.89, 0.86, 0.88, 0.84, 0.91, 0.88];

function DashboardInner() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [demoMode, setDemoMode] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const simTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [frames, setFrames] = useState<FramePrediction[]>(demoSession.frames);
  const [condition, setCondition] = useState<TrackCondition>(demoSession.current_condition);
  const [confidence, setConfidence] = useState(demoSession.confidence);
  const [trend, setTrend] = useState<TrendDirection>(demoSession.trend);
  const [wetness, setWetness] = useState(demoSession.wetness_score || 0.42);
  const [recommendation, setRecommendation] = useState<Recommendation>(demoSession.recommendation_detail || buildRecommendation('DRYING', 'IMPROVING', 0.82));
  const [weather, setWeather] = useState<WeatherData>(demoSession.weather!);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [probabilities, setProbabilities] = useState<ImageAnalysisResponse['probabilities'] | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiOnline, setAiOnline] = useState(true);
  const [raceLap, setRaceLap] = useState(42);

  // Initialize demo mode from URL
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setDemoMode(true);
      localStorage.setItem('trackpulse_demo', 'true');
      loadDemo();
    }
  }, [searchParams]);

  // Check backend health
  useEffect(() => {
    if (!demoMode) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/health`)
        .then((r) => r.ok ? setAiOnline(true) : setAiOnline(false))
        .catch(() => setAiOnline(false));
    }
  }, [demoMode]);

  const loadDemo = () => {
    setFrames(demoSession.frames);
    setCondition(demoSession.current_condition);
    setConfidence(demoSession.confidence);
    setTrend(demoSession.trend);
    setWetness(demoSession.wetness_score || 0.42);
    setRecommendation(demoSession.recommendation_detail || buildRecommendation('DRYING', 'IMPROVING', 0.82));
    setWeather(demoSession.weather!);
    setProbabilities({ DRY: 0.07, DAMP: 0.12, WET: 0.04, DRYING: 0.77 });
    toast({ title: 'Demo loaded', description: 'Synthetic data — British Grand Prix simulation.' });
  };

  const startSimulation = () => {
    if (simulating) {
      stopSimulation();
      return;
    }
    setSimulating(true);
    setSimIndex(0);
    setFrames([]);
    const applyFrame = (idx: number) => {
      if (idx >= SIM_SEQUENCE.length) {
        stopSimulation();
        return;
      }
      const cond = SIM_SEQUENCE[idx];
      const conf = SIM_CONFIDENCES[idx] ?? 0.85;
      const wet = getWetnessScore(cond);
      const newFrame: FramePrediction = { timestamp: idx * 2, condition: cond, confidence: conf, wetness_score: wet };
      setFrames((prev) => {
        const updated = [...prev, newFrame];
        const { trend: newTrend } = calculateTrendFromFrames(updated);
        setTrend(newTrend);
        setCondition(cond);
        setConfidence(conf);
        setWetness(wet);
        setRecommendation(buildRecommendation(cond, newTrend, conf));
        return updated;
      });
      setSimIndex(idx + 1);
    };
    applyFrame(0);
    simTimer.current = setInterval(() => {
      setSimIndex((prev) => {
        applyFrame(prev);
        return prev + 1;
      });
    }, 2000);
  };

  const stopSimulation = () => {
    setSimulating(false);
    if (simTimer.current) {
      clearInterval(simTimer.current);
      simTimer.current = null;
    }
  };

  useEffect(() => () => stopSimulation(), []);

  const handleImageAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    setAiOnline(true);
    try {
      setPreviewUrl(URL.createObjectURL(file));
      const result = await analyzeImage(file);
      setCondition(result.condition);
      setConfidence(result.confidence);
      setProbabilities(result.probabilities);
      const wet = result.wetness_score ?? getWetnessScore(result.condition);
      setWetness(wet);
      const newFrame: FramePrediction = {
        timestamp: frames.length > 0 ? frames[frames.length - 1].timestamp + 2 : 0,
        condition: result.condition,
        confidence: result.confidence,
        wetness_score: wet,
        probabilities: result.probabilities,
      };
      const updated = [...frames, newFrame];
      setFrames(updated);
      const { trend: newTrend } = calculateTrendFromFrames(updated);
      setTrend(newTrend);
      setRecommendation(buildRecommendation(result.condition, newTrend, result.confidence));
      toast({ title: 'Analysis complete', description: `Track classified as ${result.condition} (${formatConfidence(result.confidence)})` });
    } catch (e) {
      setAiOnline(false);
      toast({ title: 'Analysis failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoAnalyze = async (file: File, interval: number) => {
    setIsAnalyzing(true);
    try {
      setPreviewUrl(URL.createObjectURL(file));
      const result = await analyzeVideo(file, interval);
      setFrames(result.frames);
      if (result.frames.length > 0) {
        const last = result.frames[result.frames.length - 1];
        setCondition(last.condition);
        setConfidence(last.confidence);
        setWetness(last.wetness_score);
      }
      setTrend(result.trend);
      setRecommendation(buildRecommendation(result.current_condition, result.trend, result.trend_confidence || 0.8));
      toast({ title: 'Video processed', description: `${result.frames.length} frames analyzed · Trend: ${result.trend}` });
    } catch (e) {
      toast({ title: 'Video analysis failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleWeatherSave = async (w: WeatherData) => {
    setWeather(w);
    toast({ title: 'Weather updated', description: 'Supplementary weather data saved.' });
  };

  const raceInfo = {
    race_name: demoMode ? 'British Grand Prix' : 'Demo Grand Prix',
    track_name: 'Silverstone GP',
    lap: raceLap,
    total_laps: 58,
    weather_temp: weather.temperature,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-racing-red">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-widest">TRACKPULSE</div>
              <div className="text-[10px] text-muted-foreground">AI Track Condition Intelligence</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs md:flex">
              <Circle className={`h-2 w-2 ${aiOnline ? 'fill-racing-green text-racing-green' : 'fill-racing-red text-racing-red'}`} />
              <span className="text-muted-foreground">{aiOnline ? 'AI ENGINE ONLINE' : 'AI ENGINE OFFLINE'}</span>
            </div>
            {demoMode && (
              <Badge variant="outline" className="border-racing-yellow/30 bg-racing-yellow/10 text-racing-yellow">
                DEMO / SYNTHETIC
              </Badge>
            )}
            {simulating && (
              <Badge variant="outline" className="border-racing-red/30 bg-racing-red/10 text-racing-red">
                <Radio className="mr-1 h-3 w-3" /> SIMULATION
              </Badge>
            )}
            <Link href="/history"><Button variant="ghost" size="sm" className="hidden gap-1.5 md:flex"><History className="h-3.5 w-3.5" /> History</Button></Link>
            <Link href="/settings"><Button variant="ghost" size="sm" className="hidden md:flex"><Settings className="h-3.5 w-3.5" /></Button></Link>
            <Link href="/"><Button variant="ghost" size="sm"><Square className="h-3.5 w-3.5" /></Button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        {/* Race Status */}
        <RaceStatus race={raceInfo} />

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={loadDemo} variant="outline" size="sm" className="gap-2">
            <Eye className="h-3.5 w-3.5" /> Load Demo Race
          </Button>
          <Button onClick={startSimulation} size="sm" className={`gap-2 ${simulating ? 'bg-racing-red hover:bg-racing-red/90' : ''}`}>
            {simulating ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {simulating ? 'Stop Simulation' : 'Simulate Live Track'}
          </Button>
          <Button
            onClick={() => setDemoMode(!demoMode)}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Cpu className="h-3.5 w-3.5" /> {demoMode ? 'Demo: ON' : 'Demo: OFF'}
          </Button>
        </div>

        {/* Metric Cards */}
        <DashboardMetrics condition={condition} confidence={confidence} wetnessScore={wetness} trend={trend} rainRisk={weather.rain_probability} />

        {/* Two-column: Camera + Condition */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <CameraPreview imageUrl={previewUrl} onAnalyze={() => {}} isAnalyzing={isAnalyzing} />
            {probabilities && <ConfidenceTrendChart probabilities={probabilities} />}
          </div>
          <div className="space-y-4">
            <TrackConditionCard condition={condition} confidence={confidence} trend={trend} timestamp={frames.length > 0 ? frames[frames.length - 1].timestamp : undefined} />
            <ConfidenceCard confidence={confidence} />
          </div>
        </div>

        {/* Uploaders */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ImageUploader onAnalyze={handleImageAnalyze} isAnalyzing={isAnalyzing} />
          <VideoUploader onAnalyze={handleVideoAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {/* Trend Chart */}
        <ConditionTrendChart frames={frames} />

        {/* Timeline */}
        {frames.length > 0 && <ConditionTimeline frames={frames} />}

        {/* AI Insight + Tyre Window */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FrameAnalysis condition={condition} trend={trend} confidence={confidence} explanation={recommendation.reason} />
          <TireRecommendation recommendation={recommendation} />
        </div>

        {/* Weather */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeatherCard weather={weather} />
          <WeatherInput onSave={handleWeatherSave} initial={weather} />
        </div>

        {/* AI Disclaimer */}
        <div className="glass-card flex items-start gap-3 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-racing-yellow" />
          <p className="text-xs text-muted-foreground">
            TrackPulse provides AI-assisted visual track assessment for decision support. It does not guarantee track conditions or tyre strategy outcomes.
          </p>
        </div>

        {/* Recent Sessions */}
        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Recent sessions</span>
            </div>
            <Link href="/history"><Button variant="ghost" size="sm" className="gap-1 text-xs">View all <ChevronRight className="h-3 w-3" /></Button></Link>
          </div>
          <div className="space-y-2">
            {demoHistory.slice(0, 3).map((s) => (
              <Link key={s.id} href={`/analysis?id=${s.id}`}>
                <div className="flex items-center gap-4 rounded-lg border border-white/5 p-3 transition-colors hover:bg-white/[0.02]">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CONDITION_COLORS[s.current_condition] }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.race_name} — {s.track_name}</div>
                    <div className="text-xs text-muted-foreground">{s.session_type} · {formatConfidence(s.confidence)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${s.trend === 'IMPROVING' ? 'text-racing-green' : s.trend === 'WORSENING' ? 'text-racing-red' : 'text-muted-foreground'}`}>{s.trend}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <DashboardInner />
      <Toaster />
    </>
  );
}
