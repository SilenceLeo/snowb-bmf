import { JTDSchemaType } from 'ajv/dist/jtd'

export interface GlowData {
  quality: number
  colors: number[]
  glowEnabled: boolean
  alphas: number[]
  ratios: number[]
  blurX: number
  angle: number
  blurY: number
  strength: number
  distance: number
}

const glow: JTDSchemaType<GlowData> = {
  properties: {
    quality: { type: 'float32' },
    colors: { elements: { type: 'float32' } },
    glowEnabled: { type: 'boolean' },
    alphas: { elements: { type: 'float32' } },
    ratios: { elements: { type: 'float32' } },
    blurX: { type: 'float32' },
    angle: { type: 'float32' },
    blurY: { type: 'float32' },
    strength: { type: 'float32' },
    distance: { type: 'float32' },
  },
}

export default glow
