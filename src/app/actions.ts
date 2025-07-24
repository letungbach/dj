'use server';

import { detectBPM, type DetectBPMOutput } from '@/ai/flows/detect-bpm';
import { detectMelodicKey, type DetectMelodicKeyOutput } from '@/ai/flows/detect-melodic-key';
import { suggestHotCues, type SuggestHotCuesOutput } from '@/ai/flows/suggest-hot-cues';
import { analyzeTrackEnergy, type AnalyzeTrackEnergyOutput } from '@/ai/flows/analyze-track-energy';

export interface AnalysisResult {
  bpm: DetectBPMOutput;
  key: DetectMelodicKeyOutput;
  cues: SuggestHotCuesOutput;
  energy: AnalyzeTrackEnergyOutput;
}

export async function analyzeAudio(audioDataUri: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  try {
    const [bpmResult, keyResult, cuesResult, energyResult] = await Promise.all([
      detectBPM({ audioDataUri }),
      detectMelodicKey({ audioDataUri }),
      suggestHotCues({ audioDataUri }),
      analyzeTrackEnergy({ audioDataUri }),
    ]);

    // Basic validation to ensure objects are returned
    if (!bpmResult || !keyResult || !cuesResult || !energyResult) {
      throw new Error("One or more analysis models returned an empty result.");
    }

    return {
      data: { 
        bpm: bpmResult, 
        key: keyResult, 
        cues: cuesResult, 
        energy: energyResult 
      },
      error: null,
    };
  } catch (e) {
    console.error('Audio analysis failed:', e);
    const message = e instanceof Error ? e.message : 'An unexpected error occurred during analysis.';
    return { data: null, error: `Analysis failed: ${message}. Please check the file and try again.` };
  }
}
