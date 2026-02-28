import type { GradientPreset } from 'src/types/gradientPreset'

const builtinGradientPresets: GradientPreset[] = [
  {
    id: 'builtin-bw',
    name: 'Black \u2192 White',
    palette: [
      { offset: 0, color: 'rgba(0,0,0,1)' },
      { offset: 1, color: 'rgba(255,255,255,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-wb',
    name: 'White \u2192 Black',
    palette: [
      { offset: 0, color: 'rgba(255,255,255,1)' },
      { offset: 1, color: 'rgba(0,0,0,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-rainbow',
    name: 'Rainbow',
    palette: [
      { offset: 0, color: 'rgba(255,0,0,1)' },
      { offset: 0.17, color: 'rgba(255,165,0,1)' },
      { offset: 0.33, color: 'rgba(255,255,0,1)' },
      { offset: 0.5, color: 'rgba(0,128,0,1)' },
      { offset: 0.67, color: 'rgba(0,0,255,1)' },
      { offset: 0.83, color: 'rgba(75,0,130,1)' },
      { offset: 1, color: 'rgba(148,0,211,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-sunset',
    name: 'Sunset',
    palette: [
      { offset: 0, color: 'rgba(255,94,58,1)' },
      { offset: 0.5, color: 'rgba(255,149,0,1)' },
      { offset: 1, color: 'rgba(255,204,0,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-ocean',
    name: 'Ocean',
    palette: [
      { offset: 0, color: 'rgba(0,50,100,1)' },
      { offset: 0.5, color: 'rgba(0,150,200,1)' },
      { offset: 1, color: 'rgba(0,220,220,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-fire',
    name: 'Fire',
    palette: [
      { offset: 0, color: 'rgba(180,0,0,1)' },
      { offset: 0.4, color: 'rgba(255,80,0,1)' },
      { offset: 0.7, color: 'rgba(255,180,0,1)' },
      { offset: 1, color: 'rgba(255,240,100,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-metallic',
    name: 'Metallic',
    palette: [
      { offset: 0, color: 'rgba(100,100,100,1)' },
      { offset: 0.3, color: 'rgba(200,200,200,1)' },
      { offset: 0.5, color: 'rgba(140,140,140,1)' },
      { offset: 0.7, color: 'rgba(220,220,220,1)' },
      { offset: 1, color: 'rgba(120,120,120,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-gold',
    name: 'Gold',
    palette: [
      { offset: 0, color: 'rgba(180,130,50,1)' },
      { offset: 0.3, color: 'rgba(255,215,0,1)' },
      { offset: 0.6, color: 'rgba(255,235,140,1)' },
      { offset: 1, color: 'rgba(200,160,60,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-neon',
    name: 'Neon',
    palette: [
      { offset: 0, color: 'rgba(255,0,255,1)' },
      { offset: 0.33, color: 'rgba(0,255,255,1)' },
      { offset: 0.66, color: 'rgba(0,255,0,1)' },
      { offset: 1, color: 'rgba(255,0,128,1)' },
    ],
    isBuiltin: true,
  },
  {
    id: 'builtin-sky',
    name: 'Sky',
    palette: [
      { offset: 0, color: 'rgba(30,100,200,1)' },
      { offset: 0.5, color: 'rgba(100,180,255,1)' },
      { offset: 1, color: 'rgba(200,230,255,1)' },
    ],
    isBuiltin: true,
  },
]

export default builtinGradientPresets
