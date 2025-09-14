import React, { useState, useCallback } from 'react';
import { DeepDiveResult } from '../types';

interface DeepDiveResultDisplayProps {
  data: DeepDiveResult;
}

const DeepDiveResultDisplay: React.FC<DeepDiveResultDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const textToCopy = `
Core Concepts:
${data.coreConcepts.map(t => `- ${t}`).join('\n')}

Key Arguments:
${data.keyArguments.map(t => `- ${t}`).join('\n')}

Target Audience:
${data.targetAudience}

Overall Tone:
${data.overallTone}
    `.trim();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  if (!data || !data.coreConcepts) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Deep Dive Analysis</h2>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          aria-label="Copy Deep Dive Analysis"
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
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Core Concepts</h3>
            <ul className="list-disc list-inside space-y-2">
                {data.coreConcepts.map((concept, index) => (
                    <li key={index}>{concept}</li>
                ))}
            </ul>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Key Arguments</h3>
            <ul className="list-disc list-inside space-y-2">
                {data.keyArguments.map((argument, index) => (
                    <li key={index}>{argument}</li>
                ))}
            </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Target Audience</h3>
                <p className="pl-4 border-l-4 border-purple-500/50">{data.targetAudience}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Overall Tone</h3>
                <p className="pl-4 border-l-4 border-purple-500/50">{data.overallTone}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveResultDisplay;