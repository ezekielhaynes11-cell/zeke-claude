"use client";

import { useState } from "react";
import RnBSynth from "@/components/focus/RnBSynth";
import FocusTimer from "@/components/focus/FocusTimer";
import TaskList from "@/components/focus/TaskList";

export default function FocusPage() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  return (
    <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] relative overflow-hidden">
      {/* Ambient background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: musicPlaying
            ? "radial-gradient(ellipse at 30% 20%, rgba(203,166,247,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(243,139,168,0.04) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(203,166,247,0.03) 0%, transparent 60%)",
          transition: "background 2s ease",
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-[#313244]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#cba6f7] flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1e1e2e"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-[#cba6f7]">Focus</span>
              <span className="text-[#a6adc8]">Flow</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {musicPlaying && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1e1e2e] rounded-full border border-[#313244]">
                <div className="flex items-end gap-0.5 h-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-[#cba6f7] rounded-full"
                      style={{
                        animation: `barPulse ${0.5 + i * 0.2}s ease-in-out infinite alternate`,
                        height: `${6 + i * 3}px`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#a6adc8] ml-1.5">R&B</span>
              </div>
            )}
            <a
              href="/"
              className="text-sm text-[#a6adc8] hover:text-[#cdd6f4] transition-colors px-3 py-1.5"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Get in the <span className="text-[#cba6f7]">zone</span>
          </h2>
          <p className="text-[#a6adc8] max-w-md mx-auto">
            Smooth R&B beats, Pomodoro timer, and task tracking. Everything you
            need for deep focus.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Timer */}
          <div className="lg:col-span-1 space-y-6">
            <FocusTimer />
          </div>

          {/* Center column - Music + Quote */}
          <div className="lg:col-span-1 space-y-6">
            <RnBSynth
              isPlaying={musicPlaying}
              volume={volume}
              onToggle={() => setMusicPlaying(!musicPlaying)}
              onVolumeChange={setVolume}
            />

            {/* Mood selector */}
            <div className="bg-[#1e1e2e] rounded-2xl p-6 border border-[#313244]">
              <h3 className="text-lg font-semibold text-[#cdd6f4] mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMusicPlaying(true);
                    setVolume(0.4);
                  }}
                  className="flex items-center gap-2 bg-[#313244] hover:bg-[#45475a] rounded-lg px-3 py-2.5 transition-colors text-left"
                >
                  <span className="text-lg">🎵</span>
                  <div>
                    <div className="text-sm text-[#cdd6f4]">Low Volume</div>
                    <div className="text-xs text-[#585b70]">Background vibes</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setMusicPlaying(true);
                    setVolume(0.8);
                  }}
                  className="flex items-center gap-2 bg-[#313244] hover:bg-[#45475a] rounded-lg px-3 py-2.5 transition-colors text-left"
                >
                  <span className="text-lg">🔊</span>
                  <div>
                    <div className="text-sm text-[#cdd6f4]">High Volume</div>
                    <div className="text-xs text-[#585b70]">Full immersion</div>
                  </div>
                </button>
                <button
                  onClick={() => setMusicPlaying(false)}
                  className="flex items-center gap-2 bg-[#313244] hover:bg-[#45475a] rounded-lg px-3 py-2.5 transition-colors text-left"
                >
                  <span className="text-lg">🔇</span>
                  <div>
                    <div className="text-sm text-[#cdd6f4]">Silence</div>
                    <div className="text-xs text-[#585b70]">Total quiet</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setMusicPlaying(true);
                    setVolume(0.6);
                  }}
                  className="flex items-center gap-2 bg-[#313244] hover:bg-[#45475a] rounded-lg px-3 py-2.5 transition-colors text-left"
                >
                  <span className="text-lg">✨</span>
                  <div>
                    <div className="text-sm text-[#cdd6f4]">Balanced</div>
                    <div className="text-xs text-[#585b70]">Just right</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column - Tasks */}
          <div className="lg:col-span-1 space-y-6">
            <TaskList />

            {/* Tips card */}
            <div className="bg-[#1e1e2e] rounded-2xl p-6 border border-[#313244]">
              <h3 className="text-lg font-semibold text-[#cdd6f4] mb-3">
                Focus Tips
              </h3>
              <ul className="space-y-2.5 text-sm text-[#a6adc8]">
                <li className="flex items-start gap-2">
                  <span className="text-[#cba6f7] mt-0.5">&#9679;</span>
                  Work in 25-minute blocks with 5-minute breaks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-0.5">&#9679;</span>
                  Music at low volume helps maintain flow state
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-0.5">&#9679;</span>
                  Write down distracting thoughts, address them later
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#89b4fa] mt-0.5">&#9679;</span>
                  After 4 focus sessions, take a longer 15-minute break
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#313244]/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-[#585b70]">
            FocusFlow &mdash; Stay in the zone
          </span>
          <span className="text-xs text-[#585b70]">
            Built with Web Audio API
          </span>
        </div>
      </footer>

      {/* Global keyframe animation for visualizer bars */}
      <style jsx global>{`
        @keyframes barPulse {
          0% {
            height: 4px;
            opacity: 0.4;
          }
          100% {
            height: 28px;
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
