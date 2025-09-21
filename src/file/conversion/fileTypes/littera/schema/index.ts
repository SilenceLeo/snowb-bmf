import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'

import background, { BackgroundData } from './background'
import bevel, { BevelData } from './bevel'
import fill, { FillData } from './fill'
import font, { FontData } from './font'
import glow, { GlowData } from './glow'
import glyphs, { GlyphsData } from './glyphs'
import settings, { SettingsData } from './settings'
import shadow, { ShadowData } from './shadow'
import stroke, { StrokeData } from './stroke'

const ajv = new Ajv()

export interface LitteraData {
  glow: GlowData
  fill: FillData
  settings: SettingsData
  shadow: ShadowData
  stroke: StrokeData
  background: BackgroundData
  bevel: BevelData
  glyphs: GlyphsData
  font: FontData
  fallbackfont?: string
}

const schema: JTDSchemaType<LitteraData> = {
  properties: {
    glow,
    fill,
    settings,
    shadow,
    stroke,
    background,
    bevel,
    glyphs,
    font,
  },
  optionalProperties: {
    fallbackfont: { type: 'string' },
  },
}

export * from './glow'
export * from './fill'
export * from './settings'
export * from './shadow'
export * from './stroke'
export * from './background'
export * from './bevel'
export * from './glyphs'
export * from './font'

export const validate = ajv.compile(schema)

export default validate
