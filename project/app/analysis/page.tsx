'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Activity, AlertTriangle, Loader2, Clock, MapPin, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AnalysisSessionDetail, CONDITION_COLORS, CONDITION_TEXT_COLORS, CONDITION_GLOW } from '@/types/analysis';
import { getSession, demoSession } from '@/lib/api';
import { formatConfidence, formatDate, getWetnessScore } from '@/lib/utils';
import { TrackConditionCard } from '@/components/dashboard/TrackConditionCard';
import { ConditionTimeline } from '@/components/dashboard/ConditionTimeline';
import { TireRecommendation } from '@/components/dashboard/TireRecommendation';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { FrameAnalysis } from '@/components/dashboard/FrameAnalysis';
import { ConditionTrendChart } from '@/components/charts/ConditionTrendChart';
import { ConfidenceTrendChart } from '@/components/charts/ConfidenceTrendChart';

function AnalysisInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id') || 'demo-silverstone-001';
  const { toast } = useToast();
  const [session, setSession] = useState<AnalysisSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (sessionId.startsWith('demo')) {
          setSession(demoSession);
        } else {
          const s = await getSession(sessionId);
          setSession(s);
        }
      } catch (e) {
        toast({ title: 'Failed to load session', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
        setSession(demoSession);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-sm text-muted-foreground">Session not found.</p>
        <Link href="/history"><Button variant="outline">Back to history</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button></Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-racing-red"><Activity className="h-4 w-4 text-white" /></div>
              <span className="text-sm font-bold tracking-widest">TRACKPULSE</span>
            </div>
          </div>
          {session.session_type === 'DEMO' && <Badge variant="outline" className="border-racing-yellow/30 bg-racing-yellow/10 text-racing-yellow">DEMO / SYNTHETIC</Badge>}
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        {/* Session Info */}
        <div className="glass-card p-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div><div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Race</div><div className="flex items-center gap-2 text-sm font-semibold"><Flag className="h-3.5 w-3.5 text-muted-foreground" /> {session.race_name}</div></div>
            <div><div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Track</div><div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {session.track_name}</div></div>
            <div><div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Session type</div><div className="text-sm font-semibold">{session.session_type}</div></div>
            <div><div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Date</div><div className="flex items-center gap-2 text-sm font-semibold"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {formatDate(session.created_at)}</div></div>
          </div>
        </div>

        {/* Condition */}
        <TrackConditionCard condition={session.current_condition} confidence={session.confidence} trend={session.trend} />

        {/* Probabilities */}
        {session.frames.length > 0 && session.frames[0].probabilities && (
          <ConfidenceTrendChart probabilities={session.frames[0].probabilities} />
        )}

        {/* Trend Chart */}
        <ConditionTrendChart frames={session.frames} />

        {/* Timeline */}
        <ConditionTimeline frames={session.frames} />

        {/* Insight + Tyre */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FrameAnalysis condition={session.current_condition} trend={session.trend} confidence={session.confidence} />
          {session.recommendation_detail && <TireRecommendation recommendation={session.recommendation_detail} />}
        </div>

        {/* Weather */}
        {session.weather && <WeatherCard weather={session.weather} />}

        {/* Disclaimer */}
        <div className="glass-card flex items-start gap-3 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-racing-yellow" />
          <p className="text-xs text-muted-foreground">TrackPulse provides AI-assisted visual track assessment for decision support. It does not guarantee track conditions or tyre strategy outcomes.</p>
        </div>
      </main>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-racing-red" /></div>}>
      <AnalysisInner />
      <Toaster />
    </Suspense>
  );
}
