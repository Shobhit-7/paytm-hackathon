'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { TrackCondition, TrendDirection, CONDITION_COLORS, CONDITION_TEXT_COLORS } from '@/types/analysis';
import { getTrendColor } from '@/lib/utils';

interface Props { condition: TrackCondition; trend: TrendDirection; confidence: number; explanation?: string; }

export function FrameAnalysis({ condition, trend, confidence, explanation }: Props) {
  return <div className="glass-card overflow-hidden"><div className="flex items-center gap-3 border-b border-white/5 bg-white/[0.02] px-5 py-4"><BrainCircuit className="h-4 w-4 text-racing-red" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">AI Track Insight</span><span className="ml-auto rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Decision support</span></div><div className="p-5 md:p-6"><AnimatePresence mode="wait"><motion.div key={condition + trend} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${CONDITION_COLORS[condition]}22`, border: `1px solid ${CONDITION_COLORS[condition]}44` }}>{trend === 'IMPROVING' ? <TrendingUp className="h-5 w-5" style={{ color: CONDITION_COLORS[condition] }} /> : trend === 'WORSENING' ? <TrendingDown className="h-5 w-5" style={{ color: CONDITION_COLORS[condition] }} /> : <Sparkles className="h-5 w-5" style={{ color: CONDITION_COLORS[condition] }} />}</div><div><p className="text-sm font-semibold leading-6 text-white">{explanation || `Track condition is ${condition.toLowerCase()}.`}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{`Visual analysis detected track in ${condition} state. Trend: ${trend}.`}</p></div></div><div className="mt-5 flex items-center gap-4 border-t border-white/5 pt-5 text-xs"><span className="text-muted-foreground">Trend</span><span className={`font-bold ${getTrendColor(trend)}`}>{trend}</span><span className="ml-auto text-muted-foreground">Vision confidence</span><span className="font-semibold">{Math.round(confidence * 100)}%</span></div></motion.div></AnimatePresence></div></div>;
}
