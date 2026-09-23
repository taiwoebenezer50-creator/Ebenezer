export type IconShape = 'squircle' | 'circle' | 'teardrop' | 'rounded-square';

export type LauncherGrid = '4x5' | '4x6' | '5x5';

export interface AppItem {
  id: string;
  name: string;
  category: 'samsung' | 'google' | 'media' | 'tools' | 'social';
  iconBg: string;
  iconColor?: string;
  iconType: string;
  badge?: number;
  isSystem?: boolean;
  action?: string;
}

export interface WallpaperItem {
  id: string;
  name: string;
  subtitle: string;
  previewGradient: string;
  fullCssGradient: string;
  isAmoledBlack?: boolean;
  accentColor: string;
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain' | 'Thunderstorm' | 'Clear Night';
  city: string;
  high: number;
  low: number;
  humidity: number;
  aqi: number;
}

export interface LauncherSettings {
  grid: LauncherGrid;
  iconShape: IconShape;
  showHardwareFrame: boolean;
  enableEdgeLighting: boolean;
  edgeLightingColor: string;
  eyeComfortShield: boolean;
  brightness: number;
  darkMode: boolean;
  soundFeedback: boolean;
  hapticFeedback: boolean;
  spenFloatingIcon: boolean;
  activeWallpaperId: string;
}

export interface SPenNote {
  id: string;
  title: string;
  timestamp: number;
  imageDataUrl: string;
  penColor: string;
}
