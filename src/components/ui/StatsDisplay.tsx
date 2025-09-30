interface StatsDisplayProps {
  correctWords: number;
  incorrectWords: number;
  cpm: number;
}

export default function StatsDisplay({
  correctWords,
  incorrectWords,
  cpm,
}: StatsDisplayProps) {
  const totalWords = correctWords + incorrectWords;
  const accuracy =
    totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <span className="text-sm text-gray-500 mb-1">Correct Words</span>
        <span className="text-2xl font-bold text-green-500">
          {correctWords}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <span className="text-sm text-gray-500 mb-1">Mistakes</span>
        <span className="text-2xl font-bold text-red-500">
          {incorrectWords}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <span className="text-sm text-gray-500 mb-1">CPM</span>
        <span className="text-2xl font-bold text-blue-500">{cpm}</span>
      </div>
    </div>
  );
}
