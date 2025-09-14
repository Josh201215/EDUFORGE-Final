import { GoogleGenAI, Type } from "@google/genai";
import { PromptType, SummaryResult, KeyPointsResult, DeepDiveResult, VideoSuggestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getPrompt = (promptType: PromptType, options: { numberOfQuestions?: number }): string => {
    switch (promptType) {
        case PromptType.SUMMARY:
            return "Analyze the video and provide its title, the channel name, a concise summary of the main points, and 3-5 related video suggestions with a brief reason for each. Respond in a single JSON object.";
        case PromptType.TRANSCRIPT:
            return "Transcribe the video. Return only the spoken dialogue, verbatim. Omit any additional text or descriptions.";
        case PromptType.TIMESTAMPS:
             return "Generate a timestamped transcript of the video. Each line must follow this format precisely:  [hh:mm:ss] Dialogue. Return only the timestamp and spoken content; omit any other text or formatting.";
        case PromptType.SCENE:
            return "Please provide a detailed description of the scene in the video, including: Setting, Objects, People, Lighting, Colors, and Camera Angle/Movement. Start output directly with the response -- do not include any introductory text or explanations.";
        case PromptType.CLIPS:
            return "Extract shareable clips for social media. Each clip must include: a Timestamp [hh:mm:ss]-[hh:mm:ss], the verbatim Transcript, and a concise Rationale (under 20 words) for its social media appeal (e.g., 'humorous,' 'controversial,' 'inspiring'). Start output directly with the response.";
        case PromptType.KEY_POINTS:
            return "Extract the most important takeaways and actionable insights from this video. Present them as a bulleted list. Also suggest 3-5 related videos with a brief reason for each. Respond in JSON format.";
        case PromptType.QUIZ:
            return `Generate a multiple-choice quiz with exactly ${options.numberOfQuestions || 5} questions based on the video. For each question, provide a few options, identify the correct answer, and give a brief explanation for why it's correct. Respond in JSON format.`;
        case PromptType.CONTENT_IDEA:
             return "Analyze this video and generate a new content idea based on it. Provide a 'Main Idea' and a list of 'Key Takeaways' as bullet points for the new content. Respond in JSON format.";
        case PromptType.DEEP_DIVE:
            return "Provide a detailed analysis of this video. Identify the core concepts, key arguments, intended target audience, and the overall tone. Respond in a single JSON object.";
        default:
            return "Summarize this YouTube video.";
    }
};

const getResponseSchema = (promptType: PromptType) => {
    const relatedVideosSchema = {
        type: Type.ARRAY,
        description: "A list of 3 to 5 related video suggestions.",
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The title of the suggested video." },
                reason: { type: Type.STRING, description: "A brief explanation of why this video is relevant." },
            },
            required: ["title", "reason"],
        },
    };

    switch (promptType) {
        case PromptType.SUMMARY:
            return {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The title of the YouTube video." },
                    channel: { type: Type.STRING, description: "The name of the YouTube channel that uploaded the video." },
                    summary: { type: Type.STRING, description: "The concise summary of the video." },
                    relatedVideos: relatedVideosSchema,
                },
                required: ["title", "channel", "summary", "relatedVideos"],
            };
        case PromptType.KEY_POINTS:
            return {
                type: Type.OBJECT,
                properties: {
                    keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of the key points from the video." },
                    relatedVideos: relatedVideosSchema,
                },
                required: ["keyPoints", "relatedVideos"],
            };
        case PromptType.QUIZ:
            return {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                answer: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                            },
                             required: ['question', 'options', 'answer', 'explanation']
                        },
                    },
                },
                 required: ['questions']
            };
        case PromptType.CONTENT_IDEA:
            return {
                type: Type.OBJECT,
                properties: {
                    mainIdea: { type: Type.STRING },
                    keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['mainIdea', 'keyTakeaways']
            };
        case PromptType.DEEP_DIVE:
            return {
                type: Type.OBJECT,
                properties: {
                    coreConcepts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the fundamental ideas discussed." },
                    keyArguments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the main arguments made in the video." },
                    targetAudience: { type: Type.STRING, description: "A description of the intended audience." },
                    overallTone: { type: Type.STRING, description: "An analysis of the video's overall tone." },
                },
                required: ['coreConcepts', 'keyArguments', 'targetAudience', 'overallTone']
            };
        default:
            return undefined;
    }
};

const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
            if (!videoId && urlObj.pathname.startsWith('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1];
            }
        }
    } catch (e) {
        console.error("Invalid URL format:", url);
        return null;
    }
    // Basic regex fallback for non-standard URLs
    if (!videoId) {
       const regex = /(?:v=|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;
       const match = url.match(regex);
       if (match) {
           videoId = match[1];
       }
    }
    return videoId;
};


export const analyzeYouTubeVideo = async (
    youtubeUrl: string,
    promptType: PromptType,
    options: { numberOfQuestions?: number }
): Promise<{ text: string; totalTokens: number }> => {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
         throw new Error("Invalid YouTube URL provided. Please check the format.");
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const prompt = getPrompt(promptType, options);
    const schema = getResponseSchema(promptType);
    
    // System instruction to ground the model and improve accuracy.
    const baseConfig = {
      systemInstruction: "You are a YouTube Video Analysis Expert. Your sole purpose is to analyze the provided YouTube video and respond based ONLY on its content. Do not use any external knowledge. If the video does not contain the answer to a user's prompt, you must state that clearly. Adhere strictly to the requested output format.",
    };

    const config = schema
      ? {
          ...baseConfig,
          responseMimeType: "application/json",
          responseSchema: schema,
        }
      : baseConfig;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    { fileData: { mimeType: "video/youtube", fileUri: canonicalUrl } },
                ],
            },
            config: config,
        });

        const resultText = response.text;
        
        const totalTokens = Math.ceil((prompt.length + resultText.length) / 4);

        return { text: resultText, totalTokens };

    } catch (error: any) {
        console.error("Error analyzing video:", error);
        if (error.message) {
             if (error.message.includes("token count")) {
                throw new Error("The video is too long to be processed. Please try a shorter video.");
            }
             if (error.message.includes("Unsupported file uri") || error.message.includes("could not be accessed")) {
                throw new Error("The video could not be accessed. It may be private, deleted, or unavailable.");
            }
        }
        throw new Error("Failed to analyze the video. The Gemini API may be temporarily unavailable.");
    }
};

export const findYouTubeVideos = async (
    topic: string
): Promise<VideoSuggestion[]> => {

    const prompt = `Find 5 relevant and popular YouTube videos about the following topic: '${topic}'. For each video, provide its title, the channel name, its unique video ID, and a brief, one-sentence description of why it's a good recommendation. Respond in a single JSON object.`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            videos: {
                type: Type.ARRAY,
                description: "A list of 5 recommended YouTube videos.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        videoId: { type: Type.STRING, description: "The unique 11-character YouTube video ID." },
                        title: { type: Type.STRING, description: "The title of the video." },
                        channel: { type: Type.STRING, description: "The name of the YouTube channel." },
                        description: { type: Type.STRING, description: "A brief, one-sentence description of the video's relevance." },
                    },
                    required: ["videoId", "title", "channel", "description"],
                },
            },
        },
        required: ["videos"],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const parsedResult = parseVideoSuggestions(response.text);
        if (!parsedResult) {
            throw new Error("The response from the AI was not in the expected format.");
        }
        return parsedResult;

    } catch (error: any) {
        console.error("Error finding videos:", error);
        throw new Error("Failed to find videos. The Gemini API may be temporarily unavailable.");
    }
};

export const parseVideoSuggestions = (jsonString: string): VideoSuggestion[] | null => {
    try {
        const data = JSON.parse(jsonString);
        if (data.videos && Array.isArray(data.videos)) {
            const isValid = data.videos.every((v: any) => v.videoId && v.title && v.channel && v.description);
            if (isValid) {
                return data.videos;
            }
        }
        return null;
    } catch {
        return null;
    }
};

export const parseSummaryResult = (jsonString: string): SummaryResult | null => {
    try {
        const data = JSON.parse(jsonString);
        if (data.title && data.channel && data.summary && Array.isArray(data.relatedVideos)) {
            return data;
        }
        return null;
    } catch {
        return null;
    }
};

export const parseKeyPointsResult = (jsonString: string): KeyPointsResult | null => {
    try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data.keyPoints) && Array.isArray(data.relatedVideos)) {
            return data;
        }
        return null;
    } catch {
        return null;
    }
};

export const parseDeepDiveResult = (jsonString: string): DeepDiveResult | null => {
    try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data.coreConcepts) && Array.isArray(data.keyArguments) && data.targetAudience && data.overallTone) {
            return data;
        }
        return null;
    } catch {
        return null;
    }
};