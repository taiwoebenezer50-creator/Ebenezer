import React, { useState } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  if (!isOpen) return null;

  const handleNum = (n: string) => {
    soundEffects.tap();
    triggerHaptic(8);
    setDisplay((prev) => (prev === '0' ? n : prev + n));
  };

  const handleOp = (op: string) => {
    soundEffects.tap();
    triggerHaptic(10);
    setExpression(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    soundEffects.tap();
    triggerHaptic(12);
    setDisplay('0');
    setExpression('');
  };

  const handleEquals = () => {
    soundEffects.tap();
    triggerHaptic(15);
    try {
      const full = `${expression}${display}`.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${full})`)();
      setDisplay(String(Number(res.toFixed(8))));
      setExpression('');
    } catch {
      setDisplay('Error');
    }
  };

  const handleSign = () => {
    soundEffects.tap();
    triggerHaptic(8);
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  };

  const handlePercent = () => {
    soundEffects.tap();
    triggerHaptic(8);
    setDisplay((prev) => String(parseFloat(prev) / 100));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-150 select-none">
      {/* Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between p-4 text-white">
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
          Calculator
        </span>
        <div className="w-6" />
      </div>

      {/* Main Display */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-end p-6">
        <div className="text-right text-sm text-white/50 h-6 truncate font-mono">
          {expression}
        </div>
        <div className="text-right text-5xl font-light text-white my-4 truncate font-mono tracking-tight">
          {display}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          <CalcBtn label="C" color="text-rose-400 bg-white/10" onClick={handleClear} />
          <CalcBtn label="+/-" color="text-emerald-400 bg-white/10" onClick={handleSign} />
          <CalcBtn label="%" color="text-emerald-400 bg-white/10" onClick={handlePercent} />
          <CalcBtn label="÷" color="text-amber-400 bg-white/15" onClick={() => handleOp('÷')} />

          <CalcBtn label="7" onClick={() => handleNum('7')} />
          <CalcBtn label="8" onClick={() => handleNum('8')} />
          <CalcBtn label="9" onClick={() => handleNum('9')} />
          <CalcBtn label="×" color="text-amber-400 bg-white/15" onClick={() => handleOp('×')} />

          <CalcBtn label="4" onClick={() => handleNum('4')} />
          <CalcBtn label="5" onClick={() => handleNum('5')} />
          <CalcBtn label="6" onClick={() => handleNum('6')} />
          <CalcBtn label="-" color="text-amber-400 bg-white/15" onClick={() => handleOp('-')} />

          <CalcBtn label="1" onClick={() => handleNum('1')} />
          <CalcBtn label="2" onClick={() => handleNum('2')} />
          <CalcBtn label="3" onClick={() => handleNum('3')} />
          <CalcBtn label="+" color="text-amber-400 bg-white/15" onClick={() => handleOp('+')} />

          <CalcBtn label="0" span2 onClick={() => handleNum('0')} />
          <CalcBtn label="." onClick={() => handleNum('.')} />
          <CalcBtn label="=" color="bg-emerald-500 text-black font-bold" onClick={handleEquals} />
        </div>
      </div>
    </div>
  );
};

interface CalcBtnProps {
  label: string;
  color?: string;
  span2?: boolean;
  onClick: () => void;
}

const CalcBtn: React.FC<CalcBtnProps> = ({ label, color = 'bg-white/10 text-white', span2 = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        span2 ? 'col-span-2' : 'col-span-1'
      } h-16 rounded-full ${color} hover:opacity-80 active:scale-95 transition flex items-center justify-center text-2xl font-light cursor-pointer`}
    >
      {label}
    </button>
  );
};
