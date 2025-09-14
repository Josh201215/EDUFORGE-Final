// FIX: Implemented types file to define shared application types.
export enum PromptType {
  SUMMARY = 'summary',
  TRANSCRIPT = 'transcript',
  TIMESTAMPS = 'timestamps',
  SCENE = 'scene',
  CLIPS = 'clips',
  KEY_POINTS = 'key-points',
  QUIZ = 'quiz',
  CONTENT_IDEA = 'content-idea',
  DEEP_DIVE = 'deep-dive',
}

export interface HistoryItem {
  id: string;
  youtubeUrl: string;
  promptType: PromptType;
  result: string;
  tokenCount: number;
  timestamp: string;
  numberOfQuestions?: number;
}

export interface RelatedVideoSuggestion {
    title: string;
    reason: string;
}

export interface SummaryResult {
    title: string;
    channel: string;
    summary: string;
    relatedVideos: RelatedVideoSuggestion[];
}

export interface KeyPointsResult {
    keyPoints: string[];
    relatedVideos: RelatedVideoSuggestion[];
}

export interface DeepDiveResult {
    coreConcepts: string[];
    keyArguments: string[];
    targetAudience: string;
    overallTone: string;
}

export interface VideoSuggestion {
    videoId: string;
    title: string;
    channel: string;
    description: string;
}