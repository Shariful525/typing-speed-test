"use client";

import { useRef, useEffect } from "react";

interface WordDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
}

export default function WordDisplay({
  words,
  currentWordIndex,
  currentInput,
}: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll the container to keep the current word visible
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const currentWordElement = container.querySelector(
        `[data-index="${currentWordIndex}"]`
      );

      if (currentWordElement) {
        const containerRect = container.getBoundingClientRect();
        const wordRect = currentWordElement.getBoundingClientRect();

        // Calculate the scroll position to center the current word
        const scrollLeft =
          wordRect.left -
          containerRect.left -
          containerRect.width / 2 +
          wordRect.width / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentWordIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-16 overflow-x-hidden whitespace-nowrap relative"
    >
      <div
        className="inline-block transition-transform duration-300"
        style={{ transform: `translateX(-${currentWordIndex * 10}px)` }}
      >
        {words.map((word, index) => {
          // Determine the status of the word
          let status = "upcoming";
          if (index === currentWordIndex) {
            status = "current";
          } else if (index < currentWordIndex) {
            status = "completed";
          }

          // For the current word, check character by character
          let renderedWord = word;
          if (index === currentWordIndex) {
            renderedWord = word
              .split("")
              .map((char, charIndex) => {
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
                return <span key={charIndex}>{char}</span>;
              })
              .reduce((prev: any, curr) => [prev, curr], []);
          }

          return (
            <span
              key={index}
              data-index={index}
              className={`
                inline-block px-1 mx-1 rounded
                ${
                  status === "current"
                    ? "bg-blue-100 border-b-2 border-blue-500"
                    : ""
                }
                ${status === "completed" ? "text-gray-400" : ""}
                ${status === "upcoming" ? "text-gray-800" : ""}
              `}
            >
              {renderedWord}
            </span>
          );
        })}
      </div>
    </div>
  );
}
