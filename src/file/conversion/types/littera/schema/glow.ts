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
    quality: { type: 'int32' },
    colors: { elements: { type: 'int32' } },
    glowEnabled: { type: 'boolean' },
    alphas: { elements: { type: 'int32' } },
    ratios: { elements: { type: 'int32' } },
    blurX: { type: 'int32' },
    angle: { type: 'int32' },
    blurY: { type: 'int32' },
    strength: { type: 'int32' },
    distance: { type: 'int32' },
  },
}

export default glow
