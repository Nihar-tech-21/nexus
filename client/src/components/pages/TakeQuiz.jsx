import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TimerPill from "./TimerPill";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [step, setStep] = useState("intro");
  const [user, setUser] = useState({ name: "", email: "" });
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shortAnswer, setShortAnswer] = useState("");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`,
        );
        setQuiz(res.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("Quiz not found or error fetching data.");
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleTimeUp = useCallback(() => {
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStep("result");
    }
  }, [currentIndex, quiz]);

  useEffect(() => {
    if (step === "result" && quiz && user.name) {
      const saveAttempt = async () => {
        try {
          const endTime = Date.now();
          const timeTaken = startTime
            ? Math.floor((endTime - startTime) / 1000)
            : 0;

          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/attempts`, {
            quizId,
            participantName: user.name,
            email: user.email,
            score,
            totalMarks: quiz.questions.reduce(
              (sum, q) => sum + (q.marks || 1),
              0,
            ),
            timeTaken,
          });

          console.log("Attempt saved successfully!");
        } catch (err) {
          console.error("Error saving attempt:", err);
        }
      };
      saveAttempt();
    }
  }, [step]);

  const handleStart = () => {
    if (!user.name || !user.email) {
      setError("Please enter your name and email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/${quizId}`)
      .then((res) => {
        const alreadyAttempted = res.data.attempts.some(
          (a) => a.email === user.email,
        );
        if (alreadyAttempted) {
          setError("You have already attempted this quiz.");
          return;
        }

        setStartTime(Date.now());
        setStep("questions");
      })
      .catch((err) => {
        console.error("Error checking previous attempts:", err);
        setStartTime(Date.now());
        setStep("questions");
      });
  };

  const handleMCQAnswer = (optionIndex) => {
    const currentQ = quiz.questions[currentIndex];
    const isCorrect =
      currentQ.correctIndex === optionIndex ||
      currentQ.correctIndex === currentQ.options[optionIndex];

    if (isCorrect) setScore((prev) => prev + (currentQ.marks || 1));

    setAnswers([
      ...answers,
      { questionId: currentQ._id, selected: optionIndex },
    ]);
    goToNextQuestion();
  };

  const handleShortAnswerSubmit = () => {
    const currentQ = quiz.questions[currentIndex];
    const userAnswer = shortAnswer.trim().toLowerCase();
    const correctAnswer = (currentQ.correctAnswerText || "")
      .trim()
      .toLowerCase();

    if (userAnswer === correctAnswer) {
      setScore((prev) => prev + (currentQ.marks || 1));
    }

    setAnswers([...answers, { questionId: currentQ._id, answer: shortAnswer }]);
    setShortAnswer("");
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 < quiz.questions.length)
      setCurrentIndex(currentIndex + 1);
    else setStep("result");
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white px-4">
        <p>Loading quiz...</p>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 sm:px-6 lg:px-12 pt-40 pb-10 overflow-y-auto">
      {step === "intro" && (
        <div className="bg-gray-800 p-6 sm:p-10 rounded-2xl w-full max-w-md sm:max-w-lg text-center shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-fuchsia-400 mb-4 sm:mb-6">
            {quiz.title}
          </h1>
          <input
            type="text"
            placeholder="Your Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg bg-violet-700 text-white focus:ring-2 focus:ring-fuchsia-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg bg-violet-700 text-white focus:ring-2 focus:ring-fuchsia-400"
          />
          {error && <p className="text-red-400 mb-3 sm:mb-4">{error}</p>}
          <button
            onClick={handleStart}
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transition"
          >
            Start Quiz
          </button>
        </div>
      )}

      {step === "questions" && (
        <div className="bg-gray-800 p-4 sm:p-10 rounded-2xl w-full max-w-md sm:max-w-lg text-center shadow-lg">
          <TimerPill
            key={currentIndex}
            duration={quiz.timePerQuestion}
            onTimeUp={handleTimeUp}
          />
          <h2 className="text-lg sm:text-2xl mb-3 sm:mb-4">
            Q{currentIndex + 1}: {currentQ.question}
          </h2>

          {currentQ.type === "mcq" ? (
            <div className="flex flex-col gap-2 sm:gap-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMCQAnswer(i)}
                  className="p-2 sm:p-3 bg-violet-700 rounded-lg hover:bg-violet-600 transition text-sm sm:text-base"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <input
                type="text"
                placeholder="Type your answer"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                className="w-full p-2 sm:p-3 mb-3 sm:mb-4 rounded-lg bg-violet-700 text-white focus:ring-2 focus:ring-fuchsia-400"
              />
              <button
                onClick={handleShortAnswerSubmit}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transition"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}

      {step === "result" && (
        <div className="bg-gray-800 p-6 sm:p-10 rounded-2xl w-full max-w-md sm:max-w-lg text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl text-fuchsia-400 mb-3 sm:mb-4">
            Quiz Completed!
          </h2>
          <p className="text-lg sm:text-xl mb-2">
            {user.name}, your score is{" "}
            <span className="text-green-400">
              {score}/
              {quiz.questions.reduce((sum, q) => sum + (q.marks || 1), 0)}
            </span>
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transition"
          >
            Go Home
          </button>
        </div>
      )}
    </div>
  );
}
