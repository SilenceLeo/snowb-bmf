import Color from 'color'
import {
  FillType,
  Font,
  FontResource,
  FontStyleConfig,
  GlyphFont,
  Gradient,
  GradientType,
  Layout,
  PatternTexture,
  ShadowStyleConfig,
  StrokeStyleConfig,
  Style,
} from 'src/store'
import type { Project } from 'src/types/project'
import base64ToArrayBuffer from 'src/utils/base64ToArrayBuffer'

import { DecodeProjectFunction } from '../type'
import check from './check'
import { FillData, LitteraData, StrokeData } from './schema'

function transformFill(litteraFill: FillData | StrokeData): FontStyleConfig {
  if (litteraFill.fillType === 'gradientFill') {
    // solid color
    if (litteraFill.gradientColors.length < 2) {
      return {
        type: FillType.SOLID,
        color: Color(litteraFill.gradientColors[0])
          .alpha(litteraFill.gradientAlphas[0])
          .hex(),
      } as FontStyleConfig
    }

    const palette = litteraFill.gradientColors.map((color, idx) => ({
      id: idx + 1,
      color: Color(color).alpha(litteraFill.gradientAlphas[idx]).hex(),
      offset: litteraFill.gradientRatios[idx] / 255,
    }))

    return {
      type: FillType.GRADIENT,
      gradient: {
        type:
          litteraFill.gradientType === 'radial'
            ? GradientType.RADIAL
            : GradientType.LINEAR,
        palette,
        angle: litteraFill.gradientRotation,
      } as Gradient,
    } as FontStyleConfig
  }

  const patternTexture: Partial<PatternTexture> = {
    scale: litteraFill.textureScale,
  }
  if (litteraFill.texture) {
    patternTexture.buffer = base64ToArrayBuffer(litteraFill.texture)
  }

  return {
    patternTexture,
  } as FontStyleConfig
}

const decode: DecodeProjectFunction = (litteraData) => {
  if (!check(litteraData)) {
    throw new Error('unknown file')
  }

  if (typeof litteraData === 'string') {
    litteraData = JSON.parse(litteraData)
  }

  const data = litteraData as LitteraData
  const project: Partial<Project> = {}

  project.text = data.glyphs.glyphs

  const glyphs: Record<string, Partial<GlyphFont>> = {}
  Array.from(data.glyphs.glyphs).forEach((letter) => {
    glyphs[letter] = { letter }
  })
  project.glyphs = glyphs as Record<string, GlyphFont>

  /**
   * style
   */

  /**
   * style.font
   */
  //#region style.font
  const fonts: Partial<FontResource>[] = []
  if (data.font.data) {
    fonts.push({ font: base64ToArrayBuffer(data.font.data) })
    if (data.fallbackfont) {
      fonts.push({ font: base64ToArrayBuffer(data.fallbackfont) })
    }
  }
  const font: Partial<Font> = {
    size: data.font.size,
    ...(fonts.length > 0 && { fonts: fonts as FontResource[] }),
  }
  //#endregion

  /**
   * style.fill
   */
  //#region style.fill
  const fill = transformFill(data.fill)
  //#endregion

  /**
   * style.stroke
   */
  //#region style.stroke
  const stroke: Partial<StrokeStyleConfig> = {
    width: data.stroke.size,
    lineJoin: data.stroke.jointStyle,
    ...transformFill(data.stroke),
  }
  //#endregion

  /**
   * style.shadow
   */
  //#region style.shadow
  const shadow: Partial<ShadowStyleConfig> = {
    color: Color(data.shadow.color).alpha(data.shadow.alpha).hex(),
    blur: data.shadow.quality + data.shadow.blurX - data.shadow.strength,
    offsetX: Math.round(
      Math.cos((data.shadow.angle * Math.PI) / 180) * data.shadow.distance,
    ),
    offsetY: Math.round(
      Math.sin((data.shadow.angle * Math.PI) / 180) * data.shadow.distance,
    ),
  }
  //#endregion

  project.style = {
    font: font as Font,
    fill,
    useStroke: data.stroke.strokeEnabled,
    stroke: stroke as StrokeStyleConfig,
    useShadow: data.shadow.shadowEnabled,
    shadow: shadow as ShadowStyleConfig,
  } as Style

  /**
   * layout
   */
  const layoutWidth = !isNaN(Number(data.glyphs.canvasWidth))
    ? Number(data.glyphs.canvasWidth)
    : undefined
  const layoutHeight = !isNaN(Number(data.glyphs.canvasHeight))
    ? Number(data.glyphs.canvasHeight)
    : undefined
  const hasFixedSize = !!(layoutWidth && layoutHeight)

  project.layout = {
    padding: data.glyphs.padding,
    ...(layoutWidth !== undefined && { width: layoutWidth }),
    ...(layoutHeight !== undefined && { height: layoutHeight }),
    ...(hasFixedSize && { auto: false, fixedSize: true }),
  } as Layout

  return project
}

export default decode
