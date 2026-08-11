'use client';

import { useState } from 'react';
import { CloudRain, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WeatherData } from '@/types/analysis';

interface Props {
  onSave: (weather: WeatherData) => Promise<void>;
  initial?: WeatherData;
}

export function WeatherInput({ onSave, initial }: Props) {
  const [weather, setWeather] = useState<WeatherData>(
    initial || { temperature: 24, humidity: 78, rain_probability: 42, wind_speed: 12, track_temperature: 31 }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(weather);
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof WeatherData; label: string; unit: string }[] = [
    { key: 'temperature', label: 'Air temperature', unit: '°C' },
    { key: 'humidity', label: 'Humidity', unit: '%' },
    { key: 'rain_probability', label: 'Rain probability', unit: '%' },
    { key: 'wind_speed', label: 'Wind speed', unit: ' km/h' },
    { key: 'track_temperature', label: 'Track temperature', unit: '°C' },
  ];

  return (
    <div className="glass-card p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <CloudRain className="h-4 w-4 text-racing-blue" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">Manual weather input</span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {fields.map(({ key, label, unit }) => (
          <div key={key}>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
            <div className="mt-1.5 flex items-center">
              <Input
                type="number"
                value={weather[key] ?? 0}
                onChange={(e) => setWeather({ ...weather, [key]: Number(e.target.value) })}
                className="pr-10"
              />
              <span className="ml-[-32px] text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving} className="mt-5 gap-2" variant="outline">
        <Save className="h-3.5 w-3.5" />
        {saving ? 'Saving...' : 'Save weather data'}
      </Button>
    </div>
  );
}
