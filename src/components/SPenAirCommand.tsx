import React, { useState } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface SPenAirCommandProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenNotes: () => void;
  onOpenScreenWrite: () => void;
  onOpenSmartSelect: () => void;
  onOpenAirActions: () => void;
  onOpenPENUP: () => void;
  showFloatingTrigger?: boolean;
}

export const SPenAirCommand: React.FC<SPenAirCommandProps> = ({
  isOpen,
  onToggle,
  onOpenNotes,
  onOpenScreenWrite,
  onOpenSmartSelect,
  onOpenAirActions,
  onOpenPENUP,
  showFloatingTrigger = true,
}) => {
  const [position] = useState({ bottom: '24%', right: '18px' });

  const airCommands = [
    {
      id: 'create_note',
      label: 'Create note',
      icon: (
        <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      ),
      action: () => {
        onToggle();
        onOpenNotes();
      },
    },
    {
      id: 'smart_select',
      label: 'Smart select',
      icon: (
        <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      action: () => {
        onToggle();
        onOpenSmartSelect();
      },
    },
    {
      id: 'screen_write',
      label: 'Screen write',
      icon: (
        <svg className="w-5 h-5 text-rose-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
        </svg>
      ),
      action: () => {
        onToggle();
        onOpenScreenWrite();
      },
    },
    {
      id: 'air_actions',
      label: 'Air actions',
      icon: (
        <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      action: () => {
        onToggle();
        onOpenAirActions();
      },
    },
    {
      id: 'penup',
      label: 'PENUP art',
      icon: (
        <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.57 10.6 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
        </svg>
      ),
      action: () => {
        onToggle();
        onOpenPENUP();
      },
    },
  ];

  return (
    <>
      {/* Floating S-Pen Trigger Button */}
      {showFloatingTrigger && !isOpen && (
        <div
          style={{ bottom: position.bottom, right: position.right }}
          className="absolute z-30 select-none"
        >
          <button
            onClick={() => {
              soundEffects.spenClick();
              triggerHaptic(15);
              onToggle();
            }}
            className="group relative w-12 h-12 rounded-full bg-slate-900/90 border border-cyan-400/50 shadow-[0_0_18px_rgba(0,240,255,0.4)] flex items-center justify-center text-cyan-400 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            title="S-Pen Air Command"
          >
            {/* Pulsing halo */}
            <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-75" />
            {/* Note 10 Stylus S-Pen Icon */}
            <svg className="w-6 h-6 text-cyan-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>
      )}

      {/* S-Pen Radial / Fan Air Command Menu Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => {
            soundEffects.spenClick();
            onToggle();
          }}
        >
          <div
            className="relative w-full max-w-sm flex flex-col items-end space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Battery badge for S-Pen */}
            <div className="w-full flex items-center justify-between px-2 text-cyan-300 text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>S-Pen Battery 100%</span>
              </div>
              <button
                onClick={() => {
                  soundEffects.spenClick();
                  onToggle();
                }}
                className="p-1 rounded-full text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Radial Fan Commands */}
            <div className="w-full space-y-2.5 pt-2">
              {airCommands.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    soundEffects.spenClick();
                    triggerHaptic(15);
                    cmd.action();
                  }}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all text-white group cursor-pointer animate-in slide-in-from-right duration-200"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                      {cmd.icon}
                    </div>
                    <span className="text-sm font-medium tracking-tight text-white/95">
                      {cmd.label}
                    </span>
                  </div>
                  <span className="text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition text-xs">
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* Note 10 Stylus graphic footnote */}
            <div className="text-[11px] text-white/50 pt-2 text-center w-full">
              Press S-Pen button or hover near screen for Air Actions
            </div>
          </div>
        </div>
      )}
    </>
  );
};
