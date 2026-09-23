import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  showFrame: boolean;
  edgeLightingActive: boolean;
  edgeLightingColor: string;
  activeWallpaperCss: string;
  eyeComfortActive: boolean;
  brightness: number;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  showFrame,
  edgeLightingActive,
  edgeLightingColor,
  activeWallpaperCss,
  eyeComfortActive,
  brightness,
}) => {
  // If user disabled hardware frame (or is running in real full-screen device mode)
  if (!showFrame) {
    return (
      <div
        className="relative w-full h-screen overflow-hidden flex flex-col transition-all duration-300"
        style={{
          background: activeWallpaperCss,
          filter: `brightness(${brightness}%) ${eyeComfortActive ? 'sepia(30%) hue-rotate(-20deg)' : ''}`,
        }}
      >
        {/* Edge Lighting Ambient Glow */}
        {edgeLightingActive && (
          <div
            className="absolute inset-0 pointer-events-none z-50 edge-lighting-glow"
            style={{ borderColor: edgeLightingColor }}
          />
        )}
        {children}
      </div>
    );
  }

  // Hardware Frame Mode: Samsung Galaxy Note 10 physical mockup
  return (
    <div className="min-h-screen w-full bg-[#05060a] flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Galaxy Note 10 Physical Chassis */}
      <div className="relative w-full max-w-[430px] h-[92vh] max-h-[890px] rounded-[46px] p-[10px] bg-gradient-to-br from-[#2a3045] via-[#101422] to-[#080a12] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-white/20 flex flex-col">
        {/* Left Side Buttons (Volume Rocker + Bixby/Power Button - Note 10 signature layout) */}
        <div className="absolute -left-[5px] top-28 w-[5px] h-20 bg-slate-600 rounded-l-md shadow-md" title="Volume Keys" />
        <div className="absolute -left-[5px] top-54 w-[5px] h-12 bg-slate-600 rounded-l-md shadow-md" title="Power Key" />

        {/* Screen Display Bezel */}
        <div
          className="relative flex-1 w-full h-full rounded-[38px] overflow-hidden flex flex-col transition-all duration-300 shadow-inner"
          style={{
            background: activeWallpaperCss,
            filter: `brightness(${brightness}%) ${eyeComfortActive ? 'sepia(30%) hue-rotate(-20deg)' : ''}`,
          }}
        >
          {/* Subtle curved glass edge highlight (left & right 3D reflection) */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/15 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-white/15 to-transparent pointer-events-none z-20" />

          {/* Edge Lighting Ambient Border Glow */}
          {edgeLightingActive && (
            <div
              className="absolute inset-0 pointer-events-none z-50 edge-lighting-glow"
              style={{ borderColor: edgeLightingColor }}
            />
          )}

          {children}
        </div>

        {/* Bottom S-Pen Ejector slot accent & speaker chin */}
        <div className="absolute -bottom-1 right-12 w-8 h-1.5 bg-cyan-400/40 rounded-b-md blur-[0.5px]" title="S-Pen Silo" />
      </div>
    </div>
  );
};
