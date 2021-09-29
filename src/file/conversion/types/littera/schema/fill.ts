import { JTDSchemaType } from 'ajv/dist/jtd'

export interface FillData {
  gradientAlphas: number[]
  yOffset: number
  gradientType: 'linear' | 'radial'
  gradientRotation: number
  fillType: 'gradientFill' | 'textureFill'
  textureScale: number
  distanceFieldEnabled: boolean
  distanceFieldColor: number
  gradientColors: number[]
  distanceFieldDownscale: number
  distanceFieldSpread: number
  distanceFieldType: 'Type 1' | 'Type 2'
  gradientRatios: number[]
  xOffset: number
  texture?: string
}

const fill: JTDSchemaType<FillData> = {
  properties: {
    gradientAlphas: { elements: { type: 'float32' } },
    yOffset: { type: 'float32' },
    gradientType: { enum: ['linear', 'radial'] },
    gradientRotation: { type: 'float32' },
    fillType: { enum: ['gradientFill', 'textureFill'] },
    textureScale: { type: 'float32' },
    distanceFieldEnabled: { type: 'boolean' },
    distanceFieldColor: { type: 'float32' },
    gradientColors: { elements: { type: 'float32' } },
    distanceFieldDownscale: { type: 'float32' },
    distanceFieldSpread: { type: 'float32' },
    distanceFieldType: { enum: ['Type 1', 'Type 2'] },
    gradientRatios: { elements: { type: 'float32' } },
    xOffset: { type: 'float32' },
  },
  optionalProperties: {
    texture: { type: 'string' },
  },
}

export default fill
