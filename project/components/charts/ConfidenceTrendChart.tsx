'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Probabilities, CONDITION_COLORS, TrackCondition } from '@/types/analysis';

interface Props { probabilities: Probabilities; }

export function ConfidenceTrendChart({ probabilities }: Props) {
  const data: { name: TrackCondition; value: number; color: string }[] = [
    { name: 'DRY', value: probabilities.DRY, color: CONDITION_COLORS.DRY },
    { name: 'DAMP', value: probabilities.DAMP, color: CONDITION_COLORS.DAMP },
    { name: 'WET', value: probabilities.WET, color: CONDITION_COLORS.WET },
    { name: 'DRYING', value: probabilities.DRYING, color: CONDITION_COLORS.DRYING },
  ];

  return (
    <div className="glass-card p-5">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Condition probabilities
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 1]} tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff' }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
