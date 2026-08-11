'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUp, Droplets, Gauge, Minus, Timer, TrendingUp } from 'lucide-react';
import { TrackCondition, TrendDirection, CONDITION_COLORS, CONDITION_TEXT_COLORS, TYRE_SUGGESTIONS } from '@/types/analysis';
import { formatConfidence, getTrendColor } from '@/lib/utils';

interface MetricCardProps { title: string; value: string; sub?: string; color?: string; highlight?: 'condition' | 'trend'; }

export function MetricCard({ title, value, sub, color, highlight }: MetricCardProps) {
  return <div className="glass-card-hover flex flex-col p-4 md:p-5"><div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</div><div className="mt-auto"><div className="text-xl font-bold leading-none md:text-2xl" style={color ? { color } : undefined}>{value}</div>{sub && <div className="mt-2 text-xs text-muted-foreground">{sub}</div>}</div></div>;
}

interface DashboardMetricsProps {
  condition: TrackCondition;
  confidence: number;
  wetnessScore: number;
  trend: TrendDirection;
  rainRisk?: number;
}

export function DashboardMetrics({ condition, confidence, wetnessScore, trend, rainRisk = 38 }: DashboardMetricsProps) {
  const cards = [
    { title: 'Current condition', value: condition, sub: `${formatConfidence(confidence)} confidence`, color: CONDITION_COLORS[condition] },
    { title: 'Track grip (est.)', value: `${Math.round((1 - wetnessScore) * 100)}%`, sub: 'Estimated available' },
    { title: 'Rain risk', value: `${rainRisk}%`, sub: 'Next 10 min' },
    { title: 'Condition trend', value: trend, sub: getTrendSub(trend), color: getTrendHexColor(trend) },
    { title: 'Tyre window', value: TYRE_SUGGESTIONS[condition], sub: 'AI suggests' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {cards.map((c) => (
        <motion.div key={c.title} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover flex flex-col p-4 md:p-5">
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{c.title}</div>
          <div className="mt-auto"><div className="truncate text-lg font-bold leading-none md:text-xl" style={c.color ? { color: c.color } : undefined}>{c.value}</div>{c.sub && <div className="mt-2 text-[10px] text-muted-foreground">{c.sub}</div>}</div>
        </motion.div>
      ))}
    </div>
  );
}

function getTrendSub(trend: TrendDirection): string {
  switch (trend) {
    case 'IMPROVING': return 'Track drying';
    case 'WORSENING': return 'Getting wetter';
    case 'STABLE': return 'No change detected';
    default: return 'Insufficient data';
  }
}

function getTrendHexColor(trend: TrendDirection): string {
  switch (trend) {
    case 'IMPROVING': return '#22c55e';
    case 'WORSENING': return '#ef4444';
    default: return '#737373';
  }
}
