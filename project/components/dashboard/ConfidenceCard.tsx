import { ShieldCheck } from 'lucide-react';
import { formatConfidence } from '@/lib/utils';

export function ConfidenceCard({ confidence }: { confidence: number }) {
  const percent = Math.round(confidence * 100);
  return <div className="glass-card p-5"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI confidence</span><ShieldCheck className="h-4 w-4 text-racing-green" /></div><div className="flex items-end justify-between"><span className="text-3xl font-semibold">{formatConfidence(confidence)}</span><span className="text-xs text-muted-foreground">Vision model</span></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-racing-green transition-all duration-700" style={{ width: `${percent}%` }} /></div></div>;
}
