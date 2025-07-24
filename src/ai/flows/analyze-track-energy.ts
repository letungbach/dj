'use server';

/**
 * @fileOverview A flow to analyze the energy level of a track.
 *
 * - analyzeTrackEnergy - A function that analyzes the energy level of a track.
 * - AnalyzeTrackEnergyInput - The input type for the analyzeTrackEnergy function.
 * - AnalyzeTrackEnergyOutput - The return type for the analyzeTrackEnergy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrackEnergyInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file (FLAC or WAV) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeTrackEnergyInput = z.infer<typeof AnalyzeTrackEnergyInputSchema>;

const AnalyzeTrackEnergyOutputSchema = z.object({
  energyLevel: z
    .string()
    .describe("The energy level of the track (e.g., 'low', 'medium', 'high')."),
  description: z
    .string()
    .describe("A description of the track's energy and how it might be used in a DJ set."),
});
export type AnalyzeTrackEnergyOutput = z.infer<typeof AnalyzeTrackEnergyOutputSchema>;

export async function analyzeTrackEnergy(input: AnalyzeTrackEnergyInput): Promise<AnalyzeTrackEnergyOutput> {
  return analyzeTrackEnergyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTrackEnergyPrompt',
  input: {schema: AnalyzeTrackEnergyInputSchema},
  output: {schema: AnalyzeTrackEnergyOutputSchema},
  prompt: `You are an expert music analyst specializing in determining music characteristics for DJs.

You will analyze the track and assess its energy level.
Consider the tempo, intensity, and overall vibe of the song.  Provide a description of the track's energy, and describe how the track might be used in a DJ set.

Audio: {{media url=audioDataUri}}
`,
});

const analyzeTrackEnergyFlow = ai.defineFlow(
  {
    name: 'analyzeTrackEnergyFlow',
    inputSchema: AnalyzeTrackEnergyInputSchema,
    outputSchema: AnalyzeTrackEnergyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
