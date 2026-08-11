import { TrackCondition, TrendDirection } from '@/types/analysis';

export function cn(...classes: (string | false | undefined | null | Record<string, boolean>)[]): string {
  return classes
    .flatMap((c) => {
      if (!c || typeof c === 'string') return c ? [c] : [];
      if (typeof c === 'object') {
        return Object.entries(c).filter(([, v]) => v).map(([k]) => k);
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function formatTimestamp(ts: string | number): string {
  if (typeof ts === 'number') {
    const mins = Math.floor(ts / 60);
    const secs = Math.floor(ts % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  const date = new Date(ts);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDate(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(ts: string): string {
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function getWetnessScore(condition: TrackCondition): number {
  const scores: Record<TrackCondition, number> = {
    WET: 1.0,
    DAMP: 0.7,
    DRYING: 0.4,
    DRY: 0.1,
  };
  return scores[condition] ?? 0.5;
}

export function calculateTrendFromFrames(
  conditions: { condition: TrackCondition; wetness_score: number }[]
): { trend: TrendDirection; changeRate: number } {
  if (conditions.length < 2) {
    return { trend: 'UNCERTAIN', changeRate: 0 };
  }

  const scores = conditions.map((c) =>
    c.wetness_score !== undefined ? c.wetness_score : getWetnessScore(c.condition)
  );

  const recentN = Math.min(4, scores.length);
  const recent = scores.slice(-recentN);
  const earlier = scores.slice(0, Math.max(1, scores.length - recentN));

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

  const changeRate = recentAvg - earlierAvg;
  const threshold = 0.08;

  if (Math.abs(changeRate) < threshold) {
    return { trend: 'STABLE', changeRate };
  }
  return {
    trend: changeRate < 0 ? 'IMPROVING' : 'WORSENING',
    changeRate,
  };
}

export function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case 'IMPROVING':
      return 'text-racing-green';
    case 'WORSENING':
      return 'text-racing-red';
    case 'STABLE':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
}

export function getTrendIcon(trend: TrendDirection): string {
  switch (trend) {
    case 'IMPROVING':
      return 'TrendingUp';
    case 'WORSENING':
      return 'TrendingDown';
    case 'STABLE':
      return 'Minus';
    default:
      return 'HelpCircle';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
