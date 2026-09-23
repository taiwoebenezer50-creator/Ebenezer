import React, { useState, useEffect } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface StatusBarProps {
  onPullDown: () => void;
  showPunchHole?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ onPullDown, showPunchHole = true }) => {
  const [timeStr, setTimeStr] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(88);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number; addEventListener: (type: string, fn: () => void) => void }> })
        .getBattery()
        .then((bat) => {
          setBatteryLevel(Math.round(bat.level * 100));
        })
        .catch(() => {});
    }
  }, []);

  const handleClick = () => {
    soundEffects.whoosh();
    triggerHaptic(10);
    onPullDown();
  };

  return (
    <div
      onClick={handleClick}
      className="relative z-30 w-full h-8 px-4 flex items-center justify-between text-white text-xs select-none cursor-pointer hover:bg-white/5 transition-colors"
      title="Tap or drag down for Quick Settings & Notifications"
    >
      {/* Left items: Clock + system glyphs */}
      <div className="flex items-center space-x-2 text-[12px] font-medium tracking-tight">
        <span>{timeStr || '12:45'}</span>
        {/* Subtle Samsung icons */}
        <span className="opacity-75 flex items-center space-x-1">
          {/* S-Pen connected tiny dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#00f0ff]" title="S-Pen Connected" />
          {/* Notification dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        </span>
      </div>

      {/* Center: Note 10 iconic Infinity-O front camera punch hole */}
      {showPunchHole && (
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-white/15 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-[#051124] opacity-80" />
          </div>
        </div>
      )}

      {/* Right items: S-Pen / 5G / WiFi / Battery */}
      <div className="flex items-center space-x-2 text-[11px] font-medium">
        {/* S-Pen glyph */}
        <span className="text-cyan-400 font-bold text-[10px] hidden sm:inline-block tracking-tighter">
          S-PEN
        </span>

        {/* 5G icon */}
        <span className="text-[10px] font-extrabold tracking-tighter text-white/90">
          5G
        </span>

        {/* Signal Bars */}
        <svg className="w-3.5 h-3.5 text-white/90" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 22h20V2L2 22z" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg className="w-3.5 h-3.5 text-white/90" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0012 4zm0 3.5c3.73 0 7.12 1.42 9.69 3.75L12 19.34 2.31 11.25C4.88 8.92 8.27 7.5 12 7.5z" />
        </svg>

        {/* Battery with percentage */}
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-medium">{batteryLevel}%</span>
          <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-[1px] flex items-center relative">
            <div
              className="h-full rounded-[1px] bg-white transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(10, batteryLevel))}%` }}
            />
            <div className="w-[1.5px] h-1 bg-white/80 absolute -right-[2.5px] top-[2px] rounded-r-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
