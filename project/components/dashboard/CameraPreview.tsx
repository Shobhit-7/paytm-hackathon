'use client';

import { Camera, Circle, Maximize2, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { imageUrl?: string; onAnalyze?: () => void; isAnalyzing?: boolean; }

export function CameraPreview({ imageUrl, onAnalyze, isAnalyzing }: Props) {
  return <div className="glass-card scan-line relative min-h-[320px] overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black">{imageUrl ? <img src={imageUrl} alt="Uploaded track preview" className="h-full w-full object-cover opacity-80" /> : <div className="racing-grid-bg flex h-full items-center justify-center"><div className="text-center text-muted-foreground"><Camera className="mx-auto mb-3 h-10 w-10 opacity-40" /><div className="text-xs uppercase tracking-[0.2em]">No track frame loaded</div><div className="mt-2 text-[10px] opacity-60">Upload an image to begin visual assessment</div></div></div>}</div><div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4"><div className="flex items-center gap-2 text-xs font-semibold"><Circle className="h-2.5 w-2.5 fill-racing-red text-racing-red" /> TRACK CAMERA <span className="font-normal text-muted-foreground">/ CAMERA 01</span></div><Maximize2 className="h-4 w-4 text-white/60" /></div><div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-4"><div className="text-[10px] uppercase tracking-wider text-white/70">Trackside · Sector 2</div>{onAnalyze && <Button size="sm" onClick={onAnalyze} disabled={isAnalyzing} className="gap-2 bg-racing-red hover:bg-racing-red/90"><ScanLine className="h-3.5 w-3.5" />{isAnalyzing ? 'Analyzing...' : 'Analyze frame'}</Button>}</div></div>;
}
