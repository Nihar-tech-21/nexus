import React from "react";

export default function QuestionForm({ data, onUpdate, onRemove }) {
  const type = data.type || "mcq";

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="bg-neutral-200 w-full sm:w-4/5 md:w-2/3 lg:w-1/2 p-5 rounded-xl mt-6 mb-8 mx-auto shadow-lg transition hover:shadow-xl">
      {/* Question Input */}
      <input
        type="text"
        value={data.question}
        onChange={(e) => handleChange("question", e.target.value)}
        placeholder="Enter question text"
        className="w-full p-3 mb-4 text-white rounded-lg bg-indigo-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base sm:text-lg"
      />

      {/* Multiple Choice Question (MCQ) */}
      {type === "mcq" && (
        <div className="space-y-3">
          {data.options.map((opt, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
            >
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const updated = [...data.options];
                  updated[i] = e.target.value;
                  handleChange("options", updated);
                }}
                placeholder={`Option ${i + 1}`}
                className="flex-1 p-2 rounded-lg bg-indigo-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-auto"
              />
              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <input
                  type="radio"
                  name={`correct-${data._id || Math.random()}`}
                  checked={data.correctIndex === i}
                  onChange={() => handleChange("correctIndex", i)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-black font-semibold">
                  Correct
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Short Answer Type */}
      {type === "short" && (
        <div className="mt-4">
          <input
            type="text"
            value={data.correctAnswerText || ""}
            onChange={(e) => handleChange("correctAnswerText", e.target.value)}
            placeholder="Enter correct answer"
            className="w-full p-3 rounded-lg bg-indigo-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p className="text-xs text-gray-700 mt-2 leading-snug">
            This answer will be matched (case-insensitive) with participant’s
            input.
          </p>
        </div>
      )}

      {/* Delete Button */}
      <div className="text-center mt-5">
        <button
          onClick={onRemove}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded-lg shadow-md hover:scale-105"
        >
          Delete Question
        </button>
      </div>
    </div>
  );
}
