
import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface QuizResultDisplayProps {
  data: QuizData;
}

const QuizResultDisplay: React.FC<QuizResultDisplayProps> = ({ data }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!data || !data.questions || data.questions.length === 0) {
    // This case is handled in App.tsx by showing the raw output, but good to have a safeguard.
    return null;
  }

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };
  
  const handleReset = () => {
      setSelectedAnswers({});
      setSubmitted(false);
  }

  const score = Object.entries(selectedAnswers).reduce((acc, [index, answer]) => {
      if (data.questions[parseInt(index)].answer === answer) {
          return acc + 1;
      }
      return acc;
  }, 0);

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center">Video Quiz</h2>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {data.questions.map((q, index) => (
          <div key={index} className="border-b border-gray-700/50 pb-8 last:border-b-0 last:pb-0">
            <p className="font-semibold text-lg text-gray-200 mb-4">{index + 1}. {q.question}</p>
            <div className="space-y-3">
              {q.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[index] === option;
                const isCorrect = q.answer === option;
                
                let buttonClass = "w-full text-left p-3 rounded-lg border transition-colors duration-200 ";
                if (submitted) {
                    if (isCorrect) {
                        buttonClass += "bg-green-800/50 border-green-600 text-green-300 ring-2 ring-green-500";
                    } else if (isSelected && !isCorrect) {
                        buttonClass += "bg-red-800/50 border-red-600 text-red-300";
                    } else {
                        buttonClass += "bg-gray-700 border-gray-600 text-gray-400";
                    }
                } else {
                     buttonClass += isSelected 
                        ? "bg-blue-600 border-blue-500 text-white" 
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600/50";
                }

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleSelectAnswer(index, option)}
                    disabled={submitted}
                    className={buttonClass}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {submitted && (
                <div className="mt-4 p-3 rounded-lg bg-gray-900/50 text-gray-300 text-sm">
                    <p><strong className="text-green-400">Explanation:</strong> {q.explanation}</p>
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
        {!submitted ? (
            <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200"
            >
                Check Answers
            </button>
        ) : (
            <>
                <div className="text-center font-bold text-lg bg-gray-700 py-2 px-4 rounded-lg">
                    Your Score: {score} / {data.questions.length}
                </div>
                <button
                    onClick={handleReset}
                    className="w-full sm:w-auto bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition duration-200"
                >
                    Try Again
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default QuizResultDisplay;
