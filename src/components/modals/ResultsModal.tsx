"use client";

import type React from "react";

import { useEffect } from "react";

interface PerformanceLevel {
  wpm: number;
  name: string;
  icon: string;
}

interface ResultsModalProps {
  wpm: number;
  cpm: number;
  correctWords: number;
  incorrectWords: number;
  performanceLevel: PerformanceLevel;
  onClose: () => void;
}

export default function ResultsModal({
  wpm,
  cpm,
  correctWords,
  incorrectWords,
  performanceLevel,
  onClose,
}: ResultsModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Prevent clicks outside from closing the modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in"
        onClick={handleModalClick}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Test Results
          </h2>
          <p className="text-gray-600">Your typing performance</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="text-7xl">{performanceLevel.icon}</div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-purple-600">
            You are a {performanceLevel.name}!
          </h3>
          <p className="text-gray-600 mt-1">
            {wpm < 20
              ? "Keep practicing to improve your speed!"
              : wpm < 40
              ? "Good job! You're making progress."
              : wpm < 60
              ? "Impressive! You're faster than average."
              : wpm < 80
              ? "Amazing speed! You're a natural."
              : "Incredible! You're among the fastest typists!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-500 text-sm">WPM</p>
            <p className="text-2xl font-bold text-purple-600">{wpm}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-500 text-sm">CPM</p>
            <p className="text-2xl font-bold text-blue-600">{cpm}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Correct Words</p>
            <p className="text-2xl font-bold text-green-600">{correctWords}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Mistakes</p>
            <p className="text-2xl font-bold text-red-600">{incorrectWords}</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
