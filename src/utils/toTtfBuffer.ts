import { Font, FontName } from 'fonteditor-core'

export type BufferType = 'ttf' | 'woff' | 'woff2' | 'eot' | 'otf' | 'svg'

export interface OutputInfo {
  buffer: ArrayBuffer
  name: FontName
}

export default function toTtfBuffer(
  buffer: ArrayBuffer,
  originType: string,
): OutputInfo {
  const type = originType.toLowerCase()

  const font = Font.create(buffer, {
    type, // support ttf, woff, woff2, eot, otf, svg
    // subset: [65, 66], // only read `a`, `b` glyf
    hinting: true, // save font hinting
    compound2simple: false, // transform ttf compound glyf to simple
    // inflate: null, // inflate function for woff
    combinePath: false, // for svg path
  })
  const info = font.get()

  let outputBuffer: ArrayBuffer
  if (type === 'ttf') {
    outputBuffer = buffer
  } else {
    outputBuffer = font.write({
      type: 'ttf', // support ttf, woff, woff2, eot, svg
      hinting: true, // save font hinting
      // deflate: null, // deflate function for woff
      support: { head: info.head, hhea: info.hhea }, // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
    })
  }

  return { buffer: outputBuffer, name: info.name }
}
