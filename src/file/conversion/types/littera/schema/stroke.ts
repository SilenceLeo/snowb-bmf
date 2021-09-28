import { JTDSchemaType } from 'ajv/dist/jtd'

export interface StrokeData {
  gradientAlphas: number[]
  yOffset: number
  gradientType: 'linear' | 'radial'
  gradientRotation: number
  fillType: 'gradientFill' | 'textureFill'
  pixelHinting: boolean
  textureScale: number
  gradientColors: number[]
  strokeEnabled: boolean
  miterLimit: number
  jointStyle: 'miter' | 'bevel' | 'round'
  size: number
  gradientRatios: number[]
  xOffset: number
}

const stroke: JTDSchemaType<StrokeData> = {
  properties: {
    gradientAlphas: { elements: { type: 'int32' } },
    yOffset: { type: 'int32' },
    gradientType: { enum: ['linear', 'radial'] },
    gradientRotation: { type: 'int32' },
    fillType: { enum: ['gradientFill', 'textureFill'] },
    pixelHinting: { type: 'boolean' },
    textureScale: { type: 'int32' },
    gradientColors: { elements: { type: 'int32' } },
    strokeEnabled: { type: 'boolean' },
    miterLimit: { type: 'int32' },
    jointStyle: { enum: ['miter', 'bevel', 'round'] },
    size: { type: 'int32' },
    gradientRatios: { elements: { type: 'int32' } },
    xOffset: { type: 'int32' },
  },
}

export default stroke
