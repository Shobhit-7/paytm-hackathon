import { CloudSun, Flag, MapPin, Timer } from 'lucide-react';
import { RaceStatus as RaceStatusType } from '@/types/analysis';

export function RaceStatus({ race }: { race: RaceStatusType }) {
  const items = [{ icon: Flag, label: 'Race', value: race.race_name }, { icon: MapPin, label: 'Track', value: race.track_name }, { icon: Timer, label: 'Lap', value: `${race.lap} / ${race.total_laps}` }, { icon: CloudSun, label: 'Weather', value: `${race.weather_temp}°C` }];
  return <div className="glass-card grid grid-cols-2 divide-white/5 md:grid-cols-4 md:divide-x">{items.map(({ icon: Icon, label, value }, index) => <div key={label} className={`flex items-center gap-3 p-4 md:px-5 ${index > 1 ? 'border-t border-white/5 md:border-t-0' : ''}`}><Icon className="h-4 w-4 text-muted-foreground" /><div className="min-w-0"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div><div className="truncate text-sm font-semibold">{value}</div></div></div>)}</div>;
}
