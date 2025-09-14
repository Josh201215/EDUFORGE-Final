import React from 'react';
import { VideoSuggestion } from '../types';

interface VideoSuggestionsDisplayProps {
    suggestions: VideoSuggestion[];
    onSelectVideo: (videoId: string) => void;
}

const VideoSuggestionsDisplay: React.FC<VideoSuggestionsDisplayProps> = ({ suggestions, onSelectVideo }) => {
    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="w-full max-w-3xl mx-auto text-center text-gray-500 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-8">
                <p>No video suggestions found for this topic.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-gray-300 text-center mb-4">Video Suggestions</h2>
            {suggestions.map((video) => (
                <div key={video.videoId} className="bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                        <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title} on YouTube`}>
                            <img 
                                src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`} 
                                alt={`Thumbnail for ${video.title}`} 
                                className="w-full sm:w-48 h-auto rounded-md object-cover hover:opacity-80 transition-opacity"
                                width="240"
                                height="135"
                            />
                        </a>
                    </div>
                    <div className="flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-white">{video.title}</h3>
                        <p className="text-sm text-purple-400 font-semibold mt-1">{video.channel}</p>
                        <p className="text-gray-300 mt-2 text-sm flex-grow">{video.description}</p>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <a 
                                href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                                Watch on YouTube
                            </a>
                             <button
                                onClick={() => onSelectVideo(video.videoId)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                Analyze this video
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoSuggestionsDisplay;