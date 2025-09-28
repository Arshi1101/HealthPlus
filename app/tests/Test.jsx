"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Test({ test }) {
  const [answers, setAnswers] = useState(Array(test.questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (score) => {
    const updated = [...answers];
    updated[currentQuestion] = score;
    setAnswers(updated);

    // Auto-advance to next question if not last
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const totalScore = answers.reduce((a, b) => a + (b ?? 0), 0);

  const getResult = () => {
    if (test.title.includes("PFQ-9")) {
      if (totalScore <= 4) return "Minimal depression. Keep monitoring your mood.";
      if (totalScore <= 9) return "Mild depression. Consider light lifestyle changes.";
      if (totalScore <= 14) return "Moderate depression. Seek professional advice if persistent.";
      if (totalScore <= 19) return "Moderately severe depression. Professional support recommended.";
      return "Severe depression. Consult a mental health professional immediately.";
    } else {
      if (totalScore <= 4) return "Minimal anxiety. Keep monitoring your stress.";
      if (totalScore <= 9) return "Mild anxiety. Consider relaxation techniques.";
      if (totalScore <= 14) return "Moderate anxiety. Talk to a counselor if needed.";
      return "Severe anxiety. Professional help strongly recommended.";
    }
  };

  const handleRetake = () => {
    setAnswers(Array(test.questions.length).fill(null));
    setCurrentQuestion(0);
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-400 mb-4">{test.title}</h1>

      {!submitted ? (
        <>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="bg-cyan-400 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>

          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg mb-4">
                {currentQuestion + 1}. {test.questions[currentQuestion]}
              </p>
              <div className="flex flex-col gap-3">
                {test.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-full border border-cyan-400 hover:bg-cyan-500 transition ${
                      answers[currentQuestion] === opt.score ? "bg-cyan-400 text-gray-900" : ""
                    }`}
                    onClick={() => handleSelect(opt.score)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {currentQuestion === test.questions.length - 1 && (
            <button
              onClick={() => setSubmitted(true)}
              disabled={answers.includes(null)}
              className="mt-6 px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold transition disabled:opacity-50"
            >
              Submit
            </button>
          )}
        </>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-pink-400">Your Score: {totalScore}</h2>
          <p className="text-xl">{getResult()}</p>
          <button
            onClick={handleRetake}
            className="mt-4 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-bold transition"
          >
            Retake Test
          </button>
        </div>
      )}
    </div>
  );
}