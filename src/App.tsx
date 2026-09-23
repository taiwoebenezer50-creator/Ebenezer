/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { HomeScreen } from './components/HomeScreen';
import { NotificationShade } from './components/NotificationShade';
import { EdgePanel } from './components/EdgePanel';
import { SPenAirCommand } from './components/SPenAirCommand';
import { AppDrawer } from './components/AppDrawer';
import { SamsungNotesModal } from './components/SamsungNotesModal';
import { CameraModal } from './components/CameraModal';
import { PhoneDialerModal } from './components/PhoneDialerModal';
import { CalculatorModal } from './components/CalculatorModal';
import { DeviceCareModal } from './components/DeviceCareModal';
import { GalaxyThemesModal } from './components/GalaxyThemesModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { AirActionsModal } from './components/AirActionsModal';
import { ScreenWriteModal } from './components/ScreenWriteModal';
import { PhoneFrame } from './components/PhoneFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { WALLPAPERS } from './data/wallpapers';
import { LauncherSettings, SPenNote } from './types/launcher';
import { soundEffects, triggerHaptic } from './utils/audioHaptics';

export default function App() {
  const [settings, setSettings] = useState<LauncherSettings>(() => {
    return {
      grid: '4x5',
      iconShape: 'squircle',
      showHardwareFrame: true,
      enableEdgeLighting: true,
      edgeLightingColor: '#00f0ff',
      eyeComfortShield: false,
      brightness: 100,
      darkMode: true,
      soundFeedback: true,
      hapticFeedback: true,
      spenFloatingIcon: true,
      activeWallpaperId: 'aura-glow',
    };
  });

  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);
  const [edgeLightingActive, setEdgeLightingActive] = useState(false);
  const [latestNote, setLatestNote] = useState<SPenNote | null>(null);

  // Modals and Drawers
  const [isShadeOpen, setIsShadeOpen] = useState(false);
  const [isEdgePanelOpen, setIsEdgePanelOpen] = useState(false);
  const [isSPenMenuOpen, setIsSPenMenuOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isDeviceCareOpen, setIsDeviceCareOpen] = useState(false);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isAirActionsOpen, setIsAirActionsOpen] = useState(false);
  const [isScreenWriteOpen, setIsScreenWriteOpen] = useState(false);

  // Load saved note from localStorage on boot
  useEffect(() => {
    try {
      const saved = localStorage.getItem('samsung_note10_latest_memo');
      if (saved) {
        setLatestNote(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleSaveNote = (note: SPenNote) => {
    setLatestNote(note);
    try {
      localStorage.setItem('samsung_note10_latest_memo', JSON.stringify(note));
    } catch {}
  };

  // Trigger Note 10 Edge Lighting pulsing glow
  const triggerEdgeLighting = () => {
    setEdgeLightingActive(true);
    setTimeout(() => {
      setEdgeLightingActive(false);
    }, 4500);
  };

  // Central app router
  const handleOpenApp = (appId: string) => {
    switch (appId) {
      case 'phone':
        setIsPhoneOpen(true);
        break;
      case 'camera':
        setIsCameraOpen(true);
        break;
      case 'snotes':
        setIsNotesOpen(true);
        break;
      case 'calculator':
        setIsCalcOpen(true);
        break;
      case 'device_care':
        setIsDeviceCareOpen(true);
        break;
      case 'themes':
        setIsThemesOpen(true);
        break;
      case 'spen_hub':
        setIsSPenMenuOpen(true);
        break;
      case 'install_app':
        setIsInstallOpen(true);
        break;
      case 'messages':
        setIsPhoneOpen(true);
        break;
      case 'gallery':
        setIsThemesOpen(true);
        break;
      case 'internet':
      case 'google':
        window.open('https://www.google.com', '_blank');
        break;
      case 'youtube':
        window.open('https://www.youtube.com', '_blank');
        break;
      case 'maps':
        window.open('https://maps.google.com', '_blank');
        break;
      case 'play_store':
        setIsInstallOpen(true);
        break;
      case 'settings':
        setIsThemesOpen(true);
        break;
      case 'penup':
        setIsNotesOpen(true);
        break;
      default:
        soundEffects.tap();
        break;
    }
  };

  // Resolve current wallpaper background style
  const activeWp = WALLPAPERS.find((w) => w.id === settings.activeWallpaperId) || WALLPAPERS[0];
  const activeWallpaperCss = customWallpaperUrl
    ? `url(${customWallpaperUrl}) center/cover no-repeat`
    : activeWp.fullCssGradient;

  return (
    <div className="min-h-screen bg-black text-white relative font-sans">
      {/* Top Floating Control Bar for Quick Customization & PWA Install */}
      <header className="fixed top-2 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 bg-black/70 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full shadow-2xl">
        <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase hidden sm:inline-block">
          Galaxy Note 10
        </span>
        <span className="text-white/30 hidden sm:inline-block">|</span>

        {/* Toggle Frame Mode */}
        <button
          onClick={() => {
            soundEffects.tap();
            triggerHaptic(10);
            setSettings((prev) => ({ ...prev, showHardwareFrame: !prev.showHardwareFrame }));
          }}
          className="text-[11px] text-white/80 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition cursor-pointer"
          title="Toggle between hardware bezel mockup & edge-to-edge fullscreen"
        >
          {settings.showHardwareFrame ? '📱 Fullscreen' : '🖼️ Note 10 Frame'}
        </button>

        {/* Themes Shortcut */}
        <button
          onClick={() => {
            soundEffects.tap();
            setIsThemesOpen(true);
          }}
          className="text-[11px] text-white/80 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition cursor-pointer"
        >
          🎨 Wallpapers
        </button>

        {/* In-App PWA Install Trigger */}
        <PWAInstallButton onOpenModal={() => setIsInstallOpen(true)} />
      </header>

      {/* Main Galaxy Note 10 Frame or Fullscreen View */}
      <PhoneFrame
        showFrame={settings.showHardwareFrame}
        edgeLightingActive={edgeLightingActive}
        edgeLightingColor={settings.edgeLightingColor}
        activeWallpaperCss={activeWallpaperCss}
        eyeComfortActive={settings.eyeComfortShield}
        brightness={settings.brightness}
      >
        {/* Status Bar with Note 10 Infinity-O punch hole */}
        <StatusBar
          onPullDown={() => setIsShadeOpen(true)}
          showPunchHole={true}
        />

        {/* Home Screen */}
        <HomeScreen
          settings={settings}
          latestNote={latestNote}
          onOpenApp={handleOpenApp}
          onOpenAppDrawer={() => setIsAppDrawerOpen(true)}
          onOpenNotes={() => setIsNotesOpen(true)}
          onOpenThemes={() => setIsThemesOpen(true)}
          onOpenDeviceCare={() => setIsDeviceCareOpen(true)}
          onPullDownShade={() => setIsShadeOpen(true)}
        />

        {/* Note 10 Edge Panel Handle */}
        <EdgePanel
          isOpen={isEdgePanelOpen}
          onToggle={() => setIsEdgePanelOpen(!isEdgePanelOpen)}
          onOpenApp={handleOpenApp}
          onTriggerEdgeLighting={triggerEdgeLighting}
        />

        {/* Note 10 S-Pen Air Command Floating Icon & Radial Menu */}
        <SPenAirCommand
          isOpen={isSPenMenuOpen}
          onToggle={() => setIsSPenMenuOpen(!isSPenMenuOpen)}
          onOpenNotes={() => setIsNotesOpen(true)}
          onOpenScreenWrite={() => setIsScreenWriteOpen(true)}
          onOpenSmartSelect={() => setIsScreenWriteOpen(true)}
          onOpenAirActions={() => setIsAirActionsOpen(true)}
          onOpenPENUP={() => setIsNotesOpen(true)}
          showFloatingTrigger={settings.spenFloatingIcon}
        />
      </PhoneFrame>

      {/* One UI Notification Shade / Quick Settings */}
      <NotificationShade
        isOpen={isShadeOpen}
        onClose={() => setIsShadeOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenSettings={() => setIsThemesOpen(true)}
      />

      {/* App Drawer */}
      <AppDrawer
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        iconShape={settings.iconShape}
        onOpenApp={handleOpenApp}
      />

      {/* Samsung Notes Modal */}
      <SamsungNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        onSaveNote={handleSaveNote}
      />

      {/* Camera App Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />

      {/* Phone / Dialer Modal */}
      <PhoneDialerModal
        isOpen={isPhoneOpen}
        onClose={() => setIsPhoneOpen(false)}
      />

      {/* Calculator Modal */}
      <CalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />

      {/* Device Care Modal */}
      <DeviceCareModal
        isOpen={isDeviceCareOpen}
        onClose={() => setIsDeviceCareOpen(false)}
      />

      {/* Galaxy Themes & UHD Wallpapers Modal */}
      <GalaxyThemesModal
        isOpen={isThemesOpen}
        onClose={() => setIsThemesOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onCustomWallpaperUpload={(url) => setCustomWallpaperUrl(url)}
      />

      {/* PWA Download & Install Modal */}
      <PWAInstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      {/* S-Pen Air Actions Gesture Simulator Modal */}
      <AirActionsModal
        isOpen={isAirActionsOpen}
        onClose={() => setIsAirActionsOpen(false)}
      />

      {/* S-Pen Screen Write Modal */}
      <ScreenWriteModal
        isOpen={isScreenWriteOpen}
        onClose={() => setIsScreenWriteOpen(false)}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
