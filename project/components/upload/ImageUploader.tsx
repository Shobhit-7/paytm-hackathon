'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, ScanLine, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';

interface Props { onAnalyze: (file: File) => Promise<void>; isAnalyzing: boolean; }

type Step = 'idle' | 'ready' | 'uploading' | 'preprocessing' | 'analyzing' | 'classifying' | 'strategy' | 'done';

const STEPS: Step[] = ['uploading', 'preprocessing', 'analyzing', 'classifying', 'strategy', 'done'];
const STEP_LABELS: Record<Step, string> = { idle: '', ready: '', uploading: 'Uploading', preprocessing: 'Preprocessing', analyzing: 'AI Vision Analysis', classifying: 'Condition Classification', strategy: 'Strategy Calculation', done: 'Complete' };

export function ImageUploader({ onAnalyze, isAnalyzing }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError('File exceeds 10 MB limit.'); return; }
    setError(null);
    setFile(f);
    setStep('ready');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] }, maxFiles: 1, disabled: isAnalyzing });

  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);
    let idx = 0;
    const advance = () => { if (idx < STEPS.length) setStep(STEPS[idx++]); };
    const interval = setInterval(advance, 1200);
    try {
      advance();
      await onAnalyze(file);
      clearInterval(interval);
      setStep('done');
    } catch (e) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : 'Analysis failed');
      setStep('ready');
    }
  };

  const reset = () => { setFile(null); setPreview(null); setStep('idle'); setError(null); };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
        <div className="flex items-center gap-3"><Image className="h-4 w-4 text-racing-red" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">Upload track image</span></div>
        <span className="text-[10px] text-muted-foreground">JPG · PNG · WEBP · max 10 MB</span>
      </div>
      <div className="p-5 md:p-6">
        {!file ? (
          <div {...getRootProps()} className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${isDragActive ? 'border-racing-red bg-racing-red/10' : 'border-white/10 hover:border-racing-red/40 hover:bg-white/[0.02]'}`}>
            <input {...getInputProps()} />
            <Image className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{isDragActive ? 'Drop image here' : 'Drag & drop or click to select'}</p>
            <p className="mt-1 text-[10px] text-muted-foreground/60">JPG, JPEG, PNG, WEBP</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              {preview && <img src={preview} alt="Track preview" className="max-h-56 w-full object-cover" />}
              <button onClick={reset} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 hover:bg-black/90"><X className="h-3.5 w-3.5" /></button>
            </div>
            <div className="flex items-center justify-between text-xs"><span className="truncate pr-4 text-muted-foreground">{file.name}</span><span className="shrink-0 text-muted-foreground">{formatFileSize(file.size)}</span></div>
            {step !== 'idle' && step !== 'ready' && (
              <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                {STEPS.slice(0, -1).map((s, i) => {
                  const current = STEPS.indexOf(step);
                  const done = i < current;
                  const active = STEPS[i] === step;
                  return <div key={s} className={`flex items-center gap-3 text-xs transition-opacity ${done ? 'opacity-100' : active ? 'opacity-100' : 'opacity-30'}`}><div className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-racing-green' : active ? 'bg-racing-red' : 'bg-muted'}`} /><span className={active ? 'text-white' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'}>{STEP_LABELS[s]}</span>{active && <div className="ml-auto flex gap-1">{[0,1,2].map(d => <div key={d} className="h-1 w-1 rounded-full bg-racing-red" style={{ animation: `pulse 1s ${d * 0.2}s infinite` }} />)}</div>}</div>;
                })}
              </div>
            )}
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">{error}</div>}
            <Button onClick={handleAnalyze} disabled={isAnalyzing || step === 'done'} className="w-full gap-2 bg-racing-red text-white hover:bg-racing-red/90">
              <ScanLine className="h-4 w-4" />{step === 'done' ? 'Analysis complete' : isAnalyzing ? 'Analyzing...' : 'Analyze track'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
