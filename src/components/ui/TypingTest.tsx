"use client";
import type React from "react";
import { useState, useEffect, useRef, useCallback, JSX } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ResultsModal from "../modals/ResultsModal";
import { WORD_LIST } from "@/constants/wordlist.constant";
import { PERFORMANCE_LEVELS } from "@/constants/performanceLevel.constant";

const generateWords = (count: number) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    words.push(WORD_LIST[randomIndex]);
  }
  return words;
};

// Performance levels with corresponding animals

export default function TypingTest() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [words, setWords] = useState<string[]>(generateWords(200)); // Increased from 100 to 200
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [incorrectWordIndexes, setIncorrectWordIndexes] = useState<Set<number>>(
    new Set()
  );
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState(
    PERFORMANCE_LEVELS[0]
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (interval) clearInterval(interval);

      // Calculate final WPM and show results
      const finalWpm = Math.round(correctWords);
      setWpm(finalWpm);

      // Determine performance level
      const level = PERFORMANCE_LEVELS.reduce((prev, curr) => {
        return finalWpm >= curr.wpm ? curr : prev;
      }, PERFORMANCE_LEVELS[0]);

      setPerformanceLevel(level);
      setShowResults(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, correctWords]);

  // Calculate CPM and WPM
  useEffect(() => {
    if (isActive) {
      const elapsedMinutes = (60 - timeLeft) / 60;
      if (elapsedMinutes > 0) {
        const currentCpm = Math.round(typedCharacters / elapsedMinutes);
        setCpm(currentCpm);
        setWpm(Math.round(correctWords / elapsedMinutes));
      }
    }
  }, [typedCharacters, timeLeft, isActive, correctWords]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Start the timer on first input
    if (!isActive && value.length === 1) {
      setIsActive(true);
    }

    // If the test is active, process the input
    if (isActive) {
      setCurrentInput(value);

      // Check if the user has completed a word (space)
      if (value.endsWith(" ")) {
        const typedWord = value.trim();
        const currentWord = words[currentWordIndex];

        // Update stats
        if (typedWord === currentWord) {
          setCorrectWords((prev) => prev + 1);
        } else {
          setIncorrectWords((prev) => prev + 1);
          // Track this word as incorrect
          setIncorrectWordIndexes((prev) => {
            const newSet = new Set(prev);
            newSet.add(currentWordIndex);
            return newSet;
          });
        }

        // Move to the next word
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentInput("");
        setTypedCharacters((prev) => prev + typedWord.length + 1); // +1 for space

        // Check if we need more words
        if (currentWordIndex > words.length - 20) {
          setWords((prev) => [...prev, ...generateWords(50)]);
        }
      }
    }
  };

  // Reset the test
  const resetTest = useCallback(() => {
    setTimeLeft(60);
    setIsActive(false);
    setCurrentInput("");
    setWords(generateWords(200));
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setTypedCharacters(0);
    setCpm(0);
    setWpm(0);
    setShowResults(false);
    setIncorrectWordIndexes(new Set());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get the current and upcoming words for display
  const getCurrentAndUpcomingWords = () => {
    const startIndex = Math.max(0, currentWordIndex - 2);
    const endIndex = Math.min(words.length, currentWordIndex + 5);
    return words.slice(startIndex, endIndex);
  };

  // Render the words with appropriate styling
  const renderWords = () => {
    const displayWords = getCurrentAndUpcomingWords();
    const offset = Math.max(0, currentWordIndex - 2);

    return displayWords.map((word, index) => {
      const wordIndex = index + offset;

      // Determine the status of the word
      let status = "upcoming";
      if (wordIndex === currentWordIndex) {
        status = "current";
      } else if (wordIndex < currentWordIndex) {
        status = "completed";
      }

      // Check if this word was typed incorrectly
      const isIncorrect = incorrectWordIndexes.has(wordIndex);

      // For the current word, check character by character
      let renderedWord: string | JSX.Element = word;
      if (wordIndex === currentWordIndex) {
        const chars = word.split("");
        renderedWord = (
          <>
            {chars.map((char, charIndex) => {
              if (charIndex < currentInput.length) {
                const isCorrect = char === currentInput[charIndex];
                return (
                  <span
                    key={charIndex}
                    className={isCorrect ? "text-green-500" : "text-red-500"}
                  >
                    {char}
                  </span>
                );
              }
              return charIndex === currentInput.length ? (
                <span key={charIndex} className="relative inline-block">
                  {char}
                  <span className="absolute bottom-0 left-0 h-full w-0.5 bg-black animate-blink"></span>
                </span>
              ) : (
                <span key={charIndex}>{char}</span>
              );
            })}
          </>
        );
      }

      return (
        <span
          key={wordIndex}
          className={`
            inline-block px-0.5 mx-0.5 text-2xl font-semibold
            ${status === "current" ? "text-black" : ""}
            ${
              status === "completed"
                ? isIncorrect
                  ? "text-red-500 line-through"
                  : "text-blue-500"
                : ""
            }
            ${status === "upcoming" ? "text-gray-800" : ""}
          `}
        >
          {renderedWord}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 mb-4">
          <CircularProgressbar
            value={timeLeft}
            maxValue={60}
            text={`${timeLeft}s`}
            styles={buildStyles({
              textSize: "22px",
              pathColor: timeLeft > 10 ? "#10b981" : "#ef4444",
              textColor: "#1f2937",
              trailColor: "#e5e7eb",
            })}
          />
        </div>

        <div className="flex space-x-6 mb-4">
          <button
            onClick={resetTest}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-white rounded-lg shadow-md p-8 mb-6 w-full relative"
        onClick={() => inputRef.current?.focus()}
      >
        {!isActive && timeLeft === 60 && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors"
              onClick={() => inputRef.current?.focus()}
            >
              Start typing
            </button>
          </div>
        )}

        <div className="text-center my-8">{renderWords()}</div>

        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          disabled={timeLeft === 0}
          className="opacity-0 absolute left-0 top-0 w-full h-full cursor-text"
          aria-label="Type here to start"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">Correct Words</span>
          <span className="text-2xl font-bold text-green-500">
            {correctWords}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">CPM</span>
          <span className="text-2xl font-bold text-blue-500">{cpm}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">WPM</span>
          <span className="text-2xl font-bold text-purple-500">{wpm}</span>
        </div>
      </div>

      {showResults && (
        <ResultsModal
          wpm={wpm}
          cpm={cpm}
          correctWords={correctWords}
          incorrectWords={incorrectWords}
          performanceLevel={performanceLevel}
          onClose={resetTest}
        />
      )}
    </div>
  );
}
