import React, { useState } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface AirActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirActionsModal: React.FC<AirActionsModalProps> = ({ isOpen, onClose }) => {
  const [activeGesture, setActiveGesture] = useState<string>('Ready for gesture');
  const [gestureFeedback, setGestureFeedback] = useState<string>('');

  if (!isOpen) return null;

  const triggerGesture = (name: string, description: string) => {
    soundEffects.spenClick();
    triggerHaptic(18);
    setActiveGesture(name);
    setGestureFeedback(description);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 text-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold">S-Pen Air Actions</h3>
            <p className="text-xs text-white/60">Bluetooth 6-axis motion sensors</p>
          </div>
        </div>

        {/* Live Simulation Display */}
        <div className="bg-black/60 rounded-2xl p-5 text-center border border-white/10 mb-4">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
            {activeGesture}
          </div>
          <div className="text-sm font-semibold text-white min-h-[24px]">
            {gestureFeedback || 'Select an S-Pen gesture below to test motion feedback.'}
          </div>
        </div>

        {/* Interactive Gesture Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => triggerGesture('Single Click', '📸 Triggered Camera Shutter')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-left cursor-pointer transition active:scale-95"
          >
            <div className="font-bold text-cyan-300">Single Click</div>
            <div className="text-[10px] text-white/60">Shutter / Play</div>
          </button>

          <button
            onClick={() => triggerGesture('Double Click', '🔄 Switched Camera Front/Rear')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-left cursor-pointer transition active:scale-95"
          >
            <div className="font-bold text-cyan-300">Double Click</div>
            <div className="text-[10px] text-white/60">Flip Camera Mode</div>
          </button>

          <button
            onClick={() => triggerGesture('Swipe Right', '➡️ Next Track / Photo slide')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-left cursor-pointer transition active:scale-95"
          >
            <div className="font-bold text-cyan-300">Air Flick Right</div>
            <div className="text-[10px] text-white/60">Next Item</div>
          </button>

          <button
            onClick={() => triggerGesture('Swipe Left', '⬅️ Previous Track / Photo slide')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-left cursor-pointer transition active:scale-95"
          >
            <div className="font-bold text-cyan-300">Air Flick Left</div>
            <div className="text-[10px] text-white/60">Previous Item</div>
          </button>

          <button
            onClick={() => triggerGesture('Swipe Up', '🔊 Volume Up (+10%)')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-left cursor-pointer transition active:scale-95"
          >
            <div className="font-bold text-cyan-300">Air Flick Up</div>
            <div className="text-[10px] text-white/60">Volume Up</div>
          </button>

          <button
            onClick={() => triggerGesture('Circle Clockwise', '🔍 Zoom In Viewfinder 1.5x')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-left cursor-pointer transition active:scale-95"
          >
            <div className="font-bold text-cyan-300">Air Circle</div>
            <div className="text-[10px] text-white/60">Zoom In/Out</div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
