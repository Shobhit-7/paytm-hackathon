'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Film, Loader2, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatFileSize } from '@/lib/utils';

interface Props {
  onAnalyze: (file: File, interval: number) => Promise<void>;
  isAnalyzing: boolean;
}

export function VideoUploader({ onAnalyze, isAnalyzing }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [interval, setIntervalSec] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 100 * 1024 * 1024) {
      setError('File exceeds 100 MB limit.');
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/mp4': [], 'video/quicktime': [], 'video/webm': [] },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);
    try {
      await onAnalyze(file, interval);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Video analysis failed');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
        <div className="flex items-center gap-3">
          <Film className="h-4 w-4 text-racing-red" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Analyze track video</span>
        </div>
        <span className="text-[10px] text-muted-foreground">MP4 · MOV · WEBM · max 100 MB · 60s</span>
      </div>
      <div className="p-5 md:p-6">
        {!file ? (
          <div
            {...getRootProps()}
            className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDragActive ? 'border-racing-red bg-racing-red/10' : 'border-white/10 hover:border-racing-red/40 hover:bg-white/[0.02]'
            }`}
          >
            <input {...getInputProps()} />
            <Film className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{isDragActive ? 'Drop video here' : 'Drag & drop or click to select'}</p>
            <p className="mt-1 text-[10px] text-muted-foreground/60">MP4, MOV, WEBM — max 60 seconds</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              {preview && (
                <video src={preview} className="max-h-56 w-full object-contain" controls />
              )}
              <button
                onClick={reset}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 hover:bg-black/90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="truncate pr-4 text-muted-foreground">{file.name}</span>
              <span className="shrink-0 text-muted-foreground">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Frame interval</span>
              <Select value={String(interval)} onValueChange={(v) => setIntervalSec(Number(v))}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 sec</SelectItem>
                  <SelectItem value="2">2 sec</SelectItem>
                  <SelectItem value="5">5 sec</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                {error}
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full gap-2 bg-racing-red text-white hover:bg-racing-red/90"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isAnalyzing ? 'Processing frames...' : 'Analyze video'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
