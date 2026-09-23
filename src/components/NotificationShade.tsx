import React, { useState } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';
import { LauncherSettings } from '../types/launcher';

interface NotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LauncherSettings;
  onUpdateSettings: (updater: (prev: LauncherSettings) => LauncherSettings) => void;
  onOpenSettings: () => void;
}

export const NotificationShade: React.FC<NotificationShadeProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenSettings,
}) => {
  const [wifiOn, setWifiOn] = useState(true);
  const [soundMode, setSoundMode] = useState<'sound' | 'vibrate' | 'mute'>('sound');
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [flightMode, setFlightMode] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'spen',
      app: 'S-Pen',
      time: 'Now',
      title: 'S-Pen Connected',
      desc: 'Air actions available. Battery 100%. Press button to launch Camera or Notes.',
      color: 'bg-cyan-500',
    },
    {
      id: 'device_care',
      app: 'Device Care',
      time: '15m ago',
      title: 'Galaxy Note 10 Optimized',
      desc: 'RAM freed up. 0 malware threats detected. Ultra HD AMOLED active.',
      color: 'bg-emerald-500',
    },
    {
      id: 'weather',
      app: 'Weather',
      time: '1h ago',
      title: 'Sunny · 24°C',
      desc: 'High 27°C / Low 18°C. Clear sky today in Seoul.',
      color: 'bg-blue-500',
    },
  ]);

  if (!isOpen) return null;

  const toggleSound = () => {
    soundEffects.tap();
    triggerHaptic(12);
    setSoundMode((prev) => (prev === 'sound' ? 'vibrate' : prev === 'vibrate' ? 'mute' : 'sound'));
  };

  const handleTileClick = (name: string, active: boolean, onClick: () => void) => {
    soundEffects.tap();
    triggerHaptic(10);
    onClick();
  };

  const clearNotifications = () => {
    soundEffects.tap();
    triggerHaptic(15);
    setNotifications([]);
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in slide-in-from-top duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto h-full flex flex-col p-4 text-white overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Clock, Date, and Top Right Icons */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <div>
            <div className="text-3xl font-light tracking-tight">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-xs text-white/70 font-medium">{todayStr}</div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              onClick={() => {
                soundEffects.tap();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-white/10"
              title="Search"
            >
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                soundEffects.tap();
                onClose();
                onOpenSettings();
              }}
              className="p-2 rounded-full hover:bg-white/10"
              title="Settings"
            >
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Settings Grid (One UI 4x3 Round Toggle Buttons) */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 my-5 text-center">
          {/* Wi-Fi */}
          <QuickTile
            label="Wi-Fi"
            active={wifiOn}
            onClick={() => handleTileClick('wifi', wifiOn, () => setWifiOn(!wifiOn))}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0012 4zm0 3.5c3.73 0 7.12 1.42 9.69 3.75L12 19.34 2.31 11.25C4.88 8.92 8.27 7.5 12 7.5z" />
              </svg>
            }
          />

          {/* Sound / Vibrate / Mute */}
          <QuickTile
            label={soundMode === 'sound' ? 'Sound' : soundMode === 'vibrate' ? 'Vibrate' : 'Mute'}
            active={soundMode !== 'mute'}
            onClick={toggleSound}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            }
          />

          {/* Bluetooth */}
          <QuickTile
            label="Bluetooth"
            active={bluetoothOn}
            onClick={() => handleTileClick('bluetooth', bluetoothOn, () => setBluetoothOn(!bluetoothOn))}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4zm-4.71-1.88L14.59 7 13 8.59V5.83zm1.59 12.58L13 19.17v-2.76l1.59 1.58z" />
              </svg>
            }
          />

          {/* Auto Rotate */}
          <QuickTile
            label="Auto Rotate"
            active={autoRotate}
            onClick={() => handleTileClick('rotate', autoRotate, () => setAutoRotate(!autoRotate))}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />

          {/* Torch / Flashlight */}
          <QuickTile
            label="Torch"
            active={torchOn}
            onClick={() => handleTileClick('torch', torchOn, () => setTorchOn(!torchOn))}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />

          {/* S-Pen Remote */}
          <QuickTile
            label="S-Pen Air"
            active={settings.spenFloatingIcon}
            onClick={() => {
              soundEffects.spenClick();
              triggerHaptic(15);
              onUpdateSettings((prev) => ({ ...prev, spenFloatingIcon: !prev.spenFloatingIcon }));
            }}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34l-3.75-3.75-2.53 2.54 3.75 3.75 2.53-2.54z" />
              </svg>
            }
          />

          {/* Dark Mode */}
          <QuickTile
            label="Dark Mode"
            active={settings.darkMode}
            onClick={() => {
              soundEffects.tap();
              triggerHaptic(12);
              onUpdateSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
            }}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            }
          />

          {/* Eye Comfort Shield */}
          <QuickTile
            label="Eye Comfort"
            active={settings.eyeComfortShield}
            onClick={() => {
              soundEffects.tap();
              triggerHaptic(12);
              onUpdateSettings((prev) => ({ ...prev, eyeComfortShield: !prev.eyeComfortShield }));
            }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl mb-4">
          <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
          </svg>
          <input
            type="range"
            min="30"
            max="100"
            value={settings.brightness}
            onChange={(e) => {
              const val = Number(e.target.value);
              onUpdateSettings((prev) => ({ ...prev, brightness: val }));
            }}
            className="w-full accent-cyan-400 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6" />
          </svg>
        </div>

        {/* Notifications Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Notifications
            </span>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-cyan-400 font-medium hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">
              No new notifications
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-white/10 hover:bg-white/15 transition rounded-2xl p-3.5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${n.color}`} />
                      <span className="text-[11px] font-semibold text-white/80">{n.app}</span>
                    </div>
                    <span className="text-[10px] text-white/50">{n.time}</span>
                  </div>
                  <div className="text-sm font-medium text-white">{n.title}</div>
                  <div className="text-xs text-white/70 mt-0.5">{n.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Grabber indicator */}
        <div className="pt-4 pb-2 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1 rounded-full bg-white/40 hover:bg-white/70 transition" />
        </div>
      </div>
    </div>
  );
};

interface QuickTileProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const QuickTile: React.FC<QuickTileProps> = ({ label, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center space-y-1.5 focus:outline-none group cursor-pointer"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          active
            ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-100'
            : 'bg-white/15 text-white/60 hover:bg-white/20'
        } active:scale-90`}
      >
        {icon}
      </div>
      <span className="text-[11px] text-white/90 font-medium truncate max-w-[72px]">
        {label}
      </span>
    </button>
  );
};
