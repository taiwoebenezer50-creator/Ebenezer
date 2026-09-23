import React from 'react';
import confetti from 'canvas-confetti';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isSamsungBrowser, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    soundEffects.tap();
    triggerHaptic(20);
    const success = await install();
    if (success) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff007f', '#ffd269', '#ffffff'],
      });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-[#0a0c16] border border-cyan-500/30 p-6 text-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white"
        >
          ✕
        </button>

        {/* Note 10 App Icon Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="w-18 h-18 rounded-[26%] bg-gradient-to-br from-[#0a0b12] to-[#1a2035] border border-cyan-400/40 p-1 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center mb-3">
            <img src="/icon.svg" alt="Note 10 Launcher" className="w-14 h-14" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Install Note 10 Launcher
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-xs">
            Experience ultra-crisp AMOLED wallpapers, S-Pen Air Command, and One UI fluidity on your home screen.
          </p>
        </div>

        {/* Status / Install Action Container */}
        <div className="mt-6 space-y-4">
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center">
              <span className="text-sm font-semibold text-emerald-300 block">
                ✓ Launcher Already Installed!
              </span>
              <span className="text-xs text-white/60 mt-1 block">
                Running in full standalone mode on your device.
              </span>
            </div>
          ) : isInstallable ? (
            /* Chromium / Android native prompt */
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:opacity-95 active:scale-95 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download & Install Now</span>
            </button>
          ) : isIOS ? (
            /* iOS Safari step-by-step guide */
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-cyan-300">How to install on iOS:</div>
              <div className="flex items-start space-x-2 text-white/80">
                <span className="font-bold text-cyan-400">1.</span>
                <span>Tap the <strong>Share</strong> button (box with upward arrow) in Safari.</span>
              </div>
              <div className="flex items-start space-x-2 text-white/80">
                <span className="font-bold text-cyan-400">2.</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-start space-x-2 text-white/80">
                <span className="font-bold text-cyan-400">3.</span>
                <span>Launch the Galaxy Note 10 Launcher from your phone screen.</span>
              </div>
            </div>
          ) : isSamsungBrowser ? (
            /* Samsung Internet browser tips */
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-cyan-300">Samsung Internet installation:</div>
              <div className="text-white/80">
                Tap the <strong>Download / Install icon</strong> located at the right end of the address bar or the bottom menu (☰) &gt; <strong>Add page to</strong> &gt; <strong>App screen</strong>.
              </div>
            </div>
          ) : (
            /* Desktop or fallback */
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center space-y-2 text-xs">
              <div className="font-semibold text-cyan-300">Standalone App Ready</div>
              <p className="text-white/70">
                Click the install icon in your browser address bar or use Chrome menu &gt; <strong>Install Galaxy Note 10 Launcher</strong>.
              </p>
            </div>
          )}

          {/* Offline & Features Checklist */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-white/70">
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-bold">⚡</span>
              <span>100% Offline Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-bold">🎨</span>
              <span>Ultra HD 4K Wallpapers</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-bold">✍️</span>
              <span>S-Pen Air Command</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-bold">📱</span>
              <span>Zero-lag One UI</span>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white/90 transition cursor-pointer"
          >
            Continue in Launcher
          </button>
        </div>
      </div>
    </div>
  );
};
