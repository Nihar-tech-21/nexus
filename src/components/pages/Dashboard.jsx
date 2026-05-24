import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert("Quiz deleted successfully!");
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Check console for details.");
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Quiz link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center text-white px-4 sm:px-6 lg:px-12 pt-32 sm:pt-22 md:pt-28 lg:pt-32 overflow-x-hidden">
      <h1 className="text-3xl sm:text-4xl font-bold text-fuchsia-400 mb-5 text-center">
        Dashboard
      </h1>
      <p className="text-gray-400 text-center mb-1">
        (Your quizzes will appear here!)
      </p>
      <p className="text-gray-400 text-center mb-4">
        (Just copy and share the link generated for your quiz!)
      </p>

      <div className="w-full max-w-6xl mb-8 p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold text-center shadow-lg text-sm sm:text-base">
        Note: All quizzes and their attempts are automatically deleted 15 days
        after creation.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {quizzes.length === 0 ? (
          <p className="text-gray-400 text-lg text-center mt-8 col-span-full">
            No quizzes created yet.
          </p>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-gray-700 p-5 rounded-2xl shadow-lg hover:scale-105 transition w-full break-words overflow-hidden flex flex-col"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-fuchsia-300 mb-2 truncate">
                <span
                  title={quiz.title}
                  className="block break-words whitespace-normal"
                >
                  {quiz.title}
                </span>
              </h2>

              <p className="text-gray-400 text-sm sm:text-base">
                Created by:{" "}
                <span className="text-purple-400">{quiz.createdBy}</span>
              </p>

              {quiz.shareableLink && (
                <div className="bg-gray-800 p-3 rounded-lg mt-3 text-sm break-words">
                  <p className="text-gray-300 mb-1">Shareable Link:</p>
                  <a
                    href={quiz.shareableLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline break-all block"
                  >
                    {quiz.shareableLink}
                  </a>
                  <button
                    onClick={() => handleCopyLink(quiz.shareableLink)}
                    className="mt-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition w-full sm:w-auto"
                  >
                    Copy
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 flex-wrap">
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/result/${quiz._id}`)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg hover:scale-105 transition w-full sm:w-auto"
                >
                  View Results
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
