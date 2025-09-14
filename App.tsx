import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import HistoryDisplay from './components/HistoryDisplay';
import QuizResultDisplay from './components/QuizResultDisplay';
import ContentIdeaResultDisplay from './components/ContentIdeaResultDisplay';
import DeepDiveResultDisplay from './components/DeepDiveResultDisplay';
import VideoSuggestionsDisplay from './components/VideoSuggestionsDisplay';
import { PromptType, HistoryItem, VideoSuggestion } from './types';
import { analyzeYouTubeVideo, findYouTubeVideos } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<'analyze' | 'search'>('analyze');
  const [topic, setTopic] = useState<string>('');
  const [videoSuggestions, setVideoSuggestions] = useState<VideoSuggestion[] | null>(null);

  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [promptType, setPromptType] = useState<PromptType>(PromptType.SUMMARY);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
  const [result, setResult] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      localStorage.removeItem('analysisHistory');
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (mode === 'analyze') {
      if (!youtubeUrl) {
          setIsLoading(false);
          return;
      }
      setResult(null);
      setTokenCount(null);
      setVideoSuggestions(null);

      try {
        const analysisResult = await analyzeYouTubeVideo(youtubeUrl, promptType, { numberOfQuestions });
        setResult(analysisResult.text);
        setTokenCount(analysisResult.totalTokens);

        const newHistoryItem: HistoryItem = {
          id: `${new Date().toISOString()}-${youtubeUrl}`,
          youtubeUrl,
          promptType,
          result: analysisResult.text,
          tokenCount: analysisResult.totalTokens,
          timestamp: new Date().toISOString(),
          ...(promptType === PromptType.QUIZ && { numberOfQuestions }),
        };

        setHistory(prevHistory => {
          const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 10);
          localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
          return updatedHistory;
        });

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    } else { // mode === 'search'
      if (!topic) {
          setIsLoading(false);
          return;
      };
      setVideoSuggestions(null);
      setResult(null);

      try {
          const suggestions = await findYouTubeVideos(topic);
          setVideoSuggestions(suggestions);
      } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unexpected error occurred while searching for videos.');
          }
      } finally {
          setIsLoading(false);
      }
    }
  }, [mode, youtubeUrl, topic, promptType, numberOfQuestions]);

  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setYoutubeUrl(item.youtubeUrl);
    setPromptType(item.promptType);
    setResult(item.result);
    setTokenCount(item.tokenCount);
    if (item.promptType === PromptType.QUIZ) {
        setNumberOfQuestions(item.numberOfQuestions || 5);
    }
    setError(null);
    setMode('analyze');
    setVideoSuggestions(null);
    window.scrollTo(0, 0);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('analysisHistory');
  }, []);

  const handleSelectSuggestedVideo = useCallback((videoId: string) => {
      setYoutubeUrl(`https://www.youtube.com/watch?v=${videoId}`);
      setMode('analyze');
      setVideoSuggestions(null);
      setError(null);
      setResult(null);
      window.scrollTo(0, 0);
  }, []);

  const renderResult = () => {
    if (isLoading) {
        if (mode === 'search') {
            return <LoadingSpinner message="Searching for videos..." subMessage="Gemini is looking for the best content for you." />;
        }
        return <LoadingSpinner />;
    }
    
    if (error) return <ResultDisplay result={null} error={error} tokenCount={null} promptType={promptType} />;
    
    if (videoSuggestions) {
        return <VideoSuggestionsDisplay suggestions={videoSuggestions} onSelectVideo={handleSelectSuggestedVideo} />;
    }

    if (!result) return null;

    if (promptType === PromptType.QUIZ) {
        try {
            const quizData = JSON.parse(result);
            if (quizData && quizData.questions) {
                return <QuizResultDisplay data={quizData} />;
            }
        } catch (e) {
             console.error("Failed to parse quiz JSON", e);
        }
    }
    
    if (promptType === PromptType.CONTENT_IDEA) {
        try {
            const ideaData = JSON.parse(result);
            if(ideaData && ideaData.mainIdea && ideaData.keyTakeaways) {
                return <ContentIdeaResultDisplay data={ideaData} />;
            }
        } catch (e) {
             console.error("Failed to parse content idea JSON", e);
        }
    }

    if (promptType === PromptType.DEEP_DIVE) {
        try {
            const deepDiveData = JSON.parse(result);
            if(deepDiveData && deepDiveData.coreConcepts) {
                return <DeepDiveResultDisplay data={deepDiveData} />;
            }
        } catch (e) {
            console.error("Failed to parse deep dive JSON", e);
        }
    }

    // Default display for summaries, transcripts, key points etc.
    return <ResultDisplay result={result} error={null} tokenCount={tokenCount} promptType={promptType} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <div className="mt-8">
          <InputForm
            youtubeUrl={youtubeUrl}
            setYoutubeUrl={setYoutubeUrl}
            promptType={promptType}
            setPromptType={setPromptType}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            numberOfQuestions={numberOfQuestions}
            setNumberOfQuestions={setNumberOfQuestions}
            mode={mode}
            setMode={setMode}
            topic={topic}
            setTopic={setTopic}
          />
        </div>
        
        <div className="mt-8">
            {renderResult()}
        </div>

        <div className="mt-12">
            <HistoryDisplay
                history={history}
                onSelectItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
            />
        </div>
      </main>
    </div>
  );
};

export default App;