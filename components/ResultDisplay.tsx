// FIX: Implemented ResultDisplay component to show analysis results.
import React, { useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PromptType, SummaryResult, KeyPointsResult } from '../types';
import { parseSummaryResult, parseKeyPointsResult } from '../services/geminiService';
import SpeechControls from './SpeechControls';


interface ResultDisplayProps {
  result: string | null;
  error: string | null;
  tokenCount: number | null;
  promptType: PromptType;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error, tokenCount, promptType }) => {
  const [copied, setCopied] = useState(false);

  const parsedResult = useMemo(() => {
    if (!result) return null;
    if (promptType === PromptType.SUMMARY) {
      return parseSummaryResult(result);
    }
    if (promptType === PromptType.KEY_POINTS) {
      return parseKeyPointsResult(result);
    }
    return null;
  }, [result, promptType]);

  const mainContent = useMemo(() => {
    if (!result) return '';
    if (parsedResult) {
      if ('summary' in parsedResult) return (parsedResult as SummaryResult).summary;
      if ('keyPoints' in parsedResult) return (parsedResult as KeyPointsResult).keyPoints.join('\n');
    }
    // Clean up markdown headers for non-JSON results before copying
    return result.replace(/^#+\s*.*/gm, '').trim();
  }, [result, parsedResult]);

  const relatedVideos = useMemo(() => {
     if (parsedResult && 'relatedVideos' in parsedResult) {
         return parsedResult.relatedVideos;
     }
     return null;
  },[parsedResult]);

  const handleCopy = useCallback(() => {
    if (mainContent) {
      navigator.clipboard.writeText(mainContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [mainContent]);

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-red-900/30 border border-red-700/50 rounded-lg shadow-lg p-6" role="alert">
        <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400 mr-3" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            <h2 className="text-xl font-bold text-red-300">An Error Occurred</h2>
        </div>
        <p className="text-red-300 whitespace-pre-wrap pl-9">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  const summaryData = parsedResult as SummaryResult | null;
  const promptTypeLabel = promptType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <span aria-hidden="true">📄</span>
          {promptTypeLabel}
        </h2>
        <div className="flex items-center space-x-2">
            <SpeechControls textToRead={mainContent} />
            <button
                onClick={handleCopy}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label="Copy result to clipboard"
            >
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
            )}
            </button>
        </div>
      </header>
      <div className="p-4 md:p-6 text-gray-300 prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 max-w-none">
        {summaryData?.title && (
            <div className="mb-6 pb-4 border-b border-gray-700 not-prose">
                <h3 className="text-2xl font-bold text-white">{summaryData.title}</h3>
                <p className="text-md text-gray-400 mt-1">from <span className="font-semibold text-purple-400">{summaryData.channel}</span></p>
            </div>
        )}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainContent}</ReactMarkdown>
      </div>

       {relatedVideos && relatedVideos.length > 0 && (
           <div className="p-4 md:p-6 border-t border-gray-700">
                <h3 className="text-lg font-bold text-purple-400 mb-3">Related Videos</h3>
                <div className="space-y-3">
                    {relatedVideos.map((video, index) => (
                        <a 
                            key={index}
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700 rounded-lg transition-colors"
                        >
                           <p className="font-semibold text-blue-400">{video.title}</p>
                           <p className="text-sm text-gray-400 mt-1">{video.reason}</p>
                        </a>
                    ))}
                </div>
           </div>
       )}

      {tokenCount !== null && (
        <footer className="p-3 border-t border-gray-700 text-right">
          <p className="text-xs text-gray-500">Token Count (approx.): {tokenCount}</p>
        </footer>
      )}
    </div>
  );
};

export default ResultDisplay;