"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// R&B chord progressions using MIDI note numbers
// Classic R&B: ii7 - V7 - Imaj7 - vi7 patterns
const CHORD_PROGRESSIONS = [
  // Dm7 - G7 - Cmaj7 - Am7
  [
    [62, 65, 69, 72], // Dm7
    [67, 71, 74, 77], // G7
    [60, 64, 67, 71], // Cmaj7
    [69, 72, 76, 79], // Am7
  ],
  // Fmaj7 - Em7 - Dm7 - Cmaj7
  [
    [65, 69, 72, 76], // Fmaj7
    [64, 67, 71, 74], // Em7
    [62, 65, 69, 72], // Dm7
    [60, 64, 67, 71], // Cmaj7
  ],
  // Bbmaj7 - Am7 - Gm7 - Fmaj7
  [
    [70, 74, 77, 81], // Bbmaj7
    [69, 72, 76, 79], // Am7
    [67, 70, 74, 77], // Gm7
    [65, 69, 72, 76], // Fmaj7
  ],
];

// Bass notes for each progression
const BASS_PROGRESSIONS = [
  [38, 43, 36, 45], // D2, G2, C2, A2
  [41, 40, 38, 36], // F2, E2, D2, C2
  [46, 45, 43, 41], // Bb2, A2, G2, F2
];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

interface RnBSynthProps {
  isPlaying: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (v: number) => void;
}

export default function RnBSynth({
  isPlaying,
  volume,
  onToggle,
  onVolumeChange,
}: RnBSynthProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chordIndexRef = useRef(0);
  const progressionIndexRef = useRef(0);
  const beatRef = useRef(0);
  const activeOscsRef = useRef<OscillatorNode[]>([]);
  const [currentChordName, setCurrentChordName] = useState("");

  const CHORD_NAMES = [
    ["Dm7", "G7", "Cmaj7", "Am7"],
    ["Fmaj7", "Em7", "Dm7", "Cmaj7"],
    ["Bbmaj7", "Am7", "Gm7", "Fmaj7"],
  ];

  const BPM = 72;
  const BEAT_DURATION = 60 / BPM;

  const stopAllOscillators = useCallback(() => {
    activeOscsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    activeOscsRef.current = [];
  }, []);

  const playChordPad = useCallback(
    (ctx: AudioContext, master: GainNode, notes: number[], duration: number) => {
      const padGain = ctx.createGain();
      padGain.connect(master);
      padGain.gain.setValueAtTime(0, ctx.currentTime);
      padGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
      padGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + duration * 0.7);
      padGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      notes.forEach((note) => {
        // Layer two detuned oscillators for warmth
        [-4, 4].forEach((detune) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(midiToFreq(note), ctx.currentTime);
          osc.detune.setValueAtTime(detune, ctx.currentTime);

          // Soft filter for warmth
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1200, ctx.currentTime);
          filter.Q.setValueAtTime(0.5, ctx.currentTime);

          osc.connect(filter);
          filter.connect(padGain);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + duration + 0.1);
          activeOscsRef.current.push(osc);
        });

        // Add a triangle wave layer for body
        const triOsc = ctx.createOscillator();
        triOsc.type = "triangle";
        triOsc.frequency.setValueAtTime(midiToFreq(note), ctx.currentTime);

        const triGain = ctx.createGain();
        triGain.gain.setValueAtTime(0, ctx.currentTime);
        triGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.4);
        triGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        triOsc.connect(triGain);
        triGain.connect(master);
        triOsc.start(ctx.currentTime);
        triOsc.stop(ctx.currentTime + duration + 0.1);
        activeOscsRef.current.push(triOsc);
      });
    },
    []
  );

  const playBass = useCallback(
    (ctx: AudioContext, master: GainNode, note: number, duration: number) => {
      const bassGain = ctx.createGain();
      bassGain.connect(master);
      bassGain.gain.setValueAtTime(0, ctx.currentTime);
      bassGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      bassGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration * 0.5);
      bassGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(midiToFreq(note), ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      osc.connect(filter);
      filter.connect(bassGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + 0.1);
      activeOscsRef.current.push(osc);

      // Sub bass
      const subOsc = ctx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(midiToFreq(note - 12), ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0, ctx.currentTime);
      subGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      subGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      subOsc.connect(subGain);
      subGain.connect(master);
      subOsc.start(ctx.currentTime);
      subOsc.stop(ctx.currentTime + duration + 0.1);
      activeOscsRef.current.push(subOsc);
    },
    []
  );

  const playHiHat = useCallback(
    (ctx: AudioContext, master: GainNode, accent: boolean) => {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(8000, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(accent ? 0.04 : 0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(ctx.currentTime);
    },
    []
  );

  const playKick = useCallback((ctx: AudioContext, master: GainNode) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
    activeOscsRef.current.push(osc);
  }, []);

  const playSnare = useCallback((ctx: AudioContext, master: GainNode) => {
    // Noise component
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(3000, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    source.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    source.start(ctx.currentTime);

    // Tone component
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0.08, ctx.currentTime);
    toneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(toneGain);
    toneGain.connect(master);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    activeOscsRef.current.push(osc);
  }, []);

  const scheduleBeat = useCallback(
    (ctx: AudioContext, master: GainNode) => {
      const beat = beatRef.current;
      const progIdx = progressionIndexRef.current;
      const chordIdx = chordIndexRef.current;
      const progression = CHORD_PROGRESSIONS[progIdx];
      const bassProgression = BASS_PROGRESSIONS[progIdx];

      // Play chord on beat 0 of each measure (every 4 beats)
      if (beat % 4 === 0) {
        const chord = progression[chordIdx];
        playChordPad(ctx, master, chord, BEAT_DURATION * 4);
        playBass(ctx, master, bassProgression[chordIdx], BEAT_DURATION * 4);
        setCurrentChordName(CHORD_NAMES[progIdx][chordIdx]);

        chordIndexRef.current = (chordIdx + 1) % 4;
        if (chordIndexRef.current === 0) {
          progressionIndexRef.current =
            (progIdx + 1) % CHORD_PROGRESSIONS.length;
        }
      }

      // Drum pattern - subtle R&B groove
      // Kick on 1 and 3 (beats 0 and 2)
      if (beat % 4 === 0 || beat % 4 === 2) {
        playKick(ctx, master);
      }

      // Snare on 2 and 4 (beats 1 and 3)
      if (beat % 4 === 1 || beat % 4 === 3) {
        playSnare(ctx, master);
      }

      // Hi-hat on every beat, accented on off-beats
      playHiHat(ctx, master, beat % 2 === 1);

      beatRef.current = (beat + 1) % 16;
    },
    [playChordPad, playBass, playKick, playSnare, playHiHat, BEAT_DURATION]
  );

  // Initialize or resume audio context
  const startAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;
    }

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current!;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Reset beat counters
    beatRef.current = 0;
    chordIndexRef.current = 0;

    // Schedule beats
    intervalRef.current = setInterval(() => {
      scheduleBeat(ctx, master);
    }, BEAT_DURATION * 1000);
  }, [volume, scheduleBeat, BEAT_DURATION]);

  const stopAudio = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopAllOscillators();
    setCurrentChordName("");
  }, [stopAllOscillators]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [isPlaying, startAudio, stopAudio]);

  // Handle volume changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [stopAudio]);

  return (
    <div className="bg-[#1e1e2e] rounded-2xl p-6 border border-[#313244]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#cdd6f4]">
            R&B Ambient
          </h3>
          <p className="text-sm text-[#a6adc8]">
            {isPlaying
              ? `Playing${currentChordName ? ` \u2022 ${currentChordName}` : ""}`
              : "Smooth beats to help you focus"}
          </p>
        </div>
        <button
          onClick={onToggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "bg-[#f38ba8] shadow-lg shadow-[#f38ba8]/25 hover:bg-[#eba0ac]"
              : "bg-[#cba6f7] shadow-lg shadow-[#cba6f7]/25 hover:bg-[#b4befe]"
          }`}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1e1e2e]"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1e1e2e] ml-1"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#a6adc8] flex-shrink-0"
        >
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
          {volume > 0 && (
            <path d="M15.54,8.46a5,5,0,0,1,0,7.07" />
          )}
          {volume > 0.5 && (
            <path d="M19.07,4.93a10,10,0,0,1,0,14.14" />
          )}
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#cba6f7]"
          style={{
            background: `linear-gradient(to right, #cba6f7 0%, #cba6f7 ${volume * 100}%, #45475a ${volume * 100}%, #45475a 100%)`,
          }}
        />
        <span className="text-xs text-[#a6adc8] w-8 text-right flex-shrink-0">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Visualizer bars */}
      {isPlaying && (
        <div className="flex items-end justify-center gap-1 mt-4 h-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-[#cba6f7] rounded-full opacity-60"
              style={{
                animation: `barPulse ${0.8 + Math.random() * 0.8}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.05}s`,
                height: `${4 + Math.random() * 24}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
