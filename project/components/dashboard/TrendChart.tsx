'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FramePrediction } from '@/types/analysis';
import { formatTimestamp } from '@/lib/utils';

interface TrendChartProps { frames: FramePrediction[]; compact?: boolean; }

export function TrendChart({ frames, compact = false }: TrendChartProps) {
  const data = frames.map((frame) => ({ ...frame, time: formatTimestamp(frame.timestamp), wetness: frame.wetness_score }));
  return (
    <div className={compact ? 'h-40' : 'h-72'}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff' }} formatter={(value: number, _name: string, item) => [`${value.toFixed(2)} · ${item.payload.condition}`, 'Wetness']} labelFormatter={(label) => `Time ${label}`} />
          <Line type="monotone" dataKey="wetness" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', stroke: '#111', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#fff', stroke: '#ef4444', strokeWidth: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
