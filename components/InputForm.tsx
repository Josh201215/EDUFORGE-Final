import React from 'react';
import { PromptType } from '../types';
import { PROMPT_TYPE_OPTIONS } from '../constants';

interface InputFormProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  promptType: PromptType;
  setPromptType: (type: PromptType) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  numberOfQuestions: number;
  setNumberOfQuestions: (count: number) => void;
  mode: 'analyze' | 'search';
  setMode: (mode: 'analyze' | 'search') => void;
  topic: string;
  setTopic: (topic: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  youtubeUrl,
  setYoutubeUrl,
  promptType,
  setPromptType,
  handleGenerate,
  isLoading,
  numberOfQuestions,
  setNumberOfQuestions,
  mode,
  setMode,
  topic,
  setTopic,
}) => {
  const selectedOption = PROMPT_TYPE_OPTIONS.find(option => option.value === promptType);

  const TabButton = ({
    label,
    value,
  }: {
    label: string;
    value: 'analyze' | 'search';
  }) => (
    <button
      onClick={() => setMode(value)}
      disabled={isLoading}
      className={`w-1/2 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed ${
        mode === value
          ? 'text-white border-b-2 border-purple-500'
          : 'text-gray-400 hover:text-white'
      }`}
      aria-pressed={mode === value}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg">
      <div className="flex border-b border-gray-700/50">
        <TabButton label="Analyze Video URL" value="analyze" />
        <TabButton label="Find Videos by Topic" value="search" />
      </div>

      <div className="p-6 space-y-6">
        {mode === 'analyze' ? (
          <>
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-300 mb-2">
                YouTube Video URL
              </label>
              <input
                type="text"
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                disabled={isLoading}
                aria-label="YouTube Video URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                What do you want to generate?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PROMPT_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPromptType(option.value)}
                    className={`flex flex-col items-center justify-center text-center p-3 border rounded-lg transition-colors duration-200 ${
                      promptType === option.value
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                    }`}
                    disabled={isLoading}
                    aria-label={`Select analysis type: ${option.label}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                    </svg>
                    <span className="text-sm font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg min-h-[50px] flex items-center justify-center transition-all duration-300">
                <p className="text-sm text-center text-gray-400">
                  {selectedOption?.description}
                </p>
              </div>
            </div>

            {promptType === PromptType.QUIZ && (
              <div className="transition-all duration-300">
                <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="numberOfQuestions"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Math.max(1, parseInt(e.target.value, 10)))}
                  min="1"
                  max="10"
                  className="w-full md:w-1/3 bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  disabled={isLoading}
                />
              </div>
            )}
          </>
        ) : (
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., latest advancements in AI"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              disabled={isLoading}
              aria-label="Video Topic"
            />
            <p className="text-xs text-gray-400 mt-2">Enter a topic and Gemini will find relevant YouTube videos for you.</p>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading || (mode === 'analyze' && !youtubeUrl) || (mode === 'search' && !topic)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'analyze' ? 'Generating...' : 'Searching...'}
              </>
            ) : (
              mode === 'analyze' ? 'Generate Insights' : 'Find Videos'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;