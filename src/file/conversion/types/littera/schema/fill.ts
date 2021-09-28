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
    gradientAlphas: { elements: { type: 'int32' } },
    yOffset: { type: 'int32' },
    gradientType: { enum: ['linear', 'radial'] },
    gradientRotation: { type: 'int32' },
    fillType: { enum: ['gradientFill', 'textureFill'] },
    textureScale: { type: 'int32' },
    distanceFieldEnabled: { type: 'boolean' },
    distanceFieldColor: { type: 'int32' },
    gradientColors: { elements: { type: 'int32' } },
    distanceFieldDownscale: { type: 'int32' },
    distanceFieldSpread: { type: 'int32' },
    distanceFieldType: { enum: ['Type 1', 'Type 2'] },
    gradientRatios: { elements: { type: 'int32' } },
    xOffset: { type: 'int32' },
  },
  optionalProperties: {
    texture: { type: 'string' },
  },
}

export default fill
