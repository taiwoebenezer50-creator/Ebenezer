import React, { useRef, useState, useEffect } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';
import { SPenNote } from '../types/launcher';

interface SamsungNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (note: SPenNote) => void;
}

export const SamsungNotesModal: React.FC<SamsungNotesModalProps> = ({
  isOpen,
  onClose,
  onSaveNote,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#ffd269'); // Note 10 Signature Yellow Ink
  const [penSize, setPenSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [noteTitle, setNoteTitle] = useState('Note 10 Quick Memo');
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas resolution to container rect
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Fill background deep AMOLED black (Screen-Off Memo vibe)
        ctx.fillStyle = '#0a0b12';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Draw faint dotted or ruled paper lines (Samsung Notes style)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let y = 40; y < rect.height; y += 32) {
          ctx.beginPath();
          ctx.moveTo(16, y);
          ctx.lineTo(rect.width - 16, y);
          ctx.stroke();
        }

        // Save initial state for undo
        const initialImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialImg]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#0a0b12';
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = penColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 16;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'round';
    } else {
      ctx.strokeStyle = penColor;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), currentState]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    soundEffects.tap();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const prevState = newHistory[newHistory.length - 1];
    ctx.putImageData(prevState, 0, 0);
    setHistory(newHistory);
  };

  const clearCanvas = () => {
    soundEffects.tap();
    triggerHaptic(15);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#0a0b12';
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 40; y < rect.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(rect.width - 16, y);
      ctx.stroke();
    }

    const clearedState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([clearedState]);
  };

  const handleSave = () => {
    soundEffects.spenClick();
    triggerHaptic(20);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const newNote: SPenNote = {
      id: `note-${Date.now()}`,
      title: noteTitle || 'Note 10 Memo',
      timestamp: Date.now(),
      imageDataUrl: dataUrl,
      penColor,
    };

    onSaveNote(newNote);
    onClose();
  };

  const handleExportImage = () => {
    soundEffects.spenClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${noteTitle.replace(/\s+/g, '_')}_spen.png`;
    a.click();
  };

  const colors = [
    { label: 'Note 10 Yellow', hex: '#ffd269' },
    { label: 'Aura Cyan', hex: '#00f0ff' },
    { label: 'Neon Magenta', hex: '#ff007f' },
    { label: 'White', hex: '#ffffff' },
    { label: 'Spring Green', hex: '#10b981' },
    { label: 'Royal Blue', hex: '#3b82f6' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-200 select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between p-3 border-b border-white/10 text-white">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              soundEffects.tap();
              onClose();
            }}
            className="p-1 rounded-full text-white/70 hover:text-white"
          >
            ✕
          </button>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="bg-transparent border-none text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded px-1 max-w-[160px] truncate"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs"
            title="Undo"
          >
            ↩ Undo
          </button>
          <button
            onClick={handleExportImage}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-cyan-300 flex items-center space-x-1"
            title="Save image to phone"
          >
            <span>⬇ Export</span>
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-semibold text-xs shadow-md active:scale-95 transition"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full max-w-lg mx-auto relative p-2 flex flex-col items-center justify-center">
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative bg-[#0a0b12]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        </div>
      </div>

      {/* S-Pen Tool Palette */}
      <div className="w-full max-w-lg mx-auto p-3 bg-slate-900/90 border-t border-white/10 text-white flex flex-col space-y-3">
        {/* Tools & Sizes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Pen */}
            <button
              onClick={() => {
                soundEffects.tap();
                setTool('pen');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1 ${
                tool === 'pen' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-white/80'
              }`}
            >
              <span>🖊️ Pen</span>
            </button>

            {/* Highlighter */}
            <button
              onClick={() => {
                soundEffects.tap();
                setTool('highlighter');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1 ${
                tool === 'highlighter' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-white/80'
              }`}
            >
              <span>🖍️ Highlighter</span>
            </button>

            {/* Eraser */}
            <button
              onClick={() => {
                soundEffects.tap();
                setTool('eraser');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1 ${
                tool === 'eraser' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 text-white/80'
              }`}
            >
              <span>🧹 Eraser</span>
            </button>
          </div>

          {/* Stroke size selector */}
          {tool === 'pen' && (
            <div className="flex items-center space-x-1.5">
              {[2, 4, 7].map((s) => (
                <button
                  key={s}
                  onClick={() => setPenSize(s)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                    penSize === s ? 'border-cyan-400 bg-white/20' : 'border-transparent bg-white/5'
                  }`}
                >
                  <span
                    className="rounded-full bg-white"
                    style={{ width: `${s * 2}px`, height: `${s * 2}px` }}
                  />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={clearCanvas}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1"
          >
            Clear
          </button>
        </div>

        {/* Color Palette (authentic Note 10 pen inks) */}
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                soundEffects.tap();
                setPenColor(c.hex);
                if (tool === 'eraser') setTool('pen');
              }}
              className={`w-7 h-7 rounded-full transition-transform active:scale-90 flex items-center justify-center ${
                penColor === c.hex && tool !== 'eraser'
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                  : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
