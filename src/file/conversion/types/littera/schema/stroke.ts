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
  texture?: string
}

const stroke: JTDSchemaType<StrokeData> = {
  properties: {
    gradientAlphas: { elements: { type: 'float32' } },
    yOffset: { type: 'float32' },
    gradientType: { enum: ['linear', 'radial'] },
    gradientRotation: { type: 'float32' },
    fillType: { enum: ['gradientFill', 'textureFill'] },
    pixelHinting: { type: 'boolean' },
    textureScale: { type: 'float32' },
    gradientColors: { elements: { type: 'float32' } },
    strokeEnabled: { type: 'boolean' },
    miterLimit: { type: 'float32' },
    jointStyle: { enum: ['miter', 'bevel', 'round'] },
    size: { type: 'float32' },
    gradientRatios: { elements: { type: 'float32' } },
    xOffset: { type: 'float32' },
  },
  optionalProperties: {
    texture: { type: 'string' },
  },
}

export default stroke
