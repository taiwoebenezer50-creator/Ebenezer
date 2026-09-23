import React, { useState, useEffect } from 'react';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface PhoneDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneDialerModal: React.FC<PhoneDialerModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [inCall]);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    soundEffects.dtmf(digit);
    triggerHaptic(10);
    if (phoneNumber.length < 16) {
      setPhoneNumber((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    soundEffects.tap();
    triggerHaptic(8);
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleStartCall = () => {
    if (!phoneNumber) return;
    soundEffects.tap();
    triggerHaptic(20);
    setInCall(true);
  };

  const handleEndCall = () => {
    soundEffects.tap();
    triggerHaptic(20);
    setInCall(false);
  };

  const keys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-150 select-none">
      {/* Top Header */}
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
          Phone
        </span>
        <div className="w-6" />
      </div>

      {inCall ? (
        /* In-Call Active Screen */
        <div className="flex-1 w-full max-w-sm mx-auto flex flex-col items-center justify-between p-6 text-white">
          <div className="flex flex-col items-center space-y-2 mt-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl font-bold shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              {phoneNumber[0] || 'G'}
            </div>
            <div className="text-2xl font-bold tracking-tight">{phoneNumber}</div>
            <div className="text-sm text-emerald-400 font-mono font-medium">
              Call in progress ({formatSeconds(callDuration)})
            </div>
            <div className="text-xs text-white/50">HD Voice · Galaxy Note 10 Ultra</div>
          </div>

          {/* End Call Button */}
          <div className="w-full flex justify-center mb-8">
            <button
              onClick={handleEndCall}
              className="w-18 h-18 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
            >
              <svg className="w-8 h-8 text-white rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.49a1 1 0 01-1 1A17.93 17.93 0 012 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Dial Pad Screen */
        <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-end p-6">
          {/* Displayed Number */}
          <div className="h-16 flex items-center justify-center px-4 mb-4 relative">
            <span className="text-3xl font-light tracking-wide text-white truncate text-center">
              {phoneNumber || <span className="text-white/30 text-xl font-normal">Enter number...</span>}
            </span>
            {phoneNumber && (
              <button
                onClick={handleDelete}
                className="absolute right-2 p-2 text-white/60 hover:text-white"
              >
                ⌫
              </button>
            )}
          </div>

          {/* Keypad 3x4 Grid */}
          <div className="grid grid-cols-3 gap-y-3 gap-x-6 justify-items-center mb-6">
            {keys.map((k) => (
              <button
                key={k.num}
                onClick={() => handleKeyPress(k.num)}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex flex-col items-center justify-center transition active:scale-90 cursor-pointer"
              >
                <span className="text-2xl font-light text-white leading-none">{k.num}</span>
                {k.letters && (
                  <span className="text-[9px] font-bold text-white/50 tracking-widest mt-0.5 uppercase">
                    {k.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Call Bar: Green Call Button */}
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={handleStartCall}
              disabled={!phoneNumber}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
            >
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.49a1 1 0 01-1 1A17.93 17.93 0 012 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
