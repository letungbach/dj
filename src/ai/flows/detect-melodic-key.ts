'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting the melodic key of an audio track.
 *
 * - detectMelodicKey - A function that takes audio data and returns the detected melodic key.
 * - DetectMelodicKeyInput - The input type for the detectMelodicKey function.
 * - DetectMelodicKeyOutput - The return type for the detectMelodicKey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMelodicKeyInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type DetectMelodicKeyInput = z.infer<typeof DetectMelodicKeyInputSchema>;

const DetectMelodicKeyOutputSchema = z.object({
  key: z.string().describe('The detected melodic key of the audio track.'),
  confidence: z
    .number()
    .describe('The confidence level of the key detection (0-1).'),
  possibleHarmonicKeys: z
    .array(z.string())
    .describe(
      'Possible harmonic keys that could follow this song, based on the Circle of Fifths.'
    ),
});
export type DetectMelodicKeyOutput = z.infer<typeof DetectMelodicKeyOutputSchema>;

export async function detectMelodicKey(
  input: DetectMelodicKeyInput
): Promise<DetectMelodicKeyOutput> {
  return detectMelodicKeyFlow(input);
}

const detectMelodicKeyPrompt = ai.definePrompt({
  name: 'detectMelodicKeyPrompt',
  input: {schema: DetectMelodicKeyInputSchema},
  output: {schema: DetectMelodicKeyOutputSchema},
  prompt: `You are a DJ assistant that analyzes music and gives information on the melodic key of a song.

  Analyze the provided audio data and identify its melodic key, confidence, and possible harmonic keys.
  Return the information as JSON.

  Audio Data: {{media url=audioDataUri}}
  Possible harmonic keys must follow Circle of Fifth Harmonic Law.
  `,
});

const detectMelodicKeyFlow = ai.defineFlow(
  {
    name: 'detectMelodicKeyFlow',
    inputSchema: DetectMelodicKeyInputSchema,
    outputSchema: DetectMelodicKeyOutputSchema,
  },
  async input => {
    const {output} = await detectMelodicKeyPrompt(input);
    return output!;
  }
);
