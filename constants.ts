// FIX: Implemented constants file with prompt options for the UI.
import { PromptType } from './types';

interface PromptTypeOption {
  value: PromptType;
  label: string;
  icon: string;
  description: string;
}

export const PROMPT_TYPE_OPTIONS: PromptTypeOption[] = [
  {
    value: PromptType.SUMMARY,
    label: 'Summary',
    icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5', // Bars 3
    description: "Get a concise overview of the video's main points.",
  },
  {
    value: PromptType.TRANSCRIPT,
    label: 'Transcript',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', // Document text
    description: 'Generate a full, word-for-word text version of the video.',
  },
  {
    value: PromptType.DEEP_DIVE,
    label: 'Deep Dive',
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z', // Magnifying glass
    description: "Get a detailed, structured analysis of the video's topic, arguments, and tone.",
  },
  {
    value: PromptType.KEY_POINTS,
    label: 'Key Points',
    icon: 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12', // Clipboard with check
    description: 'Extract the most important takeaways and insights as a bulleted list.',
  },
  {
    value: PromptType.QUIZ,
    label: 'Quiz',
    icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z', // Question mark circle
    description: 'Create an interactive, multiple-choice quiz based on the video content.',
  },
  {
    value: PromptType.CONTENT_IDEA,
    label: 'Content Idea',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a3.375 3.375 0 00-2.456-2.456L12.75 18l1.188-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.188a3.375 3.375 0 002.456 2.456L20.25 18l-1.188.398a3.375 3.375 0 00-2.456 2.456z', // Sparkles
    description: 'Generate a main idea and key takeaways, perfect for content planning.',
  },
  {
    value: PromptType.TIMESTAMPS,
    label: 'Timestamps',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', // Clock
    description: 'Create a clickable table of contents with key video moments.',
  },
  {
    value: PromptType.SCENE,
    label: 'Scene',
    icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', // Photo
    description: 'Receive a visual description of the key scenes in the video.',
  },
];