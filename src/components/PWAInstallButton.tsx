import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenModal }) => {
  const { isInstalled } = usePWAInstall();

  if (isInstalled) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.tap();
    triggerHaptic(15);
    onOpenModal();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/80 via-blue-600/80 to-purple-600/80 hover:from-cyan-400 hover:to-purple-500 text-white text-[11px] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-cyan-300/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
      title="Install Galaxy Note 10 Launcher"
    >
      <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Install App</span>
    </button>
  );
};
