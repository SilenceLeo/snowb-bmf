/**
 * TTC (TrueType Collection) parser.
 *
 * Pure TypeScript, zero external dependencies.
 * Uses DataView for Big-Endian binary reads as required by the OpenType spec.
 */

export interface TtcFontEntry {
  index: number
  fontFamily: string
  fontSubfamily: string
  fullName: string
}

// --- Internal helpers -------------------------------------------------------

const TTC_TAG = 0x74746366 // 'ttcf'
const NAME_TAG = 0x6e616d65 // 'name'

/** Read a 4-byte ASCII tag as a 32-bit unsigned integer. */
function readTag(view: DataView, offset: number): number {
  return view.getUint32(offset)
}

/**
 * Decode a name record string.
 * - platformID 3 (Windows): UTF-16BE
 * - platformID 1 (Macintosh): single-byte (ASCII subset, good enough for font names)
 */
function decodeNameString(
  data: DataView,
  stringOffset: number,
  length: number,
  platformID: number,
): string {
  if (platformID === 3) {
    // UTF-16BE
    const chars: string[] = []
    for (let i = 0; i < length; i += 2) {
      chars.push(String.fromCharCode(data.getUint16(stringOffset + i)))
    }
    return chars.join('')
  }
  // Mac Roman / fallback — treat as single-byte
  const chars: string[] = []
  for (let i = 0; i < length; i++) {
    chars.push(String.fromCharCode(data.getUint8(stringOffset + i)))
  }
  return chars.join('')
}

interface TableRecord {
  tag: number
  checkSum: number
  offset: number
  length: number
}

/**
 * Read the table directory starting at `dirOffset` (an sfnt offset).
 * Returns the list of TableRecords.
 */
function readTableDirectory(
  view: DataView,
  dirOffset: number,
): TableRecord[] {
  // sfnt header: sfVersion(4) + numTables(2) + searchRange(2) + entrySelector(2) + rangeShift(2)
  const numTables = view.getUint16(dirOffset + 4)
  const records: TableRecord[] = []
  const recordStart = dirOffset + 12

  for (let i = 0; i < numTables; i++) {
    const off = recordStart + i * 16
    records.push({
      tag: readTag(view, off),
      checkSum: view.getUint32(off + 4),
      offset: view.getUint32(off + 8),
      length: view.getUint32(off + 12),
    })
  }

  return records
}

/**
 * Parse the `name` table located at the given absolute offset/length.
 * Returns a map: nameID → string (prefers Windows platform).
 */
function parseNameTable(
  buffer: ArrayBuffer,
  tableOffset: number,
  tableLength: number,
): Map<number, string> {
  const view = new DataView(buffer, tableOffset, tableLength)

  // name table header
  // format(2) + count(2) + stringOffset(2)
  const count = view.getUint16(2)
  const storageOffset = view.getUint16(4) // relative to start of name table

  const result = new Map<number, string>()
  // Track which platform provided each nameID so we can prefer Windows (3)
  const platformForId = new Map<number, number>()

  for (let i = 0; i < count; i++) {
    const recOff = 6 + i * 12
    const platformID = view.getUint16(recOff)
    // recOff+2: encodingID, recOff+4: languageID (unused)
    const nameID = view.getUint16(recOff + 6)
    const strLength = view.getUint16(recOff + 8)
    const strOffset = view.getUint16(recOff + 10)

    // Only care about nameID 1 (fontFamily) and 2 (fontSubfamily)
    if (nameID !== 1 && nameID !== 2) continue

    // Prefer Windows platform (3) over Mac (1)
    const existingPlatform = platformForId.get(nameID)
    if (existingPlatform === 3 && platformID !== 3) continue
    if (platformID !== 1 && platformID !== 3) continue

    const str = decodeNameString(
      view,
      storageOffset + strOffset,
      strLength,
      platformID,
    )

    result.set(nameID, str)
    platformForId.set(nameID, platformID)
  }

  return result
}

// --- Public API -------------------------------------------------------------

/**
 * Check if a buffer starts with the TTC signature `ttcf`.
 */
export function isTtcFile(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 4) return false
  const view = new DataView(buffer)
  return readTag(view, 0) === TTC_TAG
}

/**
 * Parse the TTC header and return metadata for each contained font.
 *
 * @throws if the buffer is not a valid TTC file.
 */
export function parseTtcHeader(buffer: ArrayBuffer): TtcFontEntry[] {
  if (!isTtcFile(buffer)) {
    throw new Error('Not a TTC file')
  }

  const view = new DataView(buffer)

  // TTC Header:
  // ttcTag(4) + majorVersion(2) + minorVersion(2) + numFonts(4) + offsetTable[numFonts](4 each)
  const numFonts = view.getUint32(8)
  const entries: TtcFontEntry[] = []

  for (let i = 0; i < numFonts; i++) {
    const fontOffset = view.getUint32(12 + i * 4)
    const tables = readTableDirectory(view, fontOffset)
    const nameTable = tables.find((t) => t.tag === NAME_TAG)

    let fontFamily = `Font ${i}`
    let fontSubfamily = 'Regular'

    if (nameTable) {
      const names = parseNameTable(buffer, nameTable.offset, nameTable.length)
      fontFamily = names.get(1) ?? fontFamily
      fontSubfamily = names.get(2) ?? fontSubfamily
    }

    entries.push({
      index: i,
      fontFamily,
      fontSubfamily,
      fullName: `${fontFamily} ${fontSubfamily}`,
    })
  }

  return entries
}

/**
 * Extract a single TTF font from a TTC file.
 *
 * Reads the table directory of the font at `fontIndex`, then assembles
 * a standalone TTF (sfnt) binary that `opentype.parse()` can consume.
 *
 * @throws if index is out of range or the buffer is invalid.
 */
export function extractTtfFromTtc(
  buffer: ArrayBuffer,
  fontIndex: number,
): ArrayBuffer {
  if (!isTtcFile(buffer)) {
    throw new Error('Not a TTC file')
  }

  const view = new DataView(buffer)
  const numFonts = view.getUint32(8)

  if (fontIndex < 0 || fontIndex >= numFonts) {
    throw new Error(
      `Font index ${fontIndex} out of range (0–${numFonts - 1})`,
    )
  }

  const fontOffset = view.getUint32(12 + fontIndex * 4)
  const sfVersion = view.getUint32(fontOffset) // 0x00010000 or 'OTTO'
  const tables = readTableDirectory(view, fontOffset)
  const numTables = tables.length

  // Compute sizes for the output TTF
  // sfnt header: 12 bytes
  // Table records: numTables * 16
  const headerSize = 12 + numTables * 16
  // Pad each table to 4-byte alignment
  let totalDataSize = 0
  for (const t of tables) {
    totalDataSize += (t.length + 3) & ~3 // 4-byte aligned
  }

  const outputSize = headerSize + totalDataSize
  const out = new ArrayBuffer(outputSize)
  const outView = new DataView(out)
  const outBytes = new Uint8Array(out)

  // Write sfnt header
  outView.setUint32(0, sfVersion)
  outView.setUint16(4, numTables)

  // Calculate searchRange, entrySelector, rangeShift
  let searchRange = 1
  let entrySelector = 0
  while (searchRange * 2 <= numTables) {
    searchRange *= 2
    entrySelector++
  }
  searchRange *= 16
  const rangeShift = numTables * 16 - searchRange

  outView.setUint16(6, searchRange)
  outView.setUint16(8, entrySelector)
  outView.setUint16(10, rangeShift)

  // Write table records and data
  let dataOffset = headerSize
  const srcBytes = new Uint8Array(buffer)

  for (let i = 0; i < numTables; i++) {
    const t = tables[i]
    const recordOff = 12 + i * 16

    // Table record: tag(4) + checkSum(4) + offset(4) + length(4)
    outView.setUint32(recordOff, t.tag)
    outView.setUint32(recordOff + 4, t.checkSum)
    outView.setUint32(recordOff + 8, dataOffset)
    outView.setUint32(recordOff + 12, t.length)

    // Copy table data
    outBytes.set(srcBytes.subarray(t.offset, t.offset + t.length), dataOffset)

    // Advance with 4-byte alignment
    dataOffset += (t.length + 3) & ~3
  }

  return out
}
