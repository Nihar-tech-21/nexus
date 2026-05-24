import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function Result() {
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        const quizRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setQuizTitle(quizRes.data.title);

        const resultRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/attempts/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const sorted = resultRes.data.attempts.sort(
          (a, b) => b.score - a.score || a.timeTaken - b.timeTaken,
        );
        setAttempts(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading results...
      </div>
    );
  }

  // Prepare chart data
  const top5 = attempts
    .slice(0, 5)
    .map((a) => ({ name: a.participantName, score: a.score }));

  // Score distribution
  const scoreMap = {};
  attempts.forEach((a) => {
    scoreMap[a.score] = (scoreMap[a.score] || 0) + 1;
  });
  const distribution = Object.entries(scoreMap).map(([score, count]) => ({
    score: Number(score),
    count,
  }));

  // Donut Chart Data — group scores in ranges of 5 marks
  const donutData = [
    { range: "0–5", count: attempts.filter((a) => a.score <= 5).length },
    {
      range: "6–10",
      count: attempts.filter((a) => a.score > 5 && a.score <= 10).length,
    },
    {
      range: "11–15",
      count: attempts.filter((a) => a.score > 10 && a.score <= 15).length,
    },
    { range: "16+", count: attempts.filter((a) => a.score > 15).length },
  ].filter((d) => d.count > 0);

  const COLORS = ["#8b5cf6", "#06b6d4", "#facc15", "#f43f5e"];

  // Line Chart — Score vs Time Taken
  const timeScoreData = attempts.map((a) => ({
    name: a.participantName,
    score: a.score,
    time: a.timeTaken,
  }));

  // csv download feature
  const downloadCSV = () => {
    const headers = [
      "Rank",
      "Participant Name",
      "Score",
      "Total Marks",
      "Time Taken (sec)",
    ];

    const rows = attempts.map((att, index) => [
      index + 1,
      att.participantName,
      att.score,
      att.totalMarks,
      att.timeTaken,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${quizTitle.replace(/\s+/g, "_")}_results.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center text-white px-4 sm:px-6 lg:px-12 pt-28 pb-10 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-fuchsia-400 mb-6 text-center break-words">
        Results for: {quizTitle}
      </h1>

      {/* Summary Stats */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 w-full max-w-4xl">
        <div className="bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md text-center flex-1 min-w-[140px]">
          <p className="text-fuchsia-300 text-base sm:text-lg font-semibold">
            👥 Total Participants
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">
            {attempts.length}
          </p>
        </div>

        <div className="bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md text-center flex-1 min-w-[140px]">
          <p className="text-fuchsia-300 text-base sm:text-lg font-semibold">
            🏆 Highest Score
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-400 mt-1">
            {attempts.length > 0
              ? `${attempts[0].score}/${attempts[0].totalMarks}`
              : "—"}
          </p>
        </div>

        <div className="bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md text-center flex-1 min-w-[140px]">
          <p className="text-fuchsia-300 text-base sm:text-lg font-semibold">
            ⚡ Fastest Completion
          </p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-1">
            {attempts.length > 0
              ? `${attempts.reduce(
                  (min, a) => Math.min(min, a.timeTaken),
                  attempts[0].timeTaken,
                )}s`
              : "—"}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-xl overflow-x-auto mb-10">
        <table className="w-full min-w-[600px] table-auto">
          <thead className="bg-gray-700 text-fuchsia-300 sticky top-0">
            <tr>
              <th className="p-2 sm:p-3 text-left">Rank</th>
              <th className="p-2 sm:p-3 text-left">Name</th>
              <th className="p-2 sm:p-3 text-left">Score</th>
              <th className="p-2 sm:p-3 text-left">Time Taken (sec)</th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 p-4">
                  No one has attempted this quiz yet.
                </td>
              </tr>
            ) : (
              attempts.map((att, i) => (
                <tr
                  key={att._id}
                  className="odd:bg-gray-800 even:bg-gray-700 hover:bg-gray-600 transition"
                >
                  <td className="p-2 sm:p-3 font-semibold">{i + 1}</td>
                  <td className="p-2 sm:p-3">{att.participantName}</td>
                  <td className="p-2 sm:p-3 text-green-400 font-bold">
                    {att.score}/{att.totalMarks}
                  </td>
                  <td className="p-2 sm:p-3 text-blue-300">{att.timeTaken}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Top 5 Scorers Chart */}
      <div className="w-full max-w-4xl bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl mb-10">
        <h2 className="text-xl sm:text-2xl text-fuchsia-300 mb-4 text-center">
          🏆 Top 5 Scorers
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top5}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#f9fafb",
              }}
            />
            <Bar dataKey="score" fill="url(#colorUv)" radius={[10, 10, 0, 0]} />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Distribution Chart */}
      <div className="w-full max-w-4xl bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl mb-10">
        <h2 className="text-xl sm:text-2xl text-fuchsia-300 mb-4 text-center">
          📊 Score Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={distribution}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="score" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#f9fafb",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#a855f7"
              fill="url(#colorArea)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart - Score Range Breakdown */}
      <div className="w-full max-w-4xl bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl mb-10">
        <h2 className="text-xl sm:text-2xl text-fuchsia-300 mb-4 text-center">
          🎯 Score Range Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={donutData}
              dataKey="count"
              nameKey="range"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
            >
              {donutData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Score vs Time Taken */}
      <div className="w-full max-w-4xl bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl mb-10">
        <h2 className="text-xl sm:text-2xl text-fuchsia-300 mb-4 text-center">
          ⏱️ Time Taken vs Score Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const score = payload.find(
                    (p) => p.dataKey === "score",
                  )?.value;
                  const time = payload.find((p) => p.dataKey === "time")?.value;
                  return (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 shadow-lg">
                      <p className="font-semibold text-fuchsia-400 mb-1">
                        {label}
                      </p>
                      <p>
                        <span className="text-green-400 font-medium">
                          Score:
                        </span>{" "}
                        {score}
                      </p>
                      <p>
                        <span className="text-blue-400 font-medium">Time:</span>{" "}
                        {time} sec
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Score"
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Time (sec)"
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={downloadCSV}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:scale-105 transition font-semibold"
        >
          ⬇ Export CSV
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:scale-105 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
