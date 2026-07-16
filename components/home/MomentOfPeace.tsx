"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

const TOTAL_SECONDS = 60;

/**
 * "A Moment of Peace" — a silent 60-second visual pause. No audio,
 * nothing autoplays; the visitor starts it themselves.
 */
export default function MomentOfPeace() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const progress = (TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS;
  const circumference = 2 * Math.PI * 54;
  const finished = secondsLeft === 0;

  function toggle() {
    if (finished) {
      setSecondsLeft(TOTAL_SECONDS);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(TOTAL_SECONDS);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-midnight-700"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="text-gold-400 transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-cream-50"
          role="timer"
          aria-live="off"
          aria-label={`${secondsLeft} seconds remaining`}
        >
          {finished ? "Amen" : `0:${String(secondsLeft).padStart(2, "0")}`}
        </div>
      </div>

      <p className="mt-8 font-serif text-xl text-cream-50">
        &ldquo;Take a breath. Be still. Remember that you are loved by
        God.&rdquo;
      </p>
      <p className="mt-3 text-sm text-midnight-100">
        &ldquo;Be still, and know that I am God.&rdquo; — Psalm 46:10
      </p>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold-400 px-7 py-3 font-semibold text-midnight-950 transition-colors hover:bg-gold-300"
        >
          {running ? (
            <>
              <Pause className="h-5 w-5" aria-hidden /> Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5" aria-hidden />
              {finished ? "Begin Again" : "Begin"}
            </>
          )}
        </button>
        {secondsLeft !== TOTAL_SECONDS && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-cream-50/60 px-6 py-3 font-semibold text-cream-50 transition-colors hover:border-gold-300 hover:text-gold-300"
          >
            <RotateCcw className="h-5 w-5" aria-hidden /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
