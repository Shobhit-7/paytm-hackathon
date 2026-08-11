'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Brain,
  Camera,
  ChevronRight,
  Clock,
  CloudRain,
  Gauge,
  LineChart,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Wind,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TrackCondition,
  CONDITION_COLORS,
  CONDITION_TEXT_COLORS,
  CONDITION_GLOW,
} from '@/types/analysis';

const CONDITIONS: { condition: TrackCondition; desc: string }[] = [
  { condition: 'DRY', desc: 'Surface is clear. Slick conditions viable.' },
  { condition: 'DAMP', desc: 'Light moisture. Reduced grip detected.' },
  { condition: 'WET', desc: 'Significant water. Wet tyre territory.' },
  { condition: 'DRYING', desc: 'Transition phase. Monitor closely.' },
];

const FEATURES = [
  { icon: Brain, title: 'AI-Powered', desc: 'Hugging Face vision models classify track surface conditions from visual data.' },
  { icon: Camera, title: 'Vision Analysis', desc: 'Upload images or video. Frames are extracted and analyzed frame-by-frame.' },
  { icon: LineChart, title: 'Real-time Trends', desc: 'Wetness scores tracked over time to detect improving or worsening conditions.' },
  { icon: TrendingUp, title: 'Strategy Windows', desc: 'Deterministic tyre recommendations based on detected condition transitions.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-racing-red">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-widest">TRACKPULSE</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xs">Dashboard</Button>
            </Link>
            <Link href="/dashboard?demo=true">
              <Button size="sm" className="gap-1.5 bg-racing-red text-white hover:bg-racing-red/90">
                <PlayCircle className="h-3.5 w-3.5" /> Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 racing-grid-bg opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-racing-red/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-racing-red" />
            Powered by Hugging Face
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl font-bold tracking-tighter md:text-8xl"
          >
            TRACK<span className="text-racing-red text-glow-red">PULSE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg font-medium text-white/80 md:text-xl"
          >
            AI Track Condition Intelligence
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Detect changing track conditions before the weather report catches up.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-2 text-xs text-muted-foreground/70"
          >
            AI-powered visual analysis for real-time racing tyre strategy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-racing-red text-white hover:bg-racing-red/90">
                Start Track Analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard?demo=true">
              <Button size="lg" variant="outline" className="gap-2 border-white/20">
                <PlayCircle className="h-4 w-4" /> Try Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Condition Cards */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Four Track Conditions. One Vision Pipeline.
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            Every frame is classified into one of four surface states.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONDITIONS.map(({ condition, desc }, i) => (
              <motion.div
                key={condition}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card-hover relative overflow-hidden p-6"
              >
                <div
                  className="absolute right-0 top-0 h-24 w-24 rounded-full opacity-10 blur-2xl"
                  style={{ background: CONDITION_COLORS[condition] }}
                />
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CONDITION_COLORS[condition], boxShadow: `0 0 12px ${CONDITION_COLORS[condition]}` }}
                  />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Condition</span>
                </div>
                <div className={`text-3xl font-bold ${CONDITION_TEXT_COLORS[condition]} ${CONDITION_GLOW[condition]}`}>
                  {condition}
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Built for Race Engineers
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card-hover p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-racing-red/10">
                  <Icon className="h-5 w-5 text-racing-red" />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">
            From Track Surface to Tyre Strategy
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { icon: Camera, step: '01', title: 'Capture', desc: 'Upload a trackside image or short video clip.' },
              { icon: Brain, step: '02', title: 'Classify', desc: 'AI vision model classifies surface as DRY, DAMP, WET, or DRYING.' },
              { icon: TrendingUp, step: '03', title: 'Trend', desc: 'Wetness scores tracked across frames to detect direction.' },
              { icon: Gauge, step: '04', title: 'Strategy', desc: 'Deterministic tyre recommendation based on condition + trend.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="glass-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Icon className="h-5 w-5 text-racing-red" />
                  <span className="text-xs font-mono text-muted-foreground/50">{step}</span>
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            See the track. Predict the window. Race smarter.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            TrackPulse provides AI-assisted visual track assessment for decision support. It does not guarantee track conditions or tyre strategy outcomes.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-8 gap-2 bg-racing-red text-white hover:bg-racing-red/90">
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-racing-red">
              <Activity className="h-3 w-3 text-white" />
            </div>
            TRACKPULSE
          </div>
          <div className="text-xs text-muted-foreground/60">
            AI Track Condition Intelligence · Hackathon Prototype
          </div>
        </div>
      </footer>
    </div>
  );
}
