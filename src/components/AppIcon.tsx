import React from 'react';
import { AppItem, IconShape } from '../types/launcher';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface AppIconProps {
  app: AppItem;
  shape?: IconShape;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
  app,
  shape = 'squircle',
  size = 'md',
  showLabel = true,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.tap();
    triggerHaptic(12);
    onClick?.();
  };

  const getShapeClass = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'teardrop':
        return 'rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl';
      case 'rounded-square':
        return 'rounded-xl';
      case 'squircle':
      default:
        // Authentic Samsung One UI squircle
        return 'rounded-[26%]';
    }
  };

  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center justify-start text-center focus:outline-none transition-transform active:scale-95 duration-150 cursor-pointer"
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} ${getShapeClass()} flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-105 group-hover:shadow-cyan-500/20 group-active:scale-90`}
          style={{ background: app.iconBg }}
        >
          {renderAppIconSvg(app.iconType, iconSizes[size], app.iconColor)}
        </div>

        {/* Unread badge */}
        {app.badge !== undefined && app.badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-black font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md ring-2 ring-black">
            {app.badge}
          </span>
        )}
      </div>

      {showLabel && (
        <span className="mt-1.5 text-[11px] font-normal text-white text-shadow tracking-tight max-w-[68px] truncate leading-tight opacity-95 group-hover:opacity-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {app.name}
        </span>
      )}
    </button>
  );
};

function renderAppIconSvg(type: string, className: string, customColor?: string) {
  switch (type) {
    case 'phone':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.49a1 1 0 01-1 1A17.93 17.93 0 012 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
        </svg>
      );

    case 'messages':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z" />
        </svg>
      );

    case 'camera':
      return (
        <svg className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <circle cx="12" cy="13" r="4" fill="#ffffff" fillOpacity="0.2" />
        </svg>
      );

    case 'snotes':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      );

    case 'gallery':
      return (
        <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.4" />
          <circle cx="6" cy="12" r="2" opacity="0.8" />
          <circle cx="18" cy="12" r="2" opacity="0.8" />
          <circle cx="12" cy="6" r="2" opacity="0.8" />
          <circle cx="12" cy="18" r="2" opacity="0.8" />
        </svg>
      );

    case 'settings':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      );

    case 'device_care':
      return (
        <svg className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );

    case 'internet':
      return (
        <svg className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );

    case 'calculator':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 2h5v3h-5V5zm-6 8h3v3H7v-3zm0-5h3v3H7V8zm5 5h3v3h-3v-3zm0-5h3v3h-3V8zm5 8h-3v-3h3v3zm0-5h-3v-3h3v3z" />
        </svg>
      );

    case 'themes':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.57 10.6 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );

    case 'spen':
      return (
        <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34l-3.75-3.75-2.53 2.54 3.75 3.75 2.53-2.54z" />
          <circle cx="18" cy="18" r="3" fill="#00f0ff" />
        </svg>
      );

    case 'install':
      return (
        <svg className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      );

    case 'clock':
      return (
        <svg className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
        </svg>
      );

    case 'calendar':
      return (
        <div className="flex flex-col items-center justify-center text-white">
          <span className="text-[8px] font-extrabold uppercase leading-none text-red-200">SEP</span>
          <span className="text-xs font-black leading-none mt-0.5">22</span>
        </div>
      );

    case 'files':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </svg>
      );

    case 'penup':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" />
        </svg>
      );

    case 'weather':
      return (
        <svg className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );

    case 'google':
      return (
        <span className="font-black text-lg" style={{ color: customColor || '#4285F4' }}>
          G
        </span>
      );

    case 'play_store':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M3.6 2.4L13.5 12 3.6 21.6c-.4-.3-.6-.8-.6-1.4V3.8c0-.6.2-1.1.6-1.4z" />
          <path fill="#34A853" d="M16.8 8.8l-3.3 3.2 3.3 3.2 3.8-2.2c1.1-.6 1.1-1.6 0-2.2l-3.8-2z" />
          <path fill="#EA4335" d="M13.5 12L3.6 2.4l13.2 7.6-3.3 2z" />
          <path fill="#FBBC04" d="M13.5 12l3.3 2-13.2 7.6L13.5 12z" />
        </svg>
      );

    case 'youtube':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
        </svg>
      );

    case 'maps':
      return (
        <svg className={`${className} text-red-500`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
        </svg>
      );

    case 'voice_recorder':
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
        </svg>
      );

    default:
      return (
        <svg className={`${className} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
        </svg>
      );
  }
}
