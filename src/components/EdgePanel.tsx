import React, { useState, useEffect } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';
import { AppItem } from '../types/launcher';
import { SYSTEM_APPS } from '../data/apps';

interface EdgePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenApp: (appId: string) => void;
  onTriggerEdgeLighting: () => void;
}

export const EdgePanel: React.FC<EdgePanelProps> = ({
  isOpen,
  onToggle,
  onOpenApp,
  onTriggerEdgeLighting,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'tools' | 'contacts'>('apps');
  const [compassHeading, setCompassHeading] = useState(42);
  const [isTorchActive, setIsTorchActive] = useState(false);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const iosHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (iosHeading !== undefined) {
        setCompassHeading(Math.round(iosHeading));
      } else if (e.alpha !== null) {
        setCompassHeading(Math.round(360 - e.alpha));
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const edgeApps = SYSTEM_APPS.filter((a) =>
    ['phone', 'messages', 'camera', 'snotes', 'calculator', 'internet', 'device_care', 'install_app'].includes(
      a.id
    )
  );

  const contacts = [
    { name: 'Sarah M.', phone: '+1 555-0192', color: 'bg-indigo-500' },
    { name: 'Alex K.', phone: '+1 555-0144', color: 'bg-emerald-500' },
    { name: 'David L.', phone: '+1 555-0178', color: 'bg-rose-500' },
    { name: 'Elena R.', phone: '+1 555-0123', color: 'bg-amber-500' },
  ];

  return (
    <>
      {/* Edge Handle (Draggable tab positioned on the right bezel) */}
      {!isOpen && (
        <button
          onClick={() => {
            soundEffects.whoosh();
            triggerHaptic(12);
            onToggle();
          }}
          className="absolute right-0 top-1/3 -translate-y-1/2 z-30 w-3.5 h-20 bg-cyan-400/80 hover:bg-cyan-300 rounded-l-full shadow-[-2px_0_12px_rgba(0,240,255,0.6)] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
          title="Samsung Note 10 Edge Panel"
        >
          <div className="w-1 h-8 rounded-full bg-black/40" />
        </button>
      )}

      {/* Edge Panel Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end"
          onClick={onToggle}
        >
          <div
            className="w-72 h-full bg-[#121624]/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between p-4 text-white animate-in slide-in-from-right duration-200 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Edge Panel Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                  <span className="text-xs font-bold tracking-wider uppercase text-cyan-400">
                    Edge Screen
                  </span>
                </div>
                <button
                  onClick={onToggle}
                  className="p-1 rounded-full text-white/60 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Edge Tab Selector */}
              <div className="flex bg-white/5 rounded-xl p-1 my-3">
                <button
                  onClick={() => {
                    soundEffects.tap();
                    setActiveTab('apps');
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'apps' ? 'bg-cyan-500 text-black font-semibold' : 'text-white/70'
                  }`}
                >
                  Apps
                </button>
                <button
                  onClick={() => {
                    soundEffects.tap();
                    setActiveTab('tools');
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'tools' ? 'bg-cyan-500 text-black font-semibold' : 'text-white/70'
                  }`}
                >
                  Tools
                </button>
                <button
                  onClick={() => {
                    soundEffects.tap();
                    setActiveTab('contacts');
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'contacts' ? 'bg-cyan-500 text-black font-semibold' : 'text-white/70'
                  }`}
                >
                  People
                </button>
              </div>

              {/* TAB CONTENT: APPS EDGE */}
              {activeTab === 'apps' && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {edgeApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        soundEffects.tap();
                        triggerHaptic(12);
                        onOpenApp(app.id);
                        onToggle();
                      }}
                      className="flex flex-col items-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition active:scale-95 group cursor-pointer"
                    >
                      <div
                        className="w-12 h-12 rounded-[26%] flex items-center justify-center shadow-md mb-2 group-hover:scale-105 transition"
                        style={{ background: app.iconBg }}
                      >
                        <AppIconSimple type={app.iconType} />
                      </div>
                      <span className="text-xs font-medium text-white/90 truncate w-full text-center">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB CONTENT: QUICK TOOLS */}
              {activeTab === 'tools' && (
                <div className="space-y-4 mt-2">
                  {/* Digital Compass */}
                  <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-white/60 mb-2 uppercase tracking-wider">
                      Digital Compass
                    </span>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {/* Compass dial */}
                      <div
                        className="w-full h-full rounded-full border-2 border-dashed border-cyan-400/40 transition-transform duration-300 flex items-center justify-center"
                        style={{ transform: `rotate(${compassHeading}deg)` }}
                      >
                        <div className="w-1 h-6 bg-red-500 absolute top-2 rounded-full" />
                        <div className="w-1 h-6 bg-white/60 absolute bottom-2 rounded-full" />
                      </div>
                      <div className="absolute text-center">
                        <div className="text-xl font-black text-cyan-400">{compassHeading}°</div>
                        <div className="text-[10px] text-white/60">
                          {compassHeading >= 315 || compassHeading < 45
                            ? 'N'
                            : compassHeading < 135
                            ? 'E'
                            : compassHeading < 225
                            ? 'S'
                            : 'W'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Torch */}
                  <button
                    onClick={() => {
                      soundEffects.tap();
                      triggerHaptic(15);
                      setIsTorchActive(!isTorchActive);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer ${
                      isTorchActive
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-xs">Flashlight</span>
                    </div>
                    <span className="text-xs uppercase">{isTorchActive ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Surface Level */}
                  <div className="bg-white/5 rounded-2xl p-3 flex items-center justify-between">
                    <span className="text-xs text-white/80">Surface Incline</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">0.0° Flat</span>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: CONTACTS */}
              {activeTab === 'contacts' && (
                <div className="space-y-2 mt-3">
                  {contacts.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-full ${c.color} flex items-center justify-center font-bold text-xs`}
                        >
                          {c.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white">{c.name}</div>
                          <div className="text-[10px] text-white/50">{c.phone}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          soundEffects.tap();
                          onOpenApp('phone');
                          onToggle();
                        }}
                        className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.49a1 1 0 01-1 1A17.93 17.93 0 012 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: Trigger Edge Lighting Effect */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  soundEffects.whoosh();
                  triggerHaptic(20);
                  onTriggerEdgeLighting();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-medium text-xs shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>✨ Trigger Note 10 Edge Glow</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function AppIconSimple({ type }: { type: string }) {
  return (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}
