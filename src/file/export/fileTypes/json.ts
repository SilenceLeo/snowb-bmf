import type { FontToContent, Output } from '../type'

const type = 'JSON'
const exts = ['json']

const getContent: FontToContent = (bmfont) => {
  const { info, common, distanceField, pages, chars, kernings } = bmfont

  const result: Record<string, unknown> = {
    info: {
      face: info.face,
      size: info.size,
      bold: info.bold,
      italic: info.italic,
      charset: info.charset || '',
      unicode: info.unicode,
      stretchH: info.stretchH,
      smooth: info.smooth,
      aa: info.aa,
      padding: info.padding,
      spacing: info.spacing,
      outline: info.outline ?? 0,
    },
  }

  if (distanceField) {
    result.distanceField = {
      fieldType: distanceField.fieldType,
      distanceRange: distanceField.distanceRange,
    }
  }

  result.common = {
    lineHeight: common.lineHeight,
    base: common.base,
    scaleW: common.scaleW,
    scaleH: common.scaleH,
    pages: common.pages,
    packed: common.packed,
    alphaChnl: common.alphaChnl ?? 0,
    redChnl: common.redChnl ?? 0,
    greenChnl: common.greenChnl ?? 0,
    blueChnl: common.blueChnl ?? 0,
  }

  result.pages = pages.map((p) => p.file)

  result.chars = chars.list.map((c) => ({
    id: c.id,
    x: c.x,
    y: c.y,
    width: c.width,
    height: c.height,
    xoffset: c.xoffset,
    yoffset: c.yoffset,
    xadvance: c.xadvance,
    page: c.page,
    chnl: c.chnl,
  }))

  if (kernings.count > 0) {
    result.kernings = kernings.list.map((k) => ({
      first: k.first,
      second: k.second,
      amount: k.amount,
    }))
  }

  return JSON.stringify(result, null, 2)
}

const outputConfig: Output = {
  type,
  exts,
  getContent,
  supportsDistanceField: true,
}

export default outputConfig
