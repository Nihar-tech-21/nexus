import { useEffect, useRef, useState, memo } from "react";
import tickSound from "../../assets/timer.mp3";

function TimerPill({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const beepRef = useRef(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(tickSound);
    beepRef.current.loop = true;
    beepRef.current.volume = 0.4;
    return () => {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    };
  }, []);

  // Start or reset timer
  useEffect(() => {
    setTimeLeft(duration);
    startTimeRef.current = Date.now();

    if (beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play().catch(() => {});
    }

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setTimeLeft(0);
        beepRef.current.pause();
        beepRef.current.currentTime = 0;
        onTimeUp();
      } else {
        setTimeLeft(remaining);
      }
    }, 250); // check 4 times per sec, smoother and decoupled from re-render

    return () => {
      clearInterval(intervalRef.current);
      if (beepRef.current) {
        beepRef.current.pause();
        beepRef.current.currentTime = 0;
      }
    };
  }, [duration, onTimeUp]);

  // Fast beep for last 5 seconds
  useEffect(() => {
    if (!beepRef.current) return;
    beepRef.current.playbackRate = timeLeft <= 5 ? 1.5 : 1.0;
  }, [timeLeft]);

  return (
    <div
      className={`px-4 py-2 rounded-full mb-4 font-semibold shadow-lg transition-all duration-500 ${
        timeLeft <= 5 ? "bg-red-600" : "bg-blue-600"
      } text-white`}
    >
      ⏱ {timeLeft}s left
    </div>
  );
}

export default memo(TimerPill);
