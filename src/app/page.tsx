import TypingTest from "@/components/ui/TypingTest";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Typing Speed Test
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Test your typing speed and accuracy. You have 60 seconds to type as many
        words as possible.
      </p>
      <TypingTest />
    </main>
  );
}
