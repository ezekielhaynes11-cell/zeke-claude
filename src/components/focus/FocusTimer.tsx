"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const MODES: Record<TimerMode, { label: string; minutes: number; color: string }> = {
  focus: { label: "Focus", minutes: 25, color: "#cba6f7" },
  shortBreak: { label: "Short Break", minutes: 5, color: "#a6e3a1" },
  longBreak: { label: "Long Break", minutes: 15, color: "#89b4fa" },
};

export default function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setTimeLeft(MODES[newMode].minutes * 60);
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    []
  );

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer complete
            setIsRunning(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            if (mode === "focus") {
              setSessions((s) => s + 1);
              // Auto-switch to break
              const nextMode =
                (sessions + 1) % 4 === 0 ? "longBreak" : "shortBreak";
              setTimeout(() => switchMode(nextMode), 500);
            } else {
              setTimeout(() => switchMode("focus"), 500);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, sessions, switchMode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = MODES[mode].minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const modeColor = MODES[mode].color;

  return (
    <div className="bg-[#1e1e2e] rounded-2xl p-6 border border-[#313244]">
      {/* Mode selector */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? "text-[#1e1e2e]"
                : "bg-[#313244] text-[#a6adc8] hover:bg-[#45475a]"
            }`}
            style={mode === m ? { backgroundColor: MODES[m].color } : {}}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex justify-center mb-6">
        <div className="relative w-52 h-52">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 200 200"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#313244"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={modeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 8px ${modeColor}40)` }}
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-5xl font-bold font-mono tracking-wider"
              style={{ color: modeColor }}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs text-[#a6adc8] mt-1 uppercase tracking-widest">
              {MODES[mode].label}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-[#313244] flex items-center justify-center hover:bg-[#45475a] transition-colors"
          aria-label="Reset timer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a6adc8"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="1,4 1,10 7,10" />
            <path d="M3.51,15a9,9,0,1,0,.49-7.5L1,10" />
          </svg>
        </button>

        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
          style={{
            backgroundColor: modeColor,
            boxShadow: `0 4px 20px ${modeColor}40`,
          }}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="#1e1e2e"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="#1e1e2e"
              className="ml-1"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <button
          onClick={() => {
            if (mode === "focus") {
              switchMode("shortBreak");
            } else {
              switchMode("focus");
            }
          }}
          className="w-10 h-10 rounded-full bg-[#313244] flex items-center justify-center hover:bg-[#45475a] transition-colors"
          aria-label="Skip to next"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a6adc8"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polygon points="5,4 15,12 5,20" fill="#a6adc8" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* Session counter */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                backgroundColor:
                  i < sessions % 4 ? modeColor : "#313244",
                boxShadow:
                  i < sessions % 4 ? `0 0 6px ${modeColor}60` : "none",
              }}
            />
          ))}
        </div>
        <span className="text-xs text-[#a6adc8] ml-2">
          {sessions} session{sessions !== 1 ? "s" : ""} completed
        </span>
      </div>
    </div>
  );
}
