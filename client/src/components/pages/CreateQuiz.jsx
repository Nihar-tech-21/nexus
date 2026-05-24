import React, { useState, useEffect } from "react";
import QuestionForm from "../QuestionForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  // Check auth on mount
  useEffect(() => {
    if (!token) setShowAuthMessage(true);
  }, [token]);

  // Add a question (either MCQ or Short type)
  const addQuestion = (type = "mcq") => {
    const id = Date.now().toString(); // simple unique ID

    if (type === "mcq") {
      setQuestions((prev) => [
        ...prev,
        {
          id,
          type: "mcq",
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          marks: 1,
        },
      ]);
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          id,
          type: "short",
          question: "",
          correctAnswerText: "",
          marks: 1,
        },
      ]);
    }
  };

  // Update question data
  const updateQuestion = (id, updatedData) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedData } : q)),
    );
  };

  // Remove a question
  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Handle form submit
  const handleSubmit = async () => {
    for (const q of questions) {
      if (q.type === "mcq") {
        if (
          !q.options ||
          q.options.length !== 4 ||
          q.options.some((opt) => !opt.trim())
        ) {
          alert("Each MCQ must have exactly 4 filled options!");
          return;
        }
        if (q.correctIndex === undefined) {
          alert("Please select the correct option for each MCQ!");
          return;
        }
      } else if (q.type === "short") {
        if (!q.correctAnswerText || q.correctAnswerText.trim() === "") {
          alert("Short answer questions must have a correct answer!");
          return;
        }
      }
    }
    if (!token) {
      setShowAuthMessage(true);
      return;
    }

    if (!quizTitle.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
        {
          title: quizTitle,
          questions,
          timePerQuestion,
          createdBy: userId,
          createdByName: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Quiz created:", response.data);
      alert(
        `Quiz created successfully!\nShare this link: ${response.data.quiz.shareableLink}`,
      );
      setQuizTitle("");
      setQuestions([]);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-24 pb-10">
      <h1 className="text-3xl font-bold text-fuchsia-400 mt-8 mb-6">
        Create a New Quiz
      </h1>
      <p className="text-lg text-slate-400 mt-3">
        (Give your quiz a title, add questions, and save — BOOM! It’s done!)
      </p>

      {/* 🔒 Auth popup */}
      {showAuthMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-2xl text-center relative w-96 shadow-lg">
            <button
              onClick={() => {
                setShowAuthMessage(false);
                navigate("/");
              }}
              className="absolute top-2 right-3 text-white text-xl hover:text-red-400"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-fuchsia-400 mb-3">
              Login Required
            </h2>
            <p className="text-gray-300 mb-4">
              Please login or sign up before creating a quiz.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/auth/login")}
                className="px-4 py-2 bg-fuchsia-500 rounded-lg hover:bg-fuchsia-600"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer */}
      <div className="my-4">
        <label className="text-white block mb-2 text-lg">
          Select Question Timer:
        </label>
        <select
          value={timePerQuestion}
          onChange={(e) => setTimePerQuestion(Number(e.target.value))}
          className="bg-gray-800 text-white rounded-lg p-2"
        >
          <option value={20}>20 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      {/* Title */}
      <input
        type="text"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        placeholder="Enter quiz title"
        className="w-1/3 p-3 mb-6 mt-6 rounded-lg text-bold text-lg text-white bg-violet-700"
      />

      {/* Question List */}
      {questions.map((q) => (
        <div key={q.id} className="mb-8">
          <QuestionForm
            data={q}
            onUpdate={(updatedData) => updateQuestion(q.id, updatedData)}
            onRemove={() => removeQuestion(q.id)}
          />

          <label className="block text-sm text-gray-300 mb-1">
            Marks for this question:
          </label>
          <input
            type="number"
            min="1"
            value={q.marks || 1}
            onChange={(e) =>
              updateQuestion(q.id, { marks: Number(e.target.value) })
            }
            className="w-24 p-2 rounded bg-gray-700 text-white border border-gray-500"
          />
        </div>
      ))}

      {/* Buttons */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => addQuestion("mcq")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transition"
        >
          + Add MCQ
        </button>

        <button
          onClick={() => addQuestion("short")}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg hover:scale-105 transition"
        >
          + Add Short Answer
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:scale-105 transition"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}
