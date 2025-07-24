'use server';
/**
 * @fileOverview Detects the BPM of an audio track.
 *
 * - detectBPM - A function that handles the BPM detection process.
 * - DetectBPMInput - The input type for the detectBPM function.
 * - DetectBPMOutput - The return type for the detectBPM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBPMInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file (FLAC or WAV), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectBPMInput = z.infer<typeof DetectBPMInputSchema>;

const DetectBPMOutputSchema = z.object({
  bpm: z.number().describe('The detected BPM (Beats Per Minute) of the audio track.'),
});
export type DetectBPMOutput = z.infer<typeof DetectBPMOutputSchema>;

export async function detectBPM(input: DetectBPMInput): Promise<DetectBPMOutput> {
  return detectBPMFlow(input);
}

const detectBPMPrompt = ai.definePrompt({
  name: 'detectBPMPrompt',
  input: {schema: DetectBPMInputSchema},
  output: {schema: DetectBPMOutputSchema},
  prompt: `You are an expert audio analyst. Your task is to analyze the given audio track and determine its BPM (Beats Per Minute).

  Analyze the following audio file to extract the BPM:
  Audio: {{media url=audioDataUri}}

  Return ONLY a floating point number representing the BPM, do not include any other text or explanation.`,
});

const detectBPMFlow = ai.defineFlow(
  {
    name: 'detectBPMFlow',
    inputSchema: DetectBPMInputSchema,
    outputSchema: DetectBPMOutputSchema,
  },
  async input => {
    const {output} = await detectBPMPrompt(input);
    return output!;
  }
);
