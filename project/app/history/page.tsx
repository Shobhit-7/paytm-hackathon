'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, ChevronRight, History, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AnalysisSession, CONDITION_COLORS } from '@/types/analysis';
import { getHistory, demoHistory } from '@/lib/api';
import { formatDate, formatConfidence } from '@/lib/utils';

function HistoryInner() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<AnalysisSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getHistory();
        setSessions(data.length > 0 ? data : demoHistory);
      } catch (e) {
        toast({ title: 'Failed to load history', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
        setSessions(demoHistory);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

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
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-bold tracking-tight">Analysis History</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-racing-red" /></div>
        ) : sessions.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <History className="mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No analysis sessions yet.</p>
            <Link href="/dashboard"><Button className="mt-4 bg-racing-red text-white hover:bg-racing-red/90">Start analyzing</Button></Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-6 gap-4 border-b border-white/5 bg-white/[0.02] px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
              <div>Date</div><div>Track</div><div>Condition</div><div>Trend</div><div>Confidence</div><div>Recommendation</div>
            </div>
            {sessions.map((s) => (
              <Link key={s.id} href={`/analysis?id=${s.id}`}>
                <div className="grid grid-cols-6 gap-4 border-b border-white/5 px-5 py-4 transition-colors hover:bg-white/[0.02] last:border-0">
                  <div className="text-xs text-muted-foreground">{formatDate(s.created_at)}</div>
                  <div className="flex items-center gap-2 text-xs"><MapPin className="h-3 w-3 text-muted-foreground" /> {s.track_name}</div>
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: CONDITION_COLORS[s.current_condition] }} /><span className="text-xs font-semibold">{s.current_condition}</span></div>
                  <div className={`text-xs font-semibold ${s.trend === 'IMPROVING' ? 'text-racing-green' : s.trend === 'WORSENING' ? 'text-racing-red' : 'text-muted-foreground'}`}>{s.trend}</div>
                  <div className="text-xs">{formatConfidence(s.confidence)}</div>
                  <div className="flex items-center gap-2"><span className="truncate text-xs text-muted-foreground">{s.recommendation}</span><ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <>
      <HistoryInner />
      <Toaster />
    </>
  );
}
