import Color from 'color'
import {
  Font,
  Style,
  Layout,
  Project,
  FillType,
  Gradient,
  GlyphFont,
  FontResource,
  GradientType,
  PatternTexture,
  FontStyleConfig,
  ShadowStyleConfig,
  StrokeStyleConfig,
} from 'src/store'
import base64ToArrayBuffer from 'src/utils/supports/base64ToArrayBuffer'
import { DecodeProjectFunction } from '../type'
import { LitteraData, FillData, StrokeData } from './schema'
import check from './check'

function transformFill(litteraFill: FillData | StrokeData): FontStyleConfig {
  const fill = {} as FontStyleConfig
  if (litteraFill.fillType === 'gradientFill') {
    // solid color
    if (litteraFill.gradientColors.length < 2) {
      fill.type = FillType.SOLID
      fill.color = Color(litteraFill.gradientColors[0])
        .alpha(litteraFill.gradientAlphas[0])
        .hex()
    } else {
      fill.type = FillType.GRADIENT
      fill.gradient = {} as Gradient
      fill.gradient.palette = []
      fill.gradient.type =
        litteraFill.gradientType === 'radial'
          ? GradientType.RADIAL
          : GradientType.LINEAR

      litteraFill.gradientColors.forEach((color, idx) => {
        fill.gradient.palette.push({
          id: idx + 1,
          color: Color(color).alpha(litteraFill.gradientAlphas[idx]).hex(),
          offset: litteraFill.gradientRatios[idx] / 255,
        })
      })
      fill.gradient.angle = litteraFill.gradientRotation
    }
  } else {
    fill.patternTexture = {
      scale: litteraFill.textureScale,
    } as PatternTexture

    if (litteraFill.texture) {
      fill.patternTexture.buffer = base64ToArrayBuffer(litteraFill.texture)
    }
  }

  return fill
}

const decode: DecodeProjectFunction = (litteraData) => {
  if (!check(litteraData)) throw new Error('unknow file')

  if (typeof litteraData === 'string') litteraData = JSON.parse(litteraData)

  const data = litteraData as LitteraData
  const project: Partial<Project> = {}

  project.text = data.glyphs.glyphs

  project.glyphs = new Map()

  data.glyphs.glyphs
    .split('')
    .forEach((letter) => project.glyphs?.set(letter, { letter } as GlyphFont))

  /**
   * style
   */

  /**
   * style.font
   */
  //#region style.font
  const font = {} as Font
  font.size = data.font.size

  if (data.font.data) {
    font.fonts = []
    font.fonts.push({
      font: base64ToArrayBuffer(data.font.data),
    } as FontResource)
    if (data.fallbackfont) {
      font.fonts.push({
        font: base64ToArrayBuffer(data.fallbackfont),
      } as FontResource)
    }
  }
  //#endregion

  /**
   * style.fill
   */
  //#region style.fill
  const fill = transformFill(data.fill) as FontStyleConfig
  //#endregion

  /**
   * style.stroke
   */
  //#region style.stroke
  const stroke = {} as StrokeStyleConfig
  stroke.width = data.stroke.size
  stroke.lineJoin = data.stroke.jointStyle
  Object.assign(stroke, transformFill(data.stroke))
  //#endregion

  /**
   * style.shadow
   */
  //#region style.shadow
  const shadow = {} as ShadowStyleConfig
  shadow.color = Color(data.shadow.color).alpha(data.shadow.alpha).hex()
  shadow.blur = data.shadow.quality + data.shadow.blurX - data.shadow.strength
  shadow.offsetX = Math.round(
    Math.cos((data.shadow.angle * Math.PI) / 180) * data.shadow.distance,
  )
  shadow.offsetY = Math.round(
    Math.sin((data.shadow.angle * Math.PI) / 180) * data.shadow.distance,
  )
  //#endregion

  project.style = {
    font,
    fill,
    useStroke: data.stroke.strokeEnabled,
    stroke,
    useShadow: data.shadow.shadowEnabled,
    shadow,
  } as Style

  /**
   * layout
   */
  project.layout = {} as Layout
  project.layout.padding = data.glyphs.padding
  if (!isNaN(Number(data.glyphs.canvasWidth))) {
    project.layout.width = Number(data.glyphs.canvasWidth)
  }
  if (!isNaN(Number(data.glyphs.canvasHeight))) {
    project.layout.width = Number(data.glyphs.canvasHeight)
  }
  if (project.layout.width && project.layout.height) {
    project.layout.autoPack = false
    project.layout.fixedSize = true
  }

  return project
}

export default decode
