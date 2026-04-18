"use client";

import { useState } from "react";

type Timeframe = "day" | "week";

interface Manifestation {
  id: string;
  text: string;
  affirmation: string;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
  glow: string;
  items: Manifestation[];
}

const CATEGORIES: Category[] = [
  {
    id: "health",
    label: "Health",
    emoji: "🌿",
    color: "from-emerald-900/60 to-green-900/40 border-emerald-500/40",
    glow: "shadow-emerald-500/30",
    items: [
      { id: "h1", text: "Vibrant Energy", affirmation: "Your body radiates with unstoppable vitality." },
      { id: "h2", text: "Mental Clarity", affirmation: "Your mind is sharp, focused, and at peace." },
      { id: "h3", text: "Deep Rest", affirmation: "You wake each day fully restored and renewed." },
      { id: "h4", text: "Physical Strength", affirmation: "Your body grows stronger with every breath." },
      { id: "h5", text: "Emotional Balance", affirmation: "You move through life grounded and centered." },
      { id: "h6", text: "Glowing Wellness", affirmation: "Health and vitality flow naturally to you." },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    emoji: "💰",
    color: "from-yellow-900/60 to-amber-900/40 border-yellow-500/40",
    glow: "shadow-yellow-500/30",
    items: [
      { id: "f1", text: "Abundance", affirmation: "Money flows to you freely and effortlessly." },
      { id: "f2", text: "Career Growth", affirmation: "New opportunities seek you out every day." },
      { id: "f3", text: "Financial Freedom", affirmation: "You are liberated from financial worry forever." },
      { id: "f4", text: "Wealth Building", affirmation: "Your investments multiply and grow with ease." },
      { id: "f5", text: "Dream Business", affirmation: "Your vision transforms into thriving success." },
      { id: "f6", text: "Generous Living", affirmation: "You have more than enough to give freely." },
    ],
  },
  {
    id: "relationships",
    label: "Relationships",
    emoji: "❤️",
    color: "from-rose-900/60 to-pink-900/40 border-rose-500/40",
    glow: "shadow-rose-500/30",
    items: [
      { id: "r1", text: "Deep Connection", affirmation: "Love surrounds you in every relationship." },
      { id: "r2", text: "True Partnership", affirmation: "Your perfect partner is drawn to you now." },
      { id: "r3", text: "Lasting Friendships", affirmation: "You attract loyal and uplifting people." },
      { id: "r4", text: "Family Harmony", affirmation: "Peace and love fill your home completely." },
      { id: "r5", text: "Self-Love", affirmation: "You are worthy of all the love you desire." },
      { id: "r6", text: "New Beginnings", affirmation: "Beautiful connections are entering your life." },
    ],
  },
  {
    id: "growth",
    label: "Personal Growth",
    emoji: "✨",
    color: "from-violet-900/60 to-purple-900/40 border-violet-500/40",
    glow: "shadow-violet-500/30",
    items: [
      { id: "g1", text: "Confidence", affirmation: "You walk into every room owning your power." },
      { id: "g2", text: "Purpose", affirmation: "Your path is clear and filled with meaning." },
      { id: "g3", text: "Creativity", affirmation: "Brilliant ideas flow through you constantly." },
      { id: "g4", text: "Inner Peace", affirmation: "You are calm in the eye of any storm." },
      { id: "g5", text: "Wisdom", affirmation: "Every experience makes you wiser and stronger." },
      { id: "g6", text: "Gratitude", affirmation: "Blessings multiply the more you appreciate them." },
    ],
  },
];

export default function ManifestationTracker() {
  const [timeframe, setTimeframe] = useState<Timeframe>("day");
  const [manifested, setManifested] = useState<Set<string>>(new Set());
  const [lastAffirmation, setLastAffirmation] = useState<{ text: string; id: string } | null>(null);

  function toggle(item: Manifestation) {
    setManifested((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        setLastAffirmation(null);
      } else {
        next.add(item.id);
        setLastAffirmation({ text: item.affirmation, id: item.id });
      }
      return next;
    });
  }

  const totalManifested = manifested.size;
  const timeLabel = timeframe === "day" ? "today" : "this week";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="text-center pt-16 pb-8 px-4">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-3 font-medium">
          Your Reality Begins Here
        </p>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-200 bg-clip-text text-transparent mb-4">
          Manifest Your Day
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Choose what you&apos;re calling into your life. Click to claim it. The universe is listening.
        </p>
      </div>

      {/* Timeframe Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/5 border border-white/10 rounded-full p-1 flex gap-1">
          {(["day", "week"] as Timeframe[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize ${
                timeframe === t
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "day" ? "Today" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {/* Affirmation Banner */}
      <div
        className={`mx-4 md:mx-auto max-w-2xl mb-10 transition-all duration-500 ${
          lastAffirmation ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-500/40 rounded-2xl p-5 text-center shadow-lg shadow-purple-500/20">
          <p className="text-xs uppercase tracking-widest text-purple-300 mb-2">✦ It is done ✦</p>
          <p className="text-white text-lg font-medium italic">&ldquo;{lastAffirmation?.text}&rdquo;</p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 shadow-xl ${cat.glow}`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{cat.emoji}</span>
              <h2 className="text-xl font-bold text-white">{cat.label}</h2>
              <span className="ml-auto text-xs text-gray-400">
                {[...manifested].filter((id) => cat.items.some((i) => i.id === id)).length}/{cat.items.length} claimed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cat.items.map((item) => {
                const active = manifested.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item)}
                    className={`relative group rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all duration-300 border ${
                      active
                        ? "bg-white/20 border-white/40 text-white scale-[1.03] shadow-lg"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-[1.02]"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-2 right-2 text-xs">✓</span>
                    )}
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      {totalManifested > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-md border-t border-white/10 py-4 px-6">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <p className="text-gray-300 text-sm">
              <span className="text-white font-bold text-lg">{totalManifested}</span>{" "}
              {totalManifested === 1 ? "intention" : "intentions"} set {timeLabel}
            </p>
            <p className="text-purple-300 text-sm font-medium">
              ✦ The universe has received your order ✦
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
