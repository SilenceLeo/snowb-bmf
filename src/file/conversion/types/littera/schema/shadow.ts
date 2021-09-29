import { JTDSchemaType } from 'ajv/dist/jtd'

export interface ShadowData {
  quality: number
  color: number
  strength: number
  blurX: number
  angle: number
  blurY: number
  shadowEnabled: boolean
  alpha: number
  distance: number
}

const shadow: JTDSchemaType<ShadowData> = {
  properties: {
    quality: { type: 'float32' },
    color: { type: 'float32' },
    strength: { type: 'float32' },
    blurX: { type: 'float32' },
    angle: { type: 'float32' },
    blurY: { type: 'float32' },
    shadowEnabled: { type: 'boolean' },
    alpha: { type: 'float32' },
    distance: { type: 'float32' },
  },
}

export default shadow
