import React from 'react';
import { WALLPAPERS, downloadUHDWallpaper } from '../data/wallpapers';
import { LauncherSettings, IconShape, LauncherGrid } from '../types/launcher';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface GalaxyThemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LauncherSettings;
  onUpdateSettings: (updater: (prev: LauncherSettings) => LauncherSettings) => void;
  onCustomWallpaperUpload: (dataUrl: string) => void;
}

export const GalaxyThemesModal: React.FC<GalaxyThemesModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onCustomWallpaperUpload,
}) => {
  if (!isOpen) return null;

  const handleSelectWallpaper = (id: string) => {
    soundEffects.tap();
    triggerHaptic(12);
    onUpdateSettings((prev) => ({ ...prev, activeWallpaperId: id }));
  };

  const handleDownloadWallpaper = (e: React.MouseEvent, wp: typeof WALLPAPERS[0]) => {
    e.stopPropagation();
    soundEffects.tap();
    triggerHaptic(15);
    downloadUHDWallpaper(wp);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onCustomWallpaperUpload(ev.target.result as string);
          soundEffects.tap();
          triggerHaptic(20);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const shapes: { id: IconShape; label: string }[] = [
    { id: 'squircle', label: 'One UI Squircle' },
    { id: 'circle', label: 'Circle' },
    { id: 'rounded-square', label: 'Square' },
    { id: 'teardrop', label: 'Teardrop' },
  ];

  const grids: LauncherGrid[] = ['4x5', '4x6', '5x5'];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-150 select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between p-4 text-white border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
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
          Galaxy Themes & Ultra HD
        </span>
        <div className="w-6" />
      </div>

      <div className="w-full max-w-md mx-auto p-4 text-white space-y-6 flex-1">
        {/* SECTION 1: ULTRA HD WALLPAPERS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Note 10 4K Ultra HD Wallpapers
            </span>
            <label className="text-xs text-amber-300 font-semibold cursor-pointer hover:underline">
              + Custom Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {WALLPAPERS.map((wp) => {
              const isSelected = settings.activeWallpaperId === wp.id;
              return (
                <div
                  key={wp.id}
                  onClick={() => handleSelectWallpaper(wp.id)}
                  className={`relative rounded-2xl overflow-hidden p-3 border-2 transition active:scale-98 cursor-pointer flex flex-col justify-between h-40 ${
                    isSelected
                      ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-[1.02]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{ background: wp.previewGradient }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold drop-shadow-md text-white">
                      {wp.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-[10px] text-white/80 drop-shadow max-w-[100px] truncate">
                      {wp.subtitle}
                    </span>
                    <button
                      onClick={(e) => handleDownloadWallpaper(e, wp)}
                      className="px-2 py-1 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20 flex items-center space-x-1"
                      title="Download 3040x1440 UHD file"
                    >
                      <span>⬇ 4K</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: HARDWARE FRAME MODE */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Note 10 Hardware Frame</div>
              <div className="text-xs text-white/60">
                Display signature curved bezels & punch hole
              </div>
            </div>
            <button
              onClick={() => {
                soundEffects.tap();
                triggerHaptic(12);
                onUpdateSettings((prev) => ({
                  ...prev,
                  showHardwareFrame: !prev.showHardwareFrame,
                }));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.showHardwareFrame ? 'bg-cyan-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.showHardwareFrame ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECTION 3: ICON SHAPE */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
            Icon Shape
          </span>
          <div className="grid grid-cols-2 gap-2">
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  soundEffects.tap();
                  triggerHaptic(10);
                  onUpdateSettings((prev) => ({ ...prev, iconShape: s.id }));
                }}
                className={`p-3 rounded-2xl border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                  settings.iconShape === s.id
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <span>{s.label}</span>
                {settings.iconShape === s.id && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 4: HOME SCREEN GRID */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
            Home Screen Grid
          </span>
          <div className="flex gap-2">
            {grids.map((g) => (
              <button
                key={g}
                onClick={() => {
                  soundEffects.tap();
                  triggerHaptic(10);
                  onUpdateSettings((prev) => ({ ...prev, grid: g }));
                }}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                  settings.grid === g
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 font-bold'
                    : 'border-white/10 bg-white/5 text-white/70'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
