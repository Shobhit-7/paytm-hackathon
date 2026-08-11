'use client';

import { motion } from 'framer-motion';
import { Activity, Eye, Gauge, Sparkles } from 'lucide-react';
import { TrackCondition, CONDITION_COLORS, CONDITION_GLOW, CONDITION_TEXT_COLORS } from '@/types/analysis';
import { formatConfidence, formatTimestamp } from '@/lib/utils';

interface Props { condition: TrackCondition; confidence: number; trend: string; timestamp?: number; }

export function TrackConditionCard({ condition, confidence, trend, timestamp }: Props) {
  return (
    <motion.div layout className="glass-card relative overflow-hidden p-6 md:p-8">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-10 blur-3xl" style={{ background: CONDITION_COLORS[condition] }} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><Activity className="h-4 w-4 text-racing-red" /> Current track</div>
          <motion.div key={condition} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-5xl font-bold tracking-tight md:text-6xl ${CONDITION_TEXT_COLORS[condition]} ${CONDITION_GLOW[condition]}`}>{condition}</motion.div>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{condition === 'DRYING' ? 'Track appears to be transitioning toward a drier surface.' : condition === 'WET' ? 'Significant surface moisture detected across recent visual observations.' : condition === 'DAMP' ? 'Reduced grip likely. Surface moisture remains visible.' : 'Surface appears suitable for dry tyre consideration.'}</p>
        </div>
        <div className="hidden rounded-xl border border-white/10 bg-black/20 p-4 text-right sm:block"><Gauge className="ml-auto mb-2 h-5 w-5 text-muted-foreground" /><div className="text-2xl font-semibold">{formatConfidence(confidence)}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI confidence</div></div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-5 text-xs"><div><div className="mb-1 text-muted-foreground">Trend</div><div className="flex items-center gap-2 font-semibold"><Sparkles className="h-3.5 w-3.5 text-racing-green" />{trend}</div></div><div><div className="mb-1 text-muted-foreground">Last analyzed</div><div className="flex items-center gap-2 font-semibold"><Eye className="h-3.5 w-3.5 text-muted-foreground" />{timestamp !== undefined ? formatTimestamp(timestamp) : 'Live frame'}</div></div></div>
    </motion.div>
  );
}
