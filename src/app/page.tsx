'use client';

import { useState, useTransition, useCallback, ChangeEvent, DragEvent } from 'react';
import { analyzeAudio, type AnalysisResult } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  UploadCloud,
  FileAudio,
  Loader2,
  Gauge,
  KeyRound,
  RadioTower,
  Zap,
  Music,
  AlertCircle,
  X,
} from 'lucide-react';

const fileToDataUri = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
};

const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(/[:.]/);
    if (parts.length === 3) {
      const [mins, secs, ms] = parts.map(Number);
      return (mins * 60) + secs + (ms / 100);
    }
    const numericValue = parseFloat(timeStr);
    return isNaN(numericValue) ? 0 : numericValue;
};

export default function DJIntelligencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [editableResults, setEditableResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type === 'audio/wav' || selectedFile.type === 'audio/flac') {
        setFile(selectedFile);
        setError(null);
        setResults(null);
        setEditableResults(null);
      } else {
        setError('Invalid file type. Please upload a WAV or FLAC file.');
        setFile(null);
      }
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setError(null);

    startTransition(async () => {
      try {
        const audioDataUri = await fileToDataUri(file);
        const response = await analyzeAudio(audioDataUri);
        if (response.error) {
          setError(response.error);
          toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: response.error,
          });
        } else if (response.data) {
          setResults(response.data);
          setEditableResults(JSON.parse(JSON.stringify(response.data))); // Deep copy for editing
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      }
    });
  };

  const handleResultChange = <T extends keyof AnalysisResult, K extends keyof AnalysisResult[T]>(
    category: T,
    field: K,
    value: any
  ) => {
    if (!editableResults) return;
    setEditableResults((prev) => {
      if (!prev) return null;
      const newResults = { ...prev };
      (newResults[category] as any)[field] = value;
      return newResults;
    });
  };

  const resetState = () => {
    setFile(null);
    setResults(null);
    setEditableResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-headline font-bold tracking-tighter text-primary">DJ Intelligence</h1>
        </div>
        <p className="text-lg text-muted-foreground">Your AI-powered assistant for track preparation.</p>
      </header>

      <main className="w-full max-w-5xl flex-grow">
        {!file ? (
          <FileUploadZone onFileChange={handleFileChange} error={error} />
        ) : (
          <div className="space-y-6">
            <FilePreviewCard file={file} onAnalyze={handleAnalyze} isPending={isPending} onClear={resetState} />
            {error && !isPending && <ErrorAlert message={error} />}
            {isPending && <AnalysisSkeletons />}
            {editableResults && !isPending && (
              <AnalysisDashboard results={editableResults} onResultChange={handleResultChange} />
            )}
          </div>
        )}
      </main>

      <footer className="w-full max-w-5xl mt-12 text-center text-muted-foreground text-sm">
        <p>Built with Firebase and Genkit. All processing is done securely in the cloud.</p>
      </footer>
    </div>
  );
}

function FileUploadZone({
  onFileChange,
  error,
}: {
  onFileChange: (file: File | null) => void;
  error: string | null;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <Card className="shadow-2xl shadow-primary/10">
      <CardContent
        className="p-6"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors duration-300 ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2 font-headline">Drop your track here</h3>
          <p className="text-muted-foreground mb-4">or click to browse</p>
          <Button asChild variant="secondary">
            <label htmlFor="file-upload">
              Select File
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept=".wav,.flac,audio/wav,audio/flac"
                onChange={handleFileSelect}
              />
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Supports FLAC & WAV files</p>
        </div>
        {error && <ErrorAlert message={error} className="mt-4" />}
      </CardContent>
    </Card>
  );
}

function FilePreviewCard({
  file,
  onAnalyze,
  isPending,
  onClear,
}: {
  file: File;
  onAnalyze: () => void;
  isPending: boolean;
  onClear: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 truncate">
          <FileAudio className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="truncate">
            <p className="font-semibold truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onAnalyze} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Track'
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClear} disabled={isPending}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorAlert({ message, className }: { message: string, className?: string }) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function AnalysisSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AnalysisDashboard({
  results,
  onResultChange,
}: {
  results: AnalysisResult;
  onResultChange: <T extends keyof AnalysisResult, K extends keyof AnalysisResult[T]>(
    category: T,
    field: K,
    value: any
  ) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in-50 duration-500">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Gauge className="text-primary" />
            BPM
          </CardTitle>
          <CardDescription>Beats Per Minute of the track.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            className="text-2xl font-bold h-14"
            value={results.bpm.bpm.toFixed(2)}
            onChange={(e) => onResultChange('bpm', 'bpm', parseFloat(e.target.value))}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Zap className="text-primary" />
            Energy
          </CardTitle>
          <CardDescription>The detected energy level and vibe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            className="text-lg font-semibold capitalize"
            value={results.energy.energyLevel}
            onChange={(e) => onResultChange('energy', 'energyLevel', e.target.value)}
          />
          <p className="text-sm text-muted-foreground">{results.energy.description}</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <KeyRound className="text-primary" />
            Melodic Key
          </CardTitle>
          <CardDescription>Harmonic information for mixing.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Detected Key</Label>
            <Input className="font-bold text-lg" value={results.key.key} onChange={(e) => onResultChange('key', 'key', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Confidence</Label>
            <Input
              className="font-bold text-lg"
              value={`${(results.key.confidence * 100).toFixed(0)}%`}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>Harmonically Compatible Keys</Label>
            <div className="flex flex-wrap gap-2 pt-2">
              {results.key.possibleHarmonicKeys.map((k) => (
                <Badge key={k} variant="secondary">
                  {k}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <RadioTower className="text-primary" />
            Hot Cues
          </CardTitle>
          <CardDescription>Suggested cue points based on song structure.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(Object.keys(results.cues) as Array<keyof typeof results.cues>).map((cue) => (
            <div className="space-y-1" key={cue}>
              <Label className="capitalize text-muted-foreground">{cue}</Label>
              <Input
                type="text"
                value={formatTime(results.cues[cue])}
                onChange={(e) => onResultChange('cues', cue, parseTime(e.target.value))}
                onBlur={(e) => {
                  const numericValue = parseTime(e.currentTarget.value);
                  e.currentTarget.value = formatTime(numericValue);
                  onResultChange('cues', cue, numericValue);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
