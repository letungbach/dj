'use server';
/**
 * @fileOverview AI flow for suggesting hot cue points in a song.
 *
 * - suggestHotCues - A function that suggests hot cue points for a given audio file.
 * - SuggestHotCuesInput - The input type for the suggestHotCues function.
 * - SuggestHotCuesOutput - The return type for the suggestHotCues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHotCuesInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file (FLAC or WAV) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestHotCuesInput = z.infer<typeof SuggestHotCuesInputSchema>;

const SuggestHotCuesOutputSchema = z.object({
  intro: z.number().describe('Suggested start time in seconds for the intro.'),
  build: z.number().describe('Suggested start time in seconds for the build.'),
  drop: z.number().describe('Suggested start time in seconds for the drop.'),
  breakdown: z
    .number()
    .describe('Suggested start time in seconds for the breakdown.'),
  outro: z.number().describe('Suggested start time in seconds for the outro.'),
});
export type SuggestHotCuesOutput = z.infer<typeof SuggestHotCuesOutputSchema>;

export async function suggestHotCues(input: SuggestHotCuesInput): Promise<SuggestHotCuesOutput> {
  return suggestHotCuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHotCuesPrompt',
  input: {schema: SuggestHotCuesInputSchema},
  output: {schema: SuggestHotCuesOutputSchema},
  prompt: `You are an expert DJ assistant that helps DJs find good hot cue points in songs.

  Analyze the song and suggest intro, build, drop, breakdown, and outro points.

  Return times in seconds.

  Audio file: {{media url=audioDataUri}}`,
});

const suggestHotCuesFlow = ai.defineFlow(
  {
    name: 'suggestHotCuesFlow',
    inputSchema: SuggestHotCuesInputSchema,
    outputSchema: SuggestHotCuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
