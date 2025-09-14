import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    subMessage?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = "Analyzing video, please wait...", 
    subMessage = "This can take a minute for longer videos." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a3.375 3.375 0 00-2.456-2.456L12.75 18l1.188-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.188a3.375 3.375 0 002.456 2.456L20.25 18l-1.188.398a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
        </div>
      </div>
      <p className="text-gray-300 mt-4 text-lg">{message}</p>
      <p className="text-gray-500 text-sm">{subMessage}</p>
    </div>
  );
};

export default LoadingSpinner;