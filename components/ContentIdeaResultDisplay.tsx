import React, { useState, useCallback } from 'react';

interface ContentIdeaData {
  mainIdea: string;
  keyTakeaways: string[];
}

interface ContentIdeaResultDisplayProps {
  data: ContentIdeaData;
}

const ContentIdeaResultDisplay: React.FC<ContentIdeaResultDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const textToCopy = `Main Idea:\n${data.mainIdea}\n\nKey Takeaways:\n${data.keyTakeaways.map(t => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  if (!data || !data.mainIdea || !data.keyTakeaways) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a3.375 3.375 0 00-2.456-2.456L12.75 18l1.188-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.188a3.375 3.375 0 002.456 2.456L20.25 18l-1.188.398a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Content Idea</h2>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          aria-label="Copy Content Idea"
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
      </header>
      <div className="p-4 md:p-6 space-y-6 text-gray-300">
        <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Main Idea</h3>
            <p className="pl-4 border-l-4 border-purple-500/50">{data.mainIdea}</p>
        </div>
         <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Key Takeaways</h3>
            <ul className="list-disc list-inside space-y-2">
                {data.keyTakeaways.map((takeaway, index) => (
                    <li key={index}>{takeaway}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentIdeaResultDisplay;