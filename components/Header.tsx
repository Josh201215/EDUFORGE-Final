
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
        YouTube Video Insights
      </h1>
      <p className="text-lg text-gray-400">
        Turn any YouTube video into summaries, transcripts, and more with Gemini.
      </p>
    </header>
  );
};

export default Header;
