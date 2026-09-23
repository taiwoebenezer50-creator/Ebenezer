import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface DeviceCareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceCareModal: React.FC<DeviceCareModalProps> = ({ isOpen, onClose }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [score, setScore] = useState(94);
  const [freedMb, setFreedMb] = useState(0);

  if (!isOpen) return null;

  const handleOptimize = () => {
    setIsOptimizing(true);
    soundEffects.tap();
    triggerHaptic(20);

    let cur = 94;
    const interval = setInterval(() => {
      cur += 1;
      setScore(cur);
      if (cur >= 100) {
        clearInterval(interval);
        setIsOptimizing(false);
        setFreedMb(640);
        soundEffects.optimizeChime();
        triggerHaptic(30);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#10b981', '#ffffff'],
        });
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-150 select-none">
      {/* Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between p-4 text-white">
        <button
          onClick={() => {
            soundEffects.tap();
            onClose();
          }}
          className="p-1 rounded-full text-white/70 hover:text-white"
        >
          ✕
        </button>
        <span className="text-sm font-semibold tracking-wider uppercase text-white/80">
          Device Care
        </span>
        <div className="w-6" />
      </div>

      {/* Main Gauge */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col items-center justify-center p-6 text-white">
        {/* Circular Progress Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center my-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="7"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="url(#careGrad)"
              strokeWidth="7"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * score) / 100}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="careGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-light tracking-tight text-white">{score}</span>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mt-1">
              {score === 100 ? 'Optimized' : 'Good'}
            </span>
          </div>
        </div>

        {freedMb > 0 && (
          <div className="text-xs text-cyan-300 font-semibold mb-2 animate-bounce">
            ✨ {freedMb} MB RAM freed up!
          </div>
        )}

        {/* 3 Metric Cards: Battery, Storage, Memory */}
        <div className="w-full grid grid-cols-3 gap-2.5 my-4">
          {/* Battery */}
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Battery</span>
            <span className="text-sm font-semibold mt-1">88%</span>
            <span className="text-[9px] text-emerald-400">18h remaining</span>
          </div>

          {/* Storage */}
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Storage</span>
            <span className="text-sm font-semibold mt-1">113.6 GB</span>
            <span className="text-[9px] text-white/60">/ 256 GB</span>
          </div>

          {/* Memory */}
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">RAM</span>
            <span className="text-sm font-semibold mt-1">4.1 GB</span>
            <span className="text-[9px] text-cyan-400">/ 8 GB Ultra</span>
          </div>
        </div>

        {/* Optimize Now Button */}
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || score === 100}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-black font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition cursor-pointer flex items-center justify-center space-x-2"
        >
          {isOptimizing ? (
            <span>Optimizing Note 10...</span>
          ) : score === 100 ? (
            <span>All Good! 100% Perfect</span>
          ) : (
            <span>Optimize Now</span>
          )}
        </button>
      </div>

      <div className="p-4 text-center text-[10px] text-white/40">
        Galaxy Note 10 Intelligent Power Management & Knox Security
      </div>
    </div>
  );
};
