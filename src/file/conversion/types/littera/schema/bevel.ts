import { JTDSchemaType } from 'ajv/dist/jtd'

export interface BevelData {
  bevelEnabled: boolean
  highlightColor: number
  highlightAlpha: number
  quality: number
  angle: number
  shadowColor: number
  shadowAlpha: number
  blurX: number
  blurY: number
  type: 'inner' | 'outer' | 'full'
  strength: number
  distance: number
}

const bevel: JTDSchemaType<BevelData> = {
  properties: {
    bevelEnabled: { type: 'boolean' },
    highlightColor: { type: 'float32' },
    highlightAlpha: { type: 'float32' },
    quality: { type: 'float32' },
    angle: { type: 'float32' },
    shadowColor: { type: 'float32' },
    shadowAlpha: { type: 'float32' },
    blurX: { type: 'float32' },
    blurY: { type: 'float32' },
    type: { enum: ['inner', 'outer', 'full'] },
    strength: { type: 'float32' },
    distance: { type: 'float32' },
  },
}

export default bevel
