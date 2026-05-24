// components/StatsDisplay.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function StatsDisplay() {
  const [stats, setStats] = useState({
    signups: 0,
    quizzesCreated: 0,
    quizzesAttempted: 0,
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stats`).then((res) => {
      setStats(res.data);
    });

    const interval = setInterval(() => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/stats`)
        .then((res) => setStats(res.data));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const FlipNumber = ({ value }) => (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ rotateX: 90, opacity: 0, y: 10 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        exit={{ rotateX: -90, opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="inline-block w-10 md:w-12 text-center font-bold text-white"
      >
        {value ?? 0}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <div
      className="
        flex flex-wrap justify-center items-center gap-4 sm:gap-8
        text-base sm:text-lg md:text-xl font-bold tracking-wide
        text-gray-200
      "
    >
      {/* Signups */}
      <motion.div
        initial={{ color: "#edf2f7" }}
        whileHover={{
          scale: 1.1,
          color: "#ec4899", // fuchsia
          textShadow: "0 0 10px #ec4899",
        }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="text-pink-600 text-xl">❤️</span>
        <FlipNumber value={stats.signups} />
        <span>Signups</span>
      </motion.div>

      {/* Divider */}
      <span className="hidden sm:inline text-gray-500 font-extrabold">|</span>

      {/* Created */}
      <motion.div
        initial={{ color: "#edf2f7" }}
        whileHover={{
          scale: 1.1,
          color: "#6366f1", // indigo
          textShadow: "0 0 10px #6366f1",
        }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="text-indigo-600 text-xl">🦋</span>
        <FlipNumber value={stats.quizzesCreated} />
        <span>Created</span>
      </motion.div>

      {/* Divider */}
      <span className="hidden sm:inline text-gray-500 font-extrabold">|</span>

      {/* Attempted */}
      <motion.div
        initial={{ color: "#edf2f7" }}
        whileHover={{
          scale: 1.1,
          color: "#eab308", // amber
          textShadow: "0 0 10px #facc15",
        }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="text-yellow-500 text-xl">🏆</span>
        <FlipNumber value={stats.quizzesAttempted} />
        <span>Attempted</span>
      </motion.div>
    </div>
  );
}
