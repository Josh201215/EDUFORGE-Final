// FIX: Implemented SpeechControls component for text-to-speech functionality.
import React, { useState, useEffect, useCallback } from 'react';

interface SpeechControlsProps {
  textToRead: string;
}

const SpeechControls: React.FC<SpeechControlsProps> = ({ textToRead }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [canUseSpeech, setCanUseSpeech] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setCanUseSpeech(true);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (!canUseSpeech) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [canUseSpeech]);

  const handleSpeak = useCallback(() => {
    if (!canUseSpeech || !textToRead) return;
    const synth = window.speechSynthesis;

    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      handleStop(); // Ensure any previous state is cleared
      
      // FIX: Chunk the text to avoid browser character limits
      const chunks = textToRead.match(/[^.!?]+[.!?]+(\s|$)/g) || [textToRead];

      chunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk.trim());
        utterance.rate = playbackRate;
        utterance.onerror = (event) => {
          console.error('SpeechSynthesisUtterance.onerror', event);
          handleStop(); // Stop on any error
        };
        // Set the onend callback only for the last chunk to update the final state
        if (index === chunks.length - 1) {
            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };
        }
        synth.speak(utterance);
      });
      
      setIsSpeaking(true);
      setIsPaused(false);
    }
  }, [canUseSpeech, textToRead, playbackRate, handleStop]);

  // Cleanup effect to stop speech when the component unmounts or the text changes
  useEffect(() => {
    return () => {
      if (canUseSpeech && window.speechSynthesis.speaking) {
        handleStop();
      }
    };
  }, [canUseSpeech, textToRead, handleStop]);
  
    // Sync state if speech ends unexpectedly
  useEffect(() => {
      if (!canUseSpeech) return;
      const synth = window.speechSynthesis;
      const interval = setInterval(() => {
          if (isSpeaking && !synth.speaking && !synth.pending) {
              setIsSpeaking(false);
              setIsPaused(false);
          }
      }, 500);
      return () => clearInterval(interval);
  }, [isSpeaking, canUseSpeech]);


  if (!canUseSpeech || !textToRead) {
    return null;
  }

  const getPlayPauseIcon = () => {
    if (isSpeaking && !isPaused) {
      // Pause icon
      return <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />;
    }
    // Play icon
    return <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25v13.5l13.5-6.75L5.25 5.25z" />;
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleSpeak}
        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        aria-label={isSpeaking && !isPaused ? 'Pause' : 'Play'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          {getPlayPauseIcon()}
        </svg>
      </button>
      {isSpeaking && (
        <button
          onClick={handleStop}
          className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          aria-label="Stop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
          </svg>
        </button>
      )}
       <div className="relative">
        <select
          value={playbackRate}
          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          disabled={isSpeaking}
          className="bg-gray-700 text-gray-300 text-xs rounded-full py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          aria-label="Playback speed"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default SpeechControls;