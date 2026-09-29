import React, { useState } from "react";
import { X, CheckCircle2, XCircle, HelpCircle, Trophy, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { STATIC_QUIZ_QUESTIONS } from "../data/learningModules";
import { QuizQuestion } from "../types";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskInChat: (question: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onAskInChat }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(STATIC_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingNewQuiz, setIsLoadingNewQuiz] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleGenerateNewQuiz = async () => {
    setIsLoadingNewQuiz(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "Gemini 3 Architecture, Multimodal, Thinking Levels and SDK" }),
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        handleRestart();
      }
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setIsLoadingNewQuiz(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Gemini Models Knowledge Check
              </h2>
              <p className="text-xs text-neutral-400">
                Test your mastery of Google Gemini architectures and @google/genai SDK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!isCompleted ? (
            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-white leading-snug">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = currentQ.correctIndex === idx;

                  let optionStyle = "border-neutral-800 bg-neutral-850 hover:bg-neutral-800 text-neutral-200";

                  if (hasSubmitted) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500/80 bg-emerald-950/40 text-emerald-200";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-red-500/80 bg-red-950/40 text-red-200";
                    } else {
                      optionStyle = "border-neutral-800 bg-neutral-900/50 opacity-40 text-neutral-400";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-blue-500 bg-blue-600/20 text-white font-medium";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasSubmitted}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                    >
                      <span className="flex-1 mr-2">{option}</span>
                      {hasSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {hasSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {hasSubmitted && (
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Explanation
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <button
                  onClick={() => {
                    onClose();
                    onAskInChat(`Can you explain this concept in depth: "${currentQ.question}"?`);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Discuss this question in chat →
                </button>

                {!hasSubmitted ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedOption === null}
                    className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? "Next Question" : "See Results"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
              <p className="text-sm text-neutral-300">
                You scored <span className="font-bold text-emerald-400 font-mono text-base">{score}</span> out of{" "}
                <span className="font-mono text-base">{questions.length}</span> (
                {Math.round((score / questions.length) * 100)}%)
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-700 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>

                <button
                  onClick={handleGenerateNewQuiz}
                  disabled={isLoadingNewQuiz}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoadingNewQuiz ? "Generating with Gemini..." : "Generate Fresh AI Quiz"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
