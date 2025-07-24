import { config } from 'dotenv';
config();

import '@/ai/flows/detect-bpm.ts';
import '@/ai/flows/detect-melodic-key.ts';
import '@/ai/flows/suggest-hot-cues.ts';
import '@/ai/flows/analyze-track-energy.ts';