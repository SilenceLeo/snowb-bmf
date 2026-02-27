import { Project } from 'src/store'

import { ExportContext, ExportFilesResult, Output } from '../type'

type PixelFormat =
  | 'GRAY8'
  | 'RGB'
  | 'RGBA'
  | 'ARGB'
  | 'BGR'
  | 'ABGR'
  | 'BGRA'
  | 'RGB565'

const type = 'C'
const exts = ['c']

const FORMAT_BPP: Record<PixelFormat, number> = {
  GRAY8: 1,
  RGB: 3,
  RGBA: 4,
  ARGB: 4,
  BGR: 3,
  ABGR: 4,
  BGRA: 4,
  RGB565: 2,
}

interface GlyphData {
  id: number
  w: number
  h: number
  x: number
  y: number
  a: number
  page: number
  data: Uint8Array
  dataSize: number
  kern: { c: number; k: number }[]
}

function safeIdentifier(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9_]/g, '_')
  if (!cleaned) return 'font'
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)))
}

function grayscaleFromRgba(r: number, g: number, b: number, a: number): number {
  const avg = Math.floor((r + g + b) / 3)
  const v = Math.round((avg * a) / 255)
  return clampInt(v, 0, 255)
}

function blurCrop(
  data: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  w: number,
  h: number,
): Uint8Array {
  const out = new Uint8Array(w * h)
  const kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ]

  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      let acc = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const iy = y + yy + ky
          const ix = x + xx + kx
          let pixel = 0
          if (iy >= 0 && iy < height && ix >= 0 && ix < width) {
            pixel = data[iy * width + ix]
          }
          acc += kernel[ky + 1][kx + 1] * pixel
        }
      }
      out[yy * w + xx] = (acc + (1 << 3)) >> 4
    }
  }

  return out
}

function encodePixelFromChannels(
  format: PixelFormat,
  r: number,
  g: number,
  b: number,
  a: number,
): number[] {
  switch (format) {
    case 'RGB':
      return [r, g, b]
    case 'BGR':
      return [b, g, r]
    case 'RGBA':
      return [r, g, b, a]
    case 'ARGB':
      return [a, r, g, b]
    case 'BGRA':
      return [b, g, r, a]
    case 'ABGR':
      return [a, b, g, r]
    case 'RGB565': {
      const value = ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3)
      return [value & 0xff, (value >> 8) & 0xff]
    }
    default:
      return [r, g, b]
  }
}

function buildGlyphData(
  project: Project,
  bmfont: ExportContext['bmfont'],
  format: PixelFormat,
  applyBlur: boolean,
  extended: boolean,
): { glyphs: GlyphData[]; baseLine: number } {
  const { packCanvases, layout } = project
  const pageImages: ImageData[] = []

  for (let i = 0; i < layout.page; i++) {
    const canvas = packCanvases?.[i]
    if (!canvas) continue
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) continue
    pageImages[i] = ctx.getImageData(0, 0, canvas.width, canvas.height)
  }

  const glyphs: GlyphData[] = []
  const kernMap = new Map<number, { c: number; k: number }[]>()
  const validChars = extended
    ? bmfont.chars.list
    : bmfont.chars.list.filter((char) => char.id <= 65535)
  const validIds = new Set(validChars.map((char) => char.id))

  bmfont.kernings.list.forEach((kern) => {
    if (!extended) {
      if (
        kern.first > 65535 ||
        kern.second > 65535 ||
        !validIds.has(kern.first)
      ) {
        return
      }
    } else if (!validIds.has(kern.first)) {
      return
    }
    const list = kernMap.get(kern.first) || []
    list.push({
      c: kern.second,
      k: clampInt(
        Math.round(kern.amount),
        extended ? -32768 : -128,
        extended ? 32767 : 127,
      ),
    })
    kernMap.set(kern.first, list)
  })

  validChars.forEach((char) => {
    const id = char.id
    const pageIndex = char.page || 0
    const pageImage = pageImages[pageIndex]
    const w0 = Math.max(0, Math.round(char.width))
    const h0 = Math.max(0, Math.round(char.height))
    const x0 = Math.max(0, Math.round(char.x))
    const y0 = Math.max(0, Math.round(char.y))

    const xOffset = clampInt(
      Math.round(char.xoffset),
      extended ? -32768 : -128,
      extended ? 32767 : 127,
    )
    const yOffset = clampInt(
      Math.round(char.yoffset),
      extended ? -32768 : -128,
      extended ? 32767 : 127,
    )
    const xAdvance = clampInt(
      Math.round(char.xadvance),
      0,
      extended ? 65535 : 255,
    )

    if (!pageImage || w0 === 0 || h0 === 0) {
      glyphs.push({
        id,
        w: 0,
        h: 0,
        x: xOffset,
        y: yOffset,
        a: xAdvance,
        page: pageIndex,
        data: new Uint8Array(0),
        dataSize: 0,
        kern: kernMap.get(id) || [],
      })
      return
    }

    const src = pageImage.data
    const pageWidth = pageImage.width
    const pageHeight = pageImage.height
    const gray = new Uint8Array(w0 * h0)
    const alpha = new Uint8Array(w0 * h0)
    const red = new Uint8Array(w0 * h0)
    const green = new Uint8Array(w0 * h0)
    const blue = new Uint8Array(w0 * h0)

    for (let yy = 0; yy < h0; yy++) {
      for (let xx = 0; xx < w0; xx++) {
        const sx = x0 + xx
        const sy = y0 + yy
        if (sx < 0 || sy < 0 || sx >= pageWidth || sy >= pageHeight) continue
        const idx = (sy * pageWidth + sx) * 4
        const r = src[idx]
        const g = src[idx + 1]
        const b = src[idx + 2]
        const a = src[idx + 3]
        const outIndex = yy * w0 + xx
        gray[outIndex] = grayscaleFromRgba(r, g, b, a)
        alpha[outIndex] = a
        const alphaFactor = a / 255
        red[outIndex] = clampInt(Math.round(r * alphaFactor), 0, 255)
        green[outIndex] = clampInt(Math.round(g * alphaFactor), 0, 255)
        blue[outIndex] = clampInt(Math.round(b * alphaFactor), 0, 255)
      }
    }

    let minX = w0
    let minY = h0
    let maxX = 0
    let maxY = 0
    let hasPixel = false

    const trimSource = format === 'GRAY8' ? gray : alpha

    for (let yy = 0; yy < h0; yy++) {
      for (let xx = 0; xx < w0; xx++) {
        const idx = yy * w0 + xx
        const v = trimSource[idx]
        if (v > 0) {
          hasPixel = true
          if (xx < minX) minX = xx
          if (yy < minY) minY = yy
          if (xx + 1 > maxX) maxX = xx + 1
          if (yy + 1 > maxY) maxY = yy + 1
        }
      }
    }

    if (!hasPixel) {
      minX = maxX = 0
      minY = maxY = 0
    }

    const w = maxX - minX
    const h = maxY - minY
    let data: Uint8Array

    if (format === 'GRAY8') {
      if (applyBlur) {
        data = blurCrop(gray, w0, h0, minX, minY, w, h)
      } else {
        const out = new Uint8Array(w * h)
        for (let yy = 0; yy < h; yy++) {
          for (let xx = 0; xx < w; xx++) {
            out[yy * w + xx] = gray[(minY + yy) * w0 + (minX + xx)]
          }
        }
        data = out
      }
    } else {
      const srcRed = applyBlur ? blurCrop(red, w0, h0, minX, minY, w, h) : null
      const srcGreen = applyBlur
        ? blurCrop(green, w0, h0, minX, minY, w, h)
        : null
      const srcBlue = applyBlur
        ? blurCrop(blue, w0, h0, minX, minY, w, h)
        : null
      const srcAlpha = applyBlur
        ? blurCrop(alpha, w0, h0, minX, minY, w, h)
        : null
      const bytes: number[] = []
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const srcIndex = (minY + yy) * w0 + (minX + xx)
          const outIndex = yy * w + xx
          const r = applyBlur ? srcRed![outIndex] : red[srcIndex]
          const g = applyBlur ? srcGreen![outIndex] : green[srcIndex]
          const b = applyBlur ? srcBlue![outIndex] : blue[srcIndex]
          const a = applyBlur ? srcAlpha![outIndex] : alpha[srcIndex]
          bytes.push(...encodePixelFromChannels(format, r, g, b, a))
        }
      }
      data = Uint8Array.from(bytes)
    }

    glyphs.push({
      id,
      w: clampInt(w, 0, extended ? 65535 : 255),
      h: clampInt(h, 0, extended ? 65535 : 255),
      x: clampInt(
        xOffset + minX,
        extended ? -32768 : -128,
        extended ? 32767 : 127,
      ),
      y: clampInt(
        yOffset + minY,
        extended ? -32768 : -128,
        extended ? 32767 : 127,
      ),
      a: xAdvance,
      page: pageIndex,
      data,
      dataSize: data.length,
      kern: kernMap.get(id) || [],
    })
  })

  return {
    glyphs,
    baseLine: clampInt(Math.round(bmfont.common.base), 0, 65535),
  }
}

function bytesToCArray(data: Uint8Array): string {
  const lines: string[] = []
  let line: string[] = []
  data.forEach((byte, index) => {
    line.push(`0x${byte.toString(16).padStart(2, '0').toUpperCase()}`)
    if (line.length === 16 || index === data.length - 1) {
      lines.push(`\t${line.join(', ')}`)
      line = []
    }
  })
  return lines.join(',\n')
}

function buildCFiles(context: ExportContext): ExportFilesResult {
  const { project, bmfont, fileName, options } = context
  const requested = (options?.pixelFormat as PixelFormat) || 'GRAY8'
  const format: PixelFormat = FORMAT_BPP[requested] ? requested : 'GRAY8'
  const bpp = FORMAT_BPP[format]
  const applyBlur = options?.blur !== false
  const includeTextures = options?.includeTextures === true
  const extended = options?.extended === true
  const name = safeIdentifier(fileName)

  const { glyphs, baseLine } = buildGlyphData(
    project,
    bmfont,
    format,
    applyBlur,
    extended,
  )

  const dataOffsets: number[] = new Array(glyphs.length).fill(0)
  const uniqueBitmap: number[] = []
  let dataSize = 0

  for (let i = 0; i < glyphs.length; i++) {
    let match = -1
    for (let u = 0; u < uniqueBitmap.length; u++) {
      const g = uniqueBitmap[u]
      if (glyphs[g].dataSize !== glyphs[i].dataSize) continue
      if (glyphs[g].w !== glyphs[i].w || glyphs[g].h !== glyphs[i].h) {
        continue
      }
      if (glyphs[g].data.every((v, idx) => v === glyphs[i].data[idx])) {
        match = g
        break
      }
    }

    if (match >= 0) {
      dataOffsets[i] = dataOffsets[match]
    } else {
      dataOffsets[i] = dataSize
      uniqueBitmap.push(i)
      dataSize += glyphs[i].dataSize
    }
  }

  const combinedData = new Uint8Array(dataSize || 0)
  let cursor = 0
  uniqueBitmap.forEach((index) => {
    combinedData.set(glyphs[index].data, cursor)
    cursor += glyphs[index].dataSize
  })

  const kernOffset: number[] = new Array(glyphs.length).fill(0)
  const uniqueKern: number[] = []
  let kernTotal = 0

  for (let i = 0; i < glyphs.length; i++) {
    if (!glyphs[i].kern.length) continue
    let match = -1
    for (let u = 0; u < uniqueKern.length; u++) {
      const g = uniqueKern[u]
      if (glyphs[g].kern.length !== glyphs[i].kern.length) continue
      const same = glyphs[g].kern.every(
        (k, idx) =>
          k.c === glyphs[i].kern[idx].c && k.k === glyphs[i].kern[idx].k,
      )
      if (same) {
        match = g
        break
      }
    }

    if (match >= 0) {
      kernOffset[i] = kernOffset[match]
    } else {
      kernOffset[i] = kernTotal
      uniqueKern.push(i)
      kernTotal += glyphs[i].kern.length
    }
  }

  const kernLines: string[] = []
  uniqueKern.forEach((index) => {
    glyphs[index].kern.forEach((kern) => {
      kernLines.push(`\t{ ${kern.c}, ${kern.k} }`)
    })
  })

  const textureLines: string[] = []
  glyphs.forEach((g, idx) => {
    const originX = (g.w - g.x) << 15
    const originY = Math.trunc(((baseLine - g.y) << 17) / 3)
    textureLines.push(
      `\t{ ${g.w}, ${g.h}, ${originX}, ${originY}, (uint8_t *)&${name}_data[${dataOffsets[idx]}] }`,
    )
  })

  const glyphLines: string[] = []
  glyphs.forEach((g, idx) => {
    const offset = g.kern.length ? kernOffset[idx] : 0
    glyphLines.push(
      includeTextures
        ? `\t{ ${g.id}, ${g.x}, ${g.y}, ${g.a}, ${g.kern.length}, ${offset} }`
        : `\t{ ${g.id}, ${g.x}, ${g.y}, ${g.a}, ${g.kern.length}, ${offset}, ${g.w}, ${g.h}, &${name}_data[${dataOffsets[idx]}] }`,
    )
  })

  const fontLines = [
    `const font_t ${name}_font = {`,
    `\t${baseLine},`,
    `\t${glyphs.length},`,
    `\t${bpp},`,
    ...(includeTextures ? [`\t${name}_texture,`] : []),
    `\t${name}_kern,`,
    `\t${name}_glyph,`,
    '};',
    '',
  ]

  const cContent = [
    `#include "${fileName}.h"`,
    '',
    `static const uint8_t ${name}_data[${combinedData.length}] = {`,
    combinedData.length ? bytesToCArray(combinedData) : '',
    '};',
    '',
    ...(includeTextures
      ? [
          `static const texture_t ${name}_texture[${glyphs.length}] = {`,
          textureLines.join(',\n'),
          '};',
          '',
        ]
      : []),
    `static const kern_t ${name}_kern[${kernTotal}] = {`,
    kernLines.join(',\n'),
    '};',
    '',
    `static const glyph_t ${name}_glyph[${glyphs.length}] = {`,
    glyphLines.join(',\n'),
    '};',
    '',
    ...fontLines,
  ].join('\n')

  const structsContent = [
    '// Reference-only struct definitions. Provide your own real declarations.',
    '',
    '// Glyph descriptor',
    'typedef struct {',
    `\tuint${extended ? 32 : 16}_t cp;         // code-point`,
    `\tint${extended ? 16 : 8}_t x, y;         // draw offset`,
    `\tuint${extended ? 16 : 8}_t advance;     // advance`,
    `\tuint${extended ? 16 : 8}_t kern_n;      // kerning pairs`,
    '\tuint16_t kern_idx;   // kerning data index',
    ...(includeTextures
      ? []
      : [
          `\tuint${extended ? 16 : 8}_t w, h;        // size`,
          '\tconst uint8_t *data; // data pointer',
        ]),
    '} glyph_t;',
    '',
    'typedef struct {',
    `\tuint${extended ? 32 : 16}_t cp; // code-point`,
    `\tint${extended ? 16 : 8}_t k;    // kerning`,
    '} kern_t;',
    '',
    ...(includeTextures
      ? [
          '// Texture descriptor',
          'typedef struct {',
          '\tuint16_t w; // width',
          '\tuint16_t h; // height',
          '\tint32_t x;  // origo x Q16.16',
          '\tint32_t y;  // origo y Q16.16',
          '\tuint8_t *data;',
          '} texture_t;',
          '',
        ]
      : []),
    'typedef struct {',
    '\tuint16_t baseline;',
    '\tuint16_t glyph_count;',
    '\tuint16_t bpp;',
    ...(includeTextures ? ['\tconst texture_t *texture;'] : []),
    '\tconst kern_t *kern;',
    '\tconst glyph_t *glyph;',
    '} font_t;',
    '',
  ].join('\n')

  const hContent = [
    '#pragma once',
    '#include "bmfont.h"',
    '',
    `#define ${name.toUpperCase()}_FONT_NAME "${fileName}"`,
    '',
    `extern const font_t ${name}_font;`,
    '',
  ].join('\n')

  const emitReferenceHeader = fileName.toLowerCase() !== 'bmfont'

  return {
    files: [
      { name: `${fileName}.c`, content: cContent },
      { name: `${fileName}.h`, content: hContent },
      ...(emitReferenceHeader
        ? [{ name: 'bmfont.h', content: structsContent }]
        : []),
    ],
    includePng: false,
  }
}

const outputConfig: Output = {
  type,
  exts,
  getFiles: buildCFiles,
  includePng: false,
  supportsPixelFormat: true,
  supportsBlur: true,
  supportsTextures: true,
  supportsExtended: true,
}

export default outputConfig
