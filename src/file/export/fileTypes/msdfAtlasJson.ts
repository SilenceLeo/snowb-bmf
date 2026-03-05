import type { ExportContext, ExportFilesResult, Output } from '../type'

const type = 'MSDF-JSON'
const exts = ['json']

/**
 * Build msdf-atlas-gen compatible JSON output.
 *
 * Uses em-normalized coordinates with yOrigin "bottom" (Y-axis up).
 * All advance/kerning values include user manual adjustments from BMFont data.
 */
function buildMsdfAtlasJson(context: ExportContext): ExportFilesResult {
  const { project, bmfont, fileName } = context
  const { renderMode, distanceRange } = project
  const { opentype } = project.style.font
  const fontSize = project.style.font.size || 1 // guard against division by zero
  const atlasH = bmfont.common.scaleH
  const atlasW = bmfont.common.scaleW
  const base = bmfont.common.base
  const fractionalScale = 1 << (bmfont.common.xFpBits || 0)

  // Font metrics (em-normalized), prefer opentype.js (sync, no WASM dependency)
  const unitsPerEm = opentype?.unitsPerEm ?? 1000

  // Underline data from post table
  const postTable = opentype?.tables?.post as
    | { underlinePosition?: number; underlineThickness?: number }
    | undefined

  const metrics = {
    emSize: 1,
    lineHeight: opentype
      ? (opentype.ascender - opentype.descender) / unitsPerEm
      : bmfont.common.lineHeight / fontSize,
    ascender: opentype
      ? opentype.ascender / unitsPerEm
      : base / fontSize,
    descender: opentype
      ? opentype.descender / unitsPerEm
      : -(bmfont.common.lineHeight - base) / fontSize,
    underlineY: postTable?.underlinePosition
      ? postTable.underlinePosition / unitsPerEm
      : 0,
    underlineThickness: postTable?.underlineThickness
      ? postTable.underlineThickness / unitsPerEm
      : 0,
  }

  // Glyphs — use BMFont values for advance to include user adjustments
  const glyphs = bmfont.chars.list.map((char) => {
    const advance = char.xadvance / fractionalScale / fontSize

    const entry: Record<string, unknown> = { unicode: char.id, advance }

    // Only include bounds for non-empty glyphs (skip space-like chars)
    if (char.width > 0 && char.height > 0) {
      // planeBounds: em-normalized relative to cursor/baseline
      // top/bottom: positive above baseline, negative below
      entry.planeBounds = {
        left: char.xoffset / fontSize,
        bottom: (base - char.yoffset - char.height) / fontSize,
        right: (char.xoffset + char.width) / fontSize,
        top: (base - char.yoffset) / fontSize,
      }
      // atlasBounds: pixel coordinates, yOrigin "bottom" (Y-flipped), 0.5 offset
      entry.atlasBounds = {
        left: char.x + 0.5,
        bottom: atlasH - (char.y + char.height) + 0.5,
        right: char.x + char.width - 0.5,
        top: atlasH - char.y - 0.5,
      }
    }

    return entry
  })

  // Kerning (em-normalized, includes manual + opentype adjustments)
  const kerning = bmfont.kernings.count > 0
    ? bmfont.kernings.list.map((k) => ({
        unicode1: k.first,
        unicode2: k.second,
        advance: k.amount / fractionalScale / fontSize,
      }))
    : []

  // Atlas descriptor
  const isSdf = renderMode !== 'default'
  const atlas: Record<string, unknown> = {
    type: isSdf ? renderMode : 'softmask',
    size: fontSize,
    width: atlasW,
    height: atlasH,
    yOrigin: 'bottom',
  }

  if (isSdf) {
    atlas.distanceRange = distanceRange
    atlas.distanceRangeMiddle = 0
  }

  // Limit non-integer floats to 6 significant decimals for cleaner output.
  // JS stringify already guarantees IEEE 754 round-trip; this just trims
  // long repeating fractions (e.g. 1/36 → 0.027778 instead of 0.027777…76).
  const roundPrecision = (v: unknown) =>
    typeof v === 'number' && !Number.isInteger(v)
      ? parseFloat(v.toFixed(6))
      : v

  const json = JSON.stringify(
    { atlas, metrics, glyphs, kerning },
    (_key, value) => roundPrecision(value),
    2,
  )

  return {
    files: [{ name: `${fileName}.json`, content: json }],
    includePng: true,
  }
}

const outputConfig: Output = {
  type,
  exts,
  getFiles: buildMsdfAtlasJson,
  includePng: true,
  supportsDistanceField: true,
}

export default outputConfig
