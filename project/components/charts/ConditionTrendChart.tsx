'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts';
import { FramePrediction, CONDITION_COLORS } from '@/types/analysis';
import { formatTimestamp } from '@/lib/utils';

interface Props { frames: FramePrediction[]; }

export function ConditionTrendChart({ frames }: Props) {
  const data = frames.map((f) => ({
    time: formatTimestamp(f.timestamp),
    wetness: f.wetness_score,
    condition: f.condition,
    confidence: f.confidence,
  }));

  return (
    <div className="glass-card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Track condition trend</div>
          <div className="mt-1 text-sm text-muted-foreground">Wetness score over time</div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff' }}
              formatter={(value: number, _name: string, item) => [
                `${value.toFixed(2)} · ${item.payload.condition} · ${Math.round(item.payload.confidence * 100)}%`,
                'Wetness',
              ]}
              labelFormatter={(label) => `Time ${label}`}
            />
            <ReferenceArea y1={0} y2={0.25} fill="#22c55e" fillOpacity={0.03} />
            <ReferenceArea y1={0.25} y2={0.55} fill="#eab308" fillOpacity={0.03} />
            <ReferenceArea y1={0.55} y2={0.85} fill="#f97316" fillOpacity={0.03} />
            <ReferenceArea y1={0.85} y2={1} fill="#3b82f6" fillOpacity={0.03} />
            <Line type="monotone" dataKey="wetness" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', stroke: '#111', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#fff', stroke: '#ef4444', strokeWidth: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
