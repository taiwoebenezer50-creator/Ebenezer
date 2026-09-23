import React, { useState } from 'react';
import { SYSTEM_APPS } from '../data/apps';
import { AppIcon } from './AppIcon';
import { IconShape } from '../types/launcher';
import { soundEffects, triggerHaptic } from '../utils/audioHaptics';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  iconShape: IconShape;
  onOpenApp: (appId: string) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  iconShape,
  onOpenApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'samsung', label: 'Galaxy' },
    { id: 'google', label: 'Google' },
    { id: 'tools', label: 'Tools' },
    { id: 'media', label: 'Media' },
  ];

  const filteredApps = SYSTEM_APPS.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ? true : app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl flex flex-col justify-between animate-in slide-in-from-bottom duration-250 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto h-full flex flex-col p-4 text-white overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Bar (Samsung One UI pill style) */}
        <div className="relative w-full my-3">
          <input
            type="text"
            placeholder="Search Galaxy Note 10 apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-10 rounded-full bg-white/10 border border-white/10 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md"
          />
          <svg
            className="w-4 h-4 text-white/60 absolute left-4 top-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-white/60 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 mb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEffects.tap();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black font-semibold shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="flex-1 grid grid-cols-4 gap-y-6 gap-x-2 justify-items-center py-2">
          {filteredApps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              shape={iconShape}
              size="md"
              onClick={() => {
                onOpenApp(app.id);
                onClose();
              }}
            />
          ))}

          {filteredApps.length === 0 && (
            <div className="col-span-4 text-center py-16 text-white/40 text-xs">
              No apps found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Bottom Grabber */}
        <div
          className="py-3 flex justify-center cursor-pointer"
          onClick={() => {
            soundEffects.whoosh();
            triggerHaptic(10);
            onClose();
          }}
        >
          <div className="w-12 h-1 rounded-full bg-white/40 hover:bg-white/70 transition" />
        </div>
      </div>
    </div>
  );
};
