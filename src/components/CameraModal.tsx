import React, { useRef, useState, useEffect } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video' | 'pro' | 'night'>('photo');
  const [zoom, setZoom] = useState<'0.5' | '1.0' | '2.0'>('1.0');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('auto');
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isOpen) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
          .then((s) => {
            activeStream = s;
            setStream(s);
            setHasCameraPermission(true);
            if (videoRef.current) {
              videoRef.current.srcObject = s;
            }
          })
          .catch(() => {
            // Camera not granted or not available (e.g. desktop sandbox)
            setHasCameraPermission(false);
          });
      } else {
        setHasCameraPermission(false);
      }
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapture = () => {
    soundEffects.cameraShutter();
    triggerHaptic(25);
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    // Capture frame to canvas if stream exists, else produce styled snapshot
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (videoRef.current && hasCameraPermission) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // Render aesthetic Note 10 photo sample
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#09152b');
        grad.addColorStop(0.5, '#2b1055');
        grad.addColorStop(1, '#050711');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Samsung Galaxy Note 10 Photo', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '32px sans-serif';
        ctx.fillText(`Zoom ${zoom}x · Dual Pixel OIS`, canvas.width / 2, canvas.height / 2 + 60);
      }
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhotos((prev) => [dataUrl, ...prev]);
    }
  };

  const modes = [
    { id: 'pro', label: 'PRO' },
    { id: 'photo', label: 'PHOTO' },
    { id: 'video', label: 'VIDEO' },
    { id: 'night', label: 'NIGHT' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-150">
      {/* Flash overlay */}
      {isFlashing && (
        <div className="absolute inset-0 z-40 bg-white opacity-95 transition-opacity pointer-events-none" />
      )}

      {/* Top Camera Controls */}
      <div className="relative z-20 w-full px-6 py-4 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent">
        {/* Settings / Close */}
        <button
          onClick={() => {
            soundEffects.tap();
            onClose();
          }}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
        >
          ✕
        </button>

        {/* Flash selector */}
        <button
          onClick={() => {
            soundEffects.tap();
            setFlash((prev) => (prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'));
          }}
          className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full bg-black/40"
        >
          <span>⚡</span>
          <span className="uppercase text-[10px] font-bold">{flash}</span>
        </button>

        {/* Timer */}
        <span className="text-xs text-white/80 font-mono">OFF</span>

        {/* Aspect Ratio Full Note 10 19:9 */}
        <span className="text-xs text-amber-400 font-bold">19:9</span>
      </div>

      {/* Viewfinder Center */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#0c0d14] flex items-center justify-center">
        {hasCameraPermission ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-transform duration-300 ${
              zoom === '0.5' ? 'scale-90' : zoom === '2.0' ? 'scale-125' : 'scale-100'
            }`}
          />
        ) : (
          <div className="flex flex-col items-center text-center p-6 space-y-3">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" fill="#00f0ff" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-white">Galaxy Note 10 Viewfinder</div>
            <div className="text-xs text-white/60 max-w-xs">
              Live ultra-wide & telephoto sensor ready. Tap the shutter below or use S-Pen Air button!
            </div>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Triple Camera Zoom Selectors (0.5x, 1.0x, 2.0x) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20">
          {(['0.5', '1.0', '2.0'] as const).map((z) => (
            <button
              key={z}
              onClick={() => {
                soundEffects.tap();
                setZoom(z);
              }}
              className={`w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                zoom === z
                  ? 'bg-amber-400 text-black shadow-md scale-105'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {z}x
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Camera Controls & Shutter */}
      <div className="relative z-20 w-full pt-3 pb-6 px-6 bg-black flex flex-col space-y-4">
        {/* Modes Carousel */}
        <div className="flex items-center justify-center space-x-6 text-xs font-bold tracking-wider text-white/60">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                soundEffects.tap();
                setCameraMode(m.id as typeof cameraMode);
              }}
              className={`transition uppercase cursor-pointer ${
                cameraMode === m.id ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Shutter Row: Gallery Thumb, Big Shutter Button, Switch Camera */}
        <div className="flex items-center justify-between px-4">
          {/* Gallery Thumb */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 bg-slate-800 flex items-center justify-center">
            {capturedPhotos[0] ? (
              <img src={capturedPhotos[0]} alt="Last captured" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6" />
              </svg>
            )}
          </div>

          {/* Shutter Trigger Button */}
          <button
            onClick={handleCapture}
            className="group relative w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <div className="w-full h-full rounded-full bg-white group-active:scale-90 transition duration-150" />
          </button>

          {/* Switch Camera */}
          <button
            onClick={() => {
              soundEffects.tap();
              triggerHaptic(10);
            }}
            className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:rotate-180 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="text-center text-[10px] text-white/50 tracking-wide">
          S-Pen Air Action: Click S-Pen button to capture photo
        </div>
      </div>
    </div>
  );
};
