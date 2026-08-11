'use client';

import Link from 'next/link';
import { Activity, ArrowLeft, Brain, Camera, Cpu, Eye, Film, Settings as SettingsIcon, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function SettingsRow({ icon: Icon, title, desc, children }: { icon: React.ElementType; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 p-5 last:border-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5"><Icon className="h-4 w-4 text-muted-foreground" /></div>
        <div><div className="text-sm font-semibold">{title}</div><div className="mt-1 text-xs text-muted-foreground">{desc}</div></div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button></Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-racing-red"><Activity className="h-4 w-4 text-white" /></div>
              <span className="text-sm font-bold tracking-widest">TRACKPULSE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        </div>

        <div className="glass-card overflow-hidden">
          <SettingsRow icon={Brain} title="AI Model" desc="The vision model used for track classification is configured on the backend.">
            <Badge variant="outline" className="border-racing-red/30 bg-racing-red/10 text-racing-red">Configured via HF_VISION_MODEL</Badge>
          </SettingsRow>
          <SettingsRow icon={Cpu} title="HF Vision Model" desc="Set HF_VISION_MODEL in backend .env to select a Hugging Face model.">
            <Badge variant="outline">Backend env var</Badge>
          </SettingsRow>
          <SettingsRow icon={Shield} title="HF Token" desc="Hugging Face token is stored securely on the backend. Never exposed to frontend.">
            <Badge variant="outline" className="border-racing-green/30 bg-racing-green/10 text-racing-green">Hidden</Badge>
          </SettingsRow>
        </div>

        <div className="glass-card overflow-hidden">
          <SettingsRow icon={Film} title="Frame interval" desc="Default interval for video frame extraction.">
            <Select defaultValue="2">
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 sec</SelectItem>
                <SelectItem value="2">2 sec</SelectItem>
                <SelectItem value="5">5 sec</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow icon={Camera} title="Maximum video duration" desc="Maximum allowed video length.">
            <Badge variant="outline">60 seconds</Badge>
          </SettingsRow>
        </div>

        <div className="glass-card overflow-hidden">
          <SettingsRow icon={Zap} title="Weather integration" desc="Optional. Set WEATHER_API_KEY on backend to enable live weather data.">
            <div className="flex items-center gap-2">
              <Switch id="weather" defaultChecked={false} />
              <Label htmlFor="weather" className="text-xs text-muted-foreground">Optional</Label>
            </div>
          </SettingsRow>
          <SettingsRow icon={Eye} title="Demo mode" desc="Use synthetic data instead of live AI predictions. Clearly labelled as DEMO.">
            <div className="flex items-center gap-2">
              <Switch id="demo" defaultChecked={false} />
              <Label htmlFor="demo" className="text-xs text-muted-foreground">Toggle</Label>
            </div>
          </SettingsRow>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              All sensitive configuration (HF_TOKEN, WEATHER_API_KEY, DATABASE_URL) is stored exclusively on the backend.
              The frontend never receives or transmits these values.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
