import { WallpaperItem } from '../types/launcher';

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'aura-glow',
    name: 'Note 10 Aura Glow',
    subtitle: 'Signature Iridescent Reflection',
    accentColor: '#00f0ff',
    previewGradient: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 20%, #70a6ff 50%, #50e3c2 80%, #ffd269 100%)',
    fullCssGradient: 'radial-gradient(circle at 80% 20%, rgba(255, 117, 140, 0.75) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(80, 227, 194, 0.65) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(112, 166, 255, 0.8) 0%, transparent 60%), linear-gradient(145deg, #090e1f 0%, #171b30 40%, #060914 100%)',
  },
  {
    id: 'aura-black',
    name: 'Note 10 Aura Black',
    subtitle: 'Midnight Deep AMOLED',
    isAmoledBlack: true,
    accentColor: '#4f5d75',
    previewGradient: 'linear-gradient(135deg, #000000 0%, #151821 50%, #090a0f 100%)',
    fullCssGradient: 'radial-gradient(ellipse at 70% 30%, rgba(30, 38, 56, 0.7) 0%, transparent 60%), radial-gradient(circle at 20% 75%, rgba(18, 22, 33, 0.8) 0%, transparent 50%), linear-gradient(180deg, #020305 0%, #080a0f 45%, #000000 100%)',
  },
  {
    id: 'aura-blue',
    name: 'Note 10 Aura Blue',
    subtitle: 'Electric Sapphire & Cobalt',
    accentColor: '#0070f3',
    previewGradient: 'linear-gradient(135deg, #0052d4 0%, #4364f7 50%, #6fb1fc 100%)',
    fullCssGradient: 'radial-gradient(circle at 75% 25%, rgba(111, 177, 252, 0.85) 0%, transparent 55%), radial-gradient(circle at 25% 75%, rgba(0, 82, 212, 0.9) 0%, transparent 60%), linear-gradient(140deg, #041026 0%, #071e4a 50%, #020712 100%)',
  },
  {
    id: 'aura-pink',
    name: 'Note 10 Aura Pink',
    subtitle: 'Sunset Orchid & Coral',
    accentColor: '#f72585',
    previewGradient: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 45%, #ff0844 100%)',
    fullCssGradient: 'radial-gradient(circle at 75% 20%, rgba(249, 212, 35, 0.7) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(255, 8, 68, 0.75) 0%, transparent 60%), linear-gradient(150deg, #1f0410 0%, #36071d 45%, #0a0106 100%)',
  },
  {
    id: 'prism-crystal',
    name: 'Aura Prism White',
    subtitle: 'Ceramic Quartz Refraction',
    accentColor: '#e0f2fe',
    previewGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #ffdde1 100%)',
    fullCssGradient: 'radial-gradient(circle at 80% 15%, rgba(194, 233, 251, 0.6) 0%, transparent 50%), radial-gradient(circle at 20% 85%, rgba(255, 221, 225, 0.5) 0%, transparent 55%), linear-gradient(135deg, #101524 0%, #1e263d 50%, #0b0f1a 100%)',
  },
  {
    id: 'cyber-seoul',
    name: 'Cyberpunk Seoul 2077',
    subtitle: 'Neon Rain AMOLED Glass',
    accentColor: '#00ffcc',
    previewGradient: 'linear-gradient(135deg, #f72585 0%, #7209b7 40%, #3a0ca3 70%, #4cc9f0 100%)',
    fullCssGradient: 'radial-gradient(circle at 85% 30%, rgba(247, 37, 133, 0.75) 0%, transparent 50%), radial-gradient(circle at 15% 70%, rgba(76, 201, 240, 0.75) 0%, transparent 55%), linear-gradient(160deg, #050515 0%, #0f0b24 50%, #020208 100%)',
  },
  {
    id: 'deep-space',
    name: 'Orion Nebula QHD',
    subtitle: 'Deep Galaxy Star Dust',
    isAmoledBlack: true,
    accentColor: '#bd00ff',
    previewGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fullCssGradient: 'radial-gradient(circle at 65% 35%, rgba(189, 0, 255, 0.65) 0%, transparent 55%), radial-gradient(circle at 25% 80%, rgba(0, 210, 255, 0.5) 0%, transparent 60%), linear-gradient(170deg, #000000 0%, #070314 45%, #000000 100%)',
  },
];

/**
 * Downloads high-resolution 3040x1440 (Galaxy Note 10 Native Quad HD+) wallpaper
 */
export function downloadUHDWallpaper(wallpaper: WallpaperItem) {
  const width = 3040;
  const height = 1440;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Render high-res background based on wallpaper palette
  const grad = ctx.createLinearGradient(0, 0, width, height);

  if (wallpaper.id === 'aura-glow') {
    grad.addColorStop(0, '#090e1f');
    grad.addColorStop(0.35, '#171b30');
    grad.addColorStop(0.7, '#231435');
    grad.addColorStop(1, '#060914');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dynamic aura orb 1
    const radial1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 800);
    radial1.addColorStop(0, 'rgba(255, 117, 140, 0.85)');
    radial1.addColorStop(0.5, 'rgba(255, 126, 179, 0.4)');
    radial1.addColorStop(1, 'transparent');
    ctx.fillStyle = radial1;
    ctx.fillRect(0, 0, width, height);

    // Dynamic aura orb 2
    const radial2 = ctx.createRadialGradient(width * 0.25, height * 0.75, 50, width * 0.25, height * 0.75, 900);
    radial2.addColorStop(0, 'rgba(80, 227, 194, 0.75)');
    radial2.addColorStop(0.6, 'rgba(0, 240, 255, 0.35)');
    radial2.addColorStop(1, 'transparent');
    ctx.fillStyle = radial2;
    ctx.fillRect(0, 0, width, height);

    // Prismatic central beam
    const beam = ctx.createRadialGradient(width * 0.5, height * 0.5, 80, width * 0.5, height * 0.5, 750);
    beam.addColorStop(0, 'rgba(112, 166, 255, 0.9)');
    beam.addColorStop(0.6, 'rgba(255, 210, 105, 0.3)');
    beam.addColorStop(1, 'transparent');
    ctx.fillStyle = beam;
    ctx.fillRect(0, 0, width, height);
  } else if (wallpaper.id === 'aura-black') {
    grad.addColorStop(0, '#020305');
    grad.addColorStop(0.5, '#0b0e14');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const rad = ctx.createRadialGradient(width * 0.7, height * 0.3, 40, width * 0.7, height * 0.3, 900);
    rad.addColorStop(0, 'rgba(40, 50, 72, 0.6)');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, width, height);
  } else if (wallpaper.id === 'aura-blue') {
    grad.addColorStop(0, '#041026');
    grad.addColorStop(0.5, '#072459');
    grad.addColorStop(1, '#020712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const rad1 = ctx.createRadialGradient(width * 0.75, height * 0.25, 60, width * 0.75, height * 0.25, 850);
    rad1.addColorStop(0, 'rgba(111, 177, 252, 0.85)');
    rad1.addColorStop(1, 'transparent');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, width, height);
  } else {
    grad.addColorStop(0, '#0a0a18');
    grad.addColorStop(0.5, '#18122c');
    grad.addColorStop(1, '#02020a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const rad = ctx.createRadialGradient(width * 0.65, height * 0.35, 40, width * 0.65, height * 0.35, 900);
    rad.addColorStop(0, 'rgba(189, 0, 255, 0.7)');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, width, height);
  }

  // Subtle watermark stamp
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Samsung Galaxy Note 10 Ultra HD', width - 80, height - 60);

  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `Note10-UltraHD-${wallpaper.id}.png`;
  a.click();
}
