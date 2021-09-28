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
    highlightColor: { type: 'int32' },
    highlightAlpha: { type: 'int32' },
    quality: { type: 'int32' },
    angle: { type: 'int32' },
    shadowColor: { type: 'int32' },
    shadowAlpha: { type: 'int32' },
    blurX: { type: 'int32' },
    blurY: { type: 'int32' },
    type: { enum: ['inner', 'outer', 'full'] },
    strength: { type: 'int32' },
    distance: { type: 'int32' },
  },
}

export default bevel
