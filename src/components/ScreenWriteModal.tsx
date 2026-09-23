import React, { useRef, useState, useEffect } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface ScreenWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenWriteModal: React.FC<ScreenWriteModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#ffd269');

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Render current screen backdrop simulation
        const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        grad.addColorStop(0, '#090e1f');
        grad.addColorStop(0.5, '#171b30');
        grad.addColorStop(1, '#060914');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Watermark annotation badge
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Samsung Galaxy Note 10 · Screen Write', 20, 40);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    soundEffects.spenStroke();
    triggerHaptic(5);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    soundEffects.spenClick();
    triggerHaptic(20);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Note10_ScreenWrite_${Date.now()}.png`;
    a.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between select-none animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto p-3 flex items-center justify-between text-white border-b border-white/10">
        <button
          onClick={() => {
            soundEffects.tap();
            onClose();
          }}
          className="p-1 rounded-full text-white/70 hover:text-white"
        >
          ✕
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Screen Write
        </span>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg active:scale-95 transition"
        >
          Save
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 w-full max-w-md mx-auto p-2 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="w-full h-full rounded-2xl border border-cyan-500/30 touch-none cursor-crosshair shadow-2xl"
        />
      </div>

      {/* Bottom Color Bar */}
      <div className="w-full max-w-md mx-auto p-3 bg-slate-900/90 flex items-center justify-around">
        {['#ffd269', '#00f0ff', '#ff007f', '#ffffff', '#10b981'].map((c) => (
          <button
            key={c}
            onClick={() => {
              soundEffects.tap();
              setPenColor(c);
            }}
            className={`w-7 h-7 rounded-full transition ${
              penColor === c ? 'ring-2 ring-white scale-110' : 'opacity-80'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
};
