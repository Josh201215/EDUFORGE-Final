
import React from 'react';
import { HistoryItem } from '../types';
import { PROMPT_TYPE_OPTIONS } from '../constants';

interface HistoryDisplayProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelectItem, onClearHistory }) => {

  const getPromptInfo = (promptType: string) => {
    return PROMPT_TYPE_OPTIONS.find(p => p.value === promptType);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-300">Analysis History</h2>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-8">
          <p>Your generation history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const promptInfo = getPromptInfo(item.promptType);
            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="w-full flex items-center p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/80 hover:border-purple-600/50 transition-all text-left"
              >
                {promptInfo && (
                    <div className="p-2 bg-gray-700 rounded-md mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d={promptInfo.icon} />
                        </svg>
                    </div>
                )}
                <div className="flex-grow">
                  <p className="font-semibold text-gray-200">
                    {promptInfo?.label || item.promptType}
                    {item.promptType === 'quiz' && item.numberOfQuestions && ` (${item.numberOfQuestions} questions)`}
                  </p>
                  <p className="text-sm text-gray-400 truncate">{item.youtubeUrl}</p>
                </div>
                <p className="text-xs text-gray-500 ml-4 whitespace-nowrap">{new Date(item.timestamp).toLocaleString()}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryDisplay;
