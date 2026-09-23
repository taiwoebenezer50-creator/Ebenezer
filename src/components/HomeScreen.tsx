import React, { useState, useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { SYSTEM_APPS, DOCK_APPS_IDS } from '../data/apps';
import { LauncherSettings, SPenNote, WeatherData } from '../types/launcher';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface HomeScreenProps {
  settings: LauncherSettings;
  latestNote: SPenNote | null;
  onOpenApp: (appId: string) => void;
  onOpenAppDrawer: () => void;
  onOpenNotes: () => void;
  onOpenThemes: () => void;
  onOpenDeviceCare: () => void;
  onPullDownShade: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  latestNote,
  onOpenApp,
  onOpenAppDrawer,
  onOpenNotes,
  onOpenThemes,
  onOpenDeviceCare,
  onPullDownShade,
}) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [weather] = useState<WeatherData>({
    temp: 24,
    condition: 'Sunny',
    city: 'Seoul · Ultra HD',
    high: 27,
    low: 18,
    humidity: 48,
    aqi: 22,
  });

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY;

    if (diff < -50) {
      // Swiped UP -> Open App Drawer
      soundEffects.whoosh();
      triggerHaptic(12);
      onOpenAppDrawer();
    } else if (diff > 50) {
      // Swiped DOWN -> Open Notification Shade
      soundEffects.whoosh();
      triggerHaptic(12);
      onPullDownShade();
    }
    setTouchStartY(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    soundEffects.tap();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  // Pinned home screen applications
  const homeAppIds = [
    'gallery',
    'snotes',
    'calculator',
    'device_care',
    'themes',
    'spen_hub',
    'clock',
    'install_app',
  ];
  const pinnedApps = SYSTEM_APPS.filter((a) => homeAppIds.includes(a.id));

  // Dock applications
  const dockApps = SYSTEM_APPS.filter((a) => DOCK_APPS_IDS.includes(a.id));

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex-1 w-full max-w-md mx-auto flex flex-col justify-between px-4 pb-4 pt-1 select-none overflow-hidden relative z-10"
    >
      {/* TOP SECTION: ONE UI WEATHER & CLOCK WIDGET */}
      <div className="w-full flex flex-col space-y-3 pt-2">
        <div
          onClick={onOpenThemes}
          className="bg-black/25 hover:bg-black/35 backdrop-blur-md border border-white/10 rounded-3xl p-4 text-white shadow-xl cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-extralight tracking-tight font-sans drop-shadow-md">
                {currentTime || '12:45'}
              </div>
              <div className="text-xs text-white/80 font-medium mt-0.5 drop-shadow">
                {currentDate} · {weather.city}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* 3D Sun / Weather Icon */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 shadow-[0_0_18px_rgba(251,191,36,0.6)] flex items-center justify-center text-xl">
                ☀️
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tracking-tight">{weather.temp}°</div>
                <div className="text-[10px] text-white/70">
                  H: {weather.high}° L: {weather.low}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GOOGLE ONE UI PILL SEARCH BAR */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full h-11 bg-black/30 backdrop-blur-lg border border-white/15 rounded-full flex items-center px-4 shadow-lg hover:border-white/30 transition-all"
        >
          {/* Google G logo */}
          <span className="font-black text-sm text-cyan-400 mr-2.5 drop-shadow">
            G
          </span>
          <input
            type="text"
            placeholder="Search Google or type URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/50 text-xs focus:outline-none"
          />
          {/* Google Voice & Lens */}
          <div className="flex items-center space-x-2 text-white/60">
            <button
              type="button"
              onClick={() => {
                soundEffects.tap();
                onOpenApp('voice_recorder');
              }}
              className="p-1 hover:text-white"
              title="Voice Search"
            >
              🎤
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.tap();
                onOpenApp('camera');
              }}
              className="p-1 hover:text-white"
              title="Google Lens"
            >
              📷
            </button>
          </div>
        </form>

        {/* NOTE 10 SIGNATURE S-PEN GLANCE WIDGET */}
        {latestNote ? (
          <div
            onClick={onOpenNotes}
            className="bg-black/30 backdrop-blur-md border border-amber-400/30 hover:border-amber-400/50 rounded-2xl p-2.5 flex items-center justify-between text-white cursor-pointer transition shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/15 overflow-hidden flex items-center justify-center">
                <img
                  src={latestNote.imageDataUrl}
                  alt="Recent Memo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-300">
                  {latestNote.title}
                </div>
                <div className="text-[10px] text-white/60">
                  S-Pen Memo · Tap to continue drawing
                </div>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-bold pr-1">✍️</span>
          </div>
        ) : null}
      </div>

      {/* CENTER: PINNED HOME SCREEN APPS GRID */}
      <div className="my-auto py-2 grid grid-cols-4 gap-y-5 gap-x-2 justify-items-center">
        {pinnedApps.map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            shape={settings.iconShape}
            size="md"
            onClick={() => onOpenApp(app.id)}
          />
        ))}
      </div>

      {/* BOTTOM SECTION: SWIPE UP HINT & DOCK */}
      <div className="w-full flex flex-col items-center space-y-2.5 pt-1">
        {/* Swipe Up for Apps hint */}
        <button
          onClick={onOpenAppDrawer}
          className="flex flex-col items-center text-[10px] text-white/60 hover:text-white/90 transition-colors focus:outline-none cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-white/50 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className="text-shadow">Swipe up for apps</span>
        </button>

        {/* BOTTOM DOCK (5 slots: Phone, Messages, App Drawer Button, Internet, Camera) */}
        <div className="w-full h-20 px-2 rounded-3xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-around">
          {/* Slot 1: Phone */}
          {dockApps[0] && (
            <AppIcon
              app={dockApps[0]}
              shape={settings.iconShape}
              size="md"
              showLabel={false}
              onClick={() => onOpenApp(dockApps[0].id)}
            />
          )}

          {/* Slot 2: Messages */}
          {dockApps[1] && (
            <AppIcon
              app={dockApps[1]}
              shape={settings.iconShape}
              size="md"
              showLabel={false}
              onClick={() => onOpenApp(dockApps[1].id)}
            />
          )}

          {/* Slot 3 (Center): Samsung One UI App Drawer Grid Launcher Button */}
          <button
            onClick={() => {
              soundEffects.whoosh();
              triggerHaptic(12);
              onOpenAppDrawer();
            }}
            className="w-14 h-14 rounded-[26%] bg-white/15 hover:bg-white/25 active:scale-90 transition-all flex items-center justify-center shadow-lg border border-white/20 cursor-pointer group"
            title="Apps"
          >
            <div className="grid grid-cols-3 gap-1 p-1">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-cyan-400 transition-colors"
                />
              ))}
            </div>
          </button>

          {/* Slot 4: Samsung Internet */}
          {dockApps[2] && (
            <AppIcon
              app={dockApps[2]}
              shape={settings.iconShape}
              size="md"
              showLabel={false}
              onClick={() => onOpenApp(dockApps[2].id)}
            />
          )}

          {/* Slot 5: Camera */}
          {dockApps[3] && (
            <AppIcon
              app={dockApps[3]}
              shape={settings.iconShape}
              size="md"
              showLabel={false}
              onClick={() => onOpenApp(dockApps[3].id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
