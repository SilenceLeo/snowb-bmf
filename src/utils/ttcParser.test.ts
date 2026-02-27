import { describe, expect, it } from 'vitest'

import { extractTtfFromTtc, isTtcFile, parseTtcHeader } from './ttcParser'

// ---------------------------------------------------------------------------
// Helpers to build minimal TTC / TTF binary fixtures
// ---------------------------------------------------------------------------

/** Write a 4-byte ASCII tag at the given offset. */
function writeTag(view: DataView, offset: number, tag: string): void {
  for (let i = 0; i < 4; i++) {
    view.setUint8(offset + i, tag.charCodeAt(i))
  }
}

/** Encode a string as UTF-16BE bytes. */
function encodeUtf16BE(str: string): Uint8Array {
  const buf = new Uint8Array(str.length * 2)
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    buf[i * 2] = (code >> 8) & 0xff
    buf[i * 2 + 1] = code & 0xff
  }
  return buf
}

/**
 * Build a minimal `name` table with fontFamily (nameID=1) and
 * fontSubfamily (nameID=2) using Windows platform (platformID=3).
 */
function buildNameTable(family: string, subfamily: string): Uint8Array {
  const familyBytes = encodeUtf16BE(family)
  const subfamilyBytes = encodeUtf16BE(subfamily)

  const nameRecordCount = 2
  // name table header: format(2) + count(2) + stringOffset(2) = 6
  // each name record: 12 bytes
  const headerSize = 6 + nameRecordCount * 12
  const storageSize = familyBytes.length + subfamilyBytes.length
  const tableSize = headerSize + storageSize

  const buf = new ArrayBuffer(tableSize)
  const view = new DataView(buf)

  // Header
  view.setUint16(0, 0) // format
  view.setUint16(2, nameRecordCount)
  view.setUint16(4, headerSize) // stringOffset

  // Record 0: fontFamily (nameID=1)
  let recOff = 6
  view.setUint16(recOff, 3) // platformID = Windows
  view.setUint16(recOff + 2, 1) // encodingID = Unicode BMP
  view.setUint16(recOff + 4, 0x0409) // languageID = English US
  view.setUint16(recOff + 6, 1) // nameID = fontFamily
  view.setUint16(recOff + 8, familyBytes.length)
  view.setUint16(recOff + 10, 0) // string offset relative to storage

  // Record 1: fontSubfamily (nameID=2)
  recOff = 6 + 12
  view.setUint16(recOff, 3)
  view.setUint16(recOff + 2, 1)
  view.setUint16(recOff + 4, 0x0409)
  view.setUint16(recOff + 6, 2) // nameID = fontSubfamily
  view.setUint16(recOff + 8, subfamilyBytes.length)
  view.setUint16(recOff + 10, familyBytes.length) // after family string

  // String storage
  const bytes = new Uint8Array(buf)
  bytes.set(familyBytes, headerSize)
  bytes.set(subfamilyBytes, headerSize + familyBytes.length)

  return new Uint8Array(buf)
}

/**
 * Build a minimal standalone TTF with a single table (`name`).
 * Returns the full font binary and the absolute offset where it starts.
 */
function buildMinimalTtf(
  family: string,
  subfamily: string,
): { bytes: Uint8Array } {
  const nameData = buildNameTable(family, subfamily)
  const numTables = 1

  // sfnt header (12) + 1 table record (16) + name table data
  const headerSize = 12 + numTables * 16
  const paddedNameLen = (nameData.length + 3) & ~3
  const totalSize = headerSize + paddedNameLen
  const buf = new ArrayBuffer(totalSize)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)

  // sfnt header
  view.setUint32(0, 0x00010000) // sfVersion = TrueType
  view.setUint16(4, numTables)
  view.setUint16(6, 16) // searchRange
  view.setUint16(8, 0) // entrySelector
  view.setUint16(10, 0) // rangeShift

  // Table record for 'name'
  writeTag(view, 12, 'name')
  view.setUint32(16, 0) // checkSum (unused for test)
  view.setUint32(20, headerSize) // offset
  view.setUint32(24, nameData.length) // length

  // Table data
  bytes.set(nameData, headerSize)

  return { bytes: new Uint8Array(buf) }
}

/**
 * Build a minimal TTC containing the given fonts.
 * Each font entry is { family, subfamily }.
 */
function buildMinimalTtc(
  fonts: { family: string; subfamily: string }[],
): ArrayBuffer {
  const numFonts = fonts.length
  // TTC header: tag(4) + majorVersion(2) + minorVersion(2) + numFonts(4) + offsets(numFonts * 4)
  const ttcHeaderSize = 12 + numFonts * 4

  // Build each font's bytes
  const fontBuffers = fonts.map((f) => buildMinimalTtf(f.family, f.subfamily))

  // Calculate font offsets within the final TTC
  let currentOffset = ttcHeaderSize
  const fontOffsets: number[] = []
  for (const fb of fontBuffers) {
    fontOffsets.push(currentOffset)
    currentOffset += fb.bytes.length
  }

  const totalSize = currentOffset
  const buf = new ArrayBuffer(totalSize)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)

  // TTC header
  writeTag(view, 0, 'ttcf')
  view.setUint16(4, 2) // majorVersion
  view.setUint16(6, 0) // minorVersion
  view.setUint32(8, numFonts)

  for (let i = 0; i < numFonts; i++) {
    view.setUint32(12 + i * 4, fontOffsets[i])
  }

  // Font data — need to adjust internal table offsets to be absolute
  for (let i = 0; i < numFonts; i++) {
    const fb = fontBuffers[i]
    const base = fontOffsets[i]
    bytes.set(fb.bytes, base)

    // Patch the table record offset: 'name' table offset (at base + 20)
    // must be absolute in the TTC
    const origNameOffset = new DataView(
      fb.bytes.buffer as ArrayBuffer,
      fb.bytes.byteOffset,
    ).getUint32(20)
    view.setUint32(base + 20, base + origNameOffset)
  }

  return buf
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('isTtcFile', () => {
  it('returns true for a valid TTC buffer', () => {
    const buf = buildMinimalTtc([{ family: 'Test', subfamily: 'Regular' }])
    expect(isTtcFile(buf)).toBe(true)
  })

  it('returns false for a TTF buffer', () => {
    const { bytes } = buildMinimalTtf('Test', 'Regular')
    expect(isTtcFile(bytes.buffer as ArrayBuffer)).toBe(false)
  })

  it('returns false for an empty buffer', () => {
    expect(isTtcFile(new ArrayBuffer(0))).toBe(false)
  })

  it('returns false for a buffer shorter than 4 bytes', () => {
    expect(isTtcFile(new ArrayBuffer(3))).toBe(false)
  })
})

describe('parseTtcHeader', () => {
  it('parses a single-font TTC', () => {
    const buf = buildMinimalTtc([{ family: 'Arial', subfamily: 'Bold' }])
    const entries = parseTtcHeader(buf)
    expect(entries).toHaveLength(1)
    expect(entries[0].index).toBe(0)
    expect(entries[0].fontFamily).toBe('Arial')
    expect(entries[0].fontSubfamily).toBe('Bold')
    expect(entries[0].fullName).toBe('Arial Bold')
  })

  it('parses a multi-font TTC', () => {
    const buf = buildMinimalTtc([
      { family: 'Bahnschrift', subfamily: 'Light' },
      { family: 'Bahnschrift', subfamily: 'Regular' },
      { family: 'Bahnschrift', subfamily: 'Bold' },
    ])
    const entries = parseTtcHeader(buf)
    expect(entries).toHaveLength(3)
    expect(entries[0].fullName).toBe('Bahnschrift Light')
    expect(entries[1].fullName).toBe('Bahnschrift Regular')
    expect(entries[2].fullName).toBe('Bahnschrift Bold')
  })

  it('throws for a non-TTC buffer', () => {
    const { bytes } = buildMinimalTtf('Test', 'Regular')
    expect(() => parseTtcHeader(bytes.buffer as ArrayBuffer)).toThrow('Not a TTC file')
  })
})

describe('extractTtfFromTtc', () => {
  it('extracts a valid TTF with correct sfnt signature', () => {
    const buf = buildMinimalTtc([
      { family: 'TestA', subfamily: 'Regular' },
      { family: 'TestB', subfamily: 'Italic' },
    ])

    const ttf = extractTtfFromTtc(buf, 0)
    const view = new DataView(ttf)
    // sfnt version should be 0x00010000 (TrueType)
    expect(view.getUint32(0)).toBe(0x00010000)
    // numTables should be 1 (our minimal font has only 'name')
    expect(view.getUint16(4)).toBe(1)
  })

  it('extracts different fonts by index', () => {
    const buf = buildMinimalTtc([
      { family: 'Alpha', subfamily: 'Regular' },
      { family: 'Beta', subfamily: 'Bold' },
    ])

    const ttf0 = extractTtfFromTtc(buf, 0)
    const ttf1 = extractTtfFromTtc(buf, 1)

    // The two TTFs should be different (different name tables)
    const bytes0 = new Uint8Array(ttf0)
    const bytes1 = new Uint8Array(ttf1)
    const same = bytes0.length === bytes1.length && bytes0.every((b, i) => b === bytes1[i])
    expect(same).toBe(false)
  })

  it('produces a self-contained TTF with correct table record offsets', () => {
    const buf = buildMinimalTtc([{ family: 'Test', subfamily: 'Regular' }])
    const ttf = extractTtfFromTtc(buf, 0)
    const view = new DataView(ttf)

    // Read the table record offset for the first (and only) table
    const tableOffset = view.getUint32(12 + 8) // record[0].offset
    const tableLength = view.getUint32(12 + 12) // record[0].length

    // Offset should be within bounds of the extracted TTF
    expect(tableOffset).toBeGreaterThanOrEqual(28) // header(12) + 1 record(16)
    expect(tableOffset + tableLength).toBeLessThanOrEqual(ttf.byteLength)
  })

  it('throws for out-of-range fontIndex', () => {
    const buf = buildMinimalTtc([{ family: 'Test', subfamily: 'Regular' }])
    expect(() => extractTtfFromTtc(buf, 1)).toThrow('out of range')
    expect(() => extractTtfFromTtc(buf, -1)).toThrow('out of range')
  })

  it('throws for a non-TTC buffer', () => {
    const { bytes } = buildMinimalTtf('Test', 'Regular')
    expect(() => extractTtfFromTtc(bytes.buffer as ArrayBuffer, 0)).toThrow('Not a TTC file')
  })
})
