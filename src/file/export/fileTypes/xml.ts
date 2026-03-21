import { BMFont, FontToContent, Output } from '../type'

// cspell:ignore apos
const escapeXml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const type = 'XML'

const exts = ['xml', 'fnt']

function setAttrs(
  el: Element,
  attrs: Record<string, string | number | undefined | null>,
): void {
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) {
      el.setAttribute(key, String(value))
    }
  }
}

// http://www.angelcode.com/products/bmfont/doc/file_format.html
const getContent: FontToContent = (bmfont: BMFont) => {
  const { info, common, distanceField, pages, chars, kernings } = bmfont

  const xmlDOM = document.implementation.createDocument('', 'font', null)
  const root = xmlDOM.documentElement

  // Info element
  const infoEl = xmlDOM.createElement('info')
  setAttrs(infoEl, {
    face: escapeXml(info.face),
    size: info.size,
    bold: info.bold,
    italic: info.italic,
    charset: escapeXml(info.charset),
    unicode: info.unicode,
    stretchH: info.stretchH,
    smooth: info.smooth,
    aa: info.aa,
    padding: String(info.padding),
    spacing: String(info.spacing),
    outline: info.outline,
  })
  root.appendChild(infoEl)

  // Distance field element (between info and common, per BMFont de facto standard)
  if (distanceField) {
    const dfEl = xmlDOM.createElement('distanceField')
    setAttrs(dfEl, {
      fieldType: distanceField.fieldType,
      distanceRange: distanceField.distanceRange,
    })
    root.appendChild(dfEl)
  }

  // Common element
  const commonEl = xmlDOM.createElement('common')
  setAttrs(commonEl, {
    lineHeight: common.lineHeight,
    base: common.base,
    scaleW: common.scaleW,
    scaleH: common.scaleH,
    pages: common.pages,
    packed: common.packed,
    xFpBits: common.xFpBits || undefined,
    alphaChnl: common.alphaChnl,
    redChnl: common.redChnl,
    greenChnl: common.greenChnl,
    blueChnl: common.blueChnl,
  })
  root.appendChild(commonEl)

  // Pages element
  const pagesEl = xmlDOM.createElement('pages')
  pages.forEach((p) => {
    const pageEl = xmlDOM.createElement('page')
    setAttrs(pageEl, {
      id: p.id,
      file: escapeXml(p.file),
    })
    pagesEl.appendChild(pageEl)
  })
  root.appendChild(pagesEl)

  // Chars element
  const charsEl = xmlDOM.createElement('chars')
  charsEl.setAttribute('count', String(chars.count))
  chars.list.forEach((char) => {
    // Add character comment before the char element
    charsEl.appendChild(xmlDOM.createComment(` ${char.letter} `))

    const charEl = xmlDOM.createElement('char')
    setAttrs(charEl, {
      id: char.id,
      x: char.x,
      y: char.y,
      width: char.width,
      height: char.height,
      xoffset: char.xoffset,
      yoffset: char.yoffset,
      xadvance: char.xadvance,
      page: char.page,
      chnl: char.chnl,
    })
    charsEl.appendChild(charEl)
  })
  root.appendChild(charsEl)

  // Kernings element
  if (kernings.count) {
    const kerningsEl = xmlDOM.createElement('kernings')
    kerningsEl.setAttribute('count', String(kernings.count))

    kernings.list.forEach((kerning) => {
      const kerningEl = xmlDOM.createElement('kerning')
      setAttrs(kerningEl, {
        first: kerning.first,
        second: kerning.second,
        amount: kerning.amount,
      })
      kerningsEl.appendChild(kerningEl)
    })

    root.appendChild(kerningsEl)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>${new XMLSerializer().serializeToString(
    xmlDOM,
  )}`
}

const outputConfig: Output = { type, exts, getContent, supportsDistanceField: true }

export default outputConfig
