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
    quality: { type: 'int32' },
    color: { type: 'int32' },
    strength: { type: 'int32' },
    blurX: { type: 'int32' },
    angle: { type: 'int32' },
    blurY: { type: 'int32' },
    shadowEnabled: { type: 'boolean' },
    alpha: { type: 'int32' },
    distance: { type: 'int32' },
  },
}

export default shadow
