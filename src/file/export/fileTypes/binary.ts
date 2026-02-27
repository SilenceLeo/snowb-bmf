import { FontToContent, Output } from '../type'

const type = 'BINARY'

const exts = ['fnt']

class BMFontBinaryWriter {
  private buffer: ArrayBuffer
  private view: DataView
  private offset: number = 0

  constructor(size: number) {
    this.buffer = new ArrayBuffer(size)
    this.view = new DataView(this.buffer)
  }

  writeUint8(value: number): void {
    this.view.setUint8(this.offset, value)
    this.offset += 1
  }

  writeUint16(value: number): void {
    this.view.setUint16(this.offset, value, true) // little-endian
    this.offset += 2
  }

  writeUint32(value: number): void {
    this.view.setUint32(this.offset, value, true) // little-endian
    this.offset += 4
  }

  writeInt16(value: number): void {
    this.view.setInt16(this.offset, value, true) // little-endian
    this.offset += 2
  }

  writeHeader(): void {
    // Magic number "BMF"
    this.writeUint8(0x42) // 'B'
    this.writeUint8(0x4d) // 'M'
    this.writeUint8(0x46) // 'F'
    this.writeUint8(3) // Version 3
  }

  writeBlockHeader(blockType: number, size: number): void {
    this.writeUint8(blockType)
    this.writeUint32(size)
  }

  getBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.offset)
  }

  getCurrentOffset(): number {
    return this.offset
  }
}

function calculateBufferSize(bmfont: any): number {
  const { info, pages, chars, kernings } = bmfont

  let size = 4 // File header (BMF + version)

  // Info block: block header (5) + fixed fields (14) + font name + null terminator
  // Fixed fields: fontSize(2) + bitField(1) + charSet(1) + stretchH(2) + aa(1) + padding(4) + spacing(2) + outline(1) = 14
  size += 5 + 14 + new TextEncoder().encode(info.face || '').length + 1

  // Common block: block header (5) + fixed fields (15)
  size += 5 + 15

  // Pages block: block header (5) + page names with null terminators
  // According to BMFont spec: each filename must have the same length
  size += 5
  if (pages.length > 0) {
    const maxFileNameLength = Math.max(
      ...pages.map(
        (page: any) => new TextEncoder().encode(page.file || '').length,
      ),
    )
    // Each page uses maxFileNameLength + 1 (null terminator)
    size += pages.length * (maxFileNameLength + 1)
  }

  // Chars block: block header (5) + char entries (20 bytes each)
  size += 5 + chars.list.length * 20

  // Kerning pairs block: block header (5) + kerning entries (10 bytes each)
  if (kernings.count > 0) {
    size += 5 + kernings.list.length * 10
  }

  return size
}

const getContent: FontToContent = (bmfont) => {
  const { info, common, pages, chars, kernings } = bmfont

  const bufferSize = calculateBufferSize(bmfont)
  const writer = new BMFontBinaryWriter(bufferSize)

  // Write file header
  writer.writeHeader()

  // Write Info block (Type 1)
  const fontNameBytes = new TextEncoder().encode(info.face || '')
  const infoBlockSize = 14 + fontNameBytes.length + 1 // fixed fields + font name + null terminator
  writer.writeBlockHeader(1, infoBlockSize)

  writer.writeUint16(Math.abs(info.size) || 16) // fontSize

  // Build bit field (smooth, unicode, italic, bold, fixedHeight)
  let bitField = 0
  if (info.smooth) bitField |= 0x01
  if (info.unicode) bitField |= 0x02
  if (info.italic) bitField |= 0x04
  if (info.bold) bitField |= 0x08
  // fixedHeight is bit 0x10, but we don't have this info, so leave as 0
  writer.writeUint8(bitField)

  writer.writeUint8(Number(info.charset) || 0) // charSet
  writer.writeUint16(Number(info.stretchH) || 100) // stretchH
  writer.writeUint8(Number(info.aa) || 1) // aa (anti-aliasing)

  // Padding (up, right, down, left)
  const padding = Array.isArray(info.padding) ? info.padding : [0, 0, 0, 0]
  writer.writeUint8(padding[0] || 0) // paddingUp
  writer.writeUint8(padding[1] || 0) // paddingRight
  writer.writeUint8(padding[2] || 0) // paddingDown
  writer.writeUint8(padding[3] || 0) // paddingLeft

  // Spacing (horizontal, vertical)
  const spacing = Array.isArray(info.spacing) ? info.spacing : [0, 0]
  writer.writeUint8(spacing[0] || 0) // spacing horizontal
  writer.writeUint8(spacing[1] || 0) // spacingVert

  writer.writeUint8(Number(info.outline) || 0) // outline

  // Write font name manually (instead of using writeString)
  const infoFontNameBytes = new TextEncoder().encode(info.face || '')
  for (let i = 0; i < infoFontNameBytes.length; i++) {
    writer.writeUint8(infoFontNameBytes[i])
  }
  writer.writeUint8(0) // null terminator

  // Write Common block (Type 2)
  writer.writeBlockHeader(2, 15) // 15 bytes for common block
  writer.writeUint16(common.lineHeight || 0)
  writer.writeUint16(common.base || 0)
  writer.writeUint16(common.scaleW || 0)
  writer.writeUint16(common.scaleH || 0)
  writer.writeUint16(common.pages || 1)

  // Build bit field for common block (packed, encoded channels)
  let commonBitField = 0
  if (common.packed) commonBitField |= 0x80
  if (common.xFpBits) commonBitField |= common.xFpBits & 0x07
  writer.writeUint8(commonBitField)

  writer.writeUint8(common.alphaChnl || 0) // alpha channel
  writer.writeUint8(common.redChnl || 4) // red channel
  writer.writeUint8(common.greenChnl || 2) // green channel
  writer.writeUint8(common.blueChnl || 1) // blue channel

  // Write Pages block (Type 3)
  // According to BMFont spec: each filename must have the same length
  let pagesBlockSize = 0
  let maxFileNameLength = 0

  if (pages.length > 0) {
    maxFileNameLength = Math.max(
      ...pages.map(
        (page: any) => new TextEncoder().encode(page.file || '').length,
      ),
    )
    pagesBlockSize = pages.length * (maxFileNameLength + 1)
  }

  writer.writeBlockHeader(3, pagesBlockSize)

  pages.forEach((page: any) => {
    const fileName = page.file || ''
    const fileNameBytes = new TextEncoder().encode(fileName)

    // Write filename bytes
    for (let i = 0; i < fileNameBytes.length; i++) {
      writer.writeUint8(fileNameBytes[i])
    }

    // Pad with null bytes to reach maxFileNameLength
    for (let i = fileNameBytes.length; i < maxFileNameLength; i++) {
      writer.writeUint8(0)
    }

    // Write null terminator
    writer.writeUint8(0)
  })

  // Write Chars block (Type 4)
  const charsBlockSize = chars.list.length * 20 // 20 bytes per character
  writer.writeBlockHeader(4, charsBlockSize)

  chars.list.forEach((char: any) => {
    writer.writeUint32(char.id || 0) // character ID (4 bytes in version 3)
    writer.writeUint16(char.x || 0) // x position
    writer.writeUint16(char.y || 0) // y position
    writer.writeUint16(char.width || 0) // width
    writer.writeUint16(char.height || 0) // height
    writer.writeInt16(char.xoffset || 0) // x offset
    writer.writeInt16(char.yoffset || 0) // y offset
    writer.writeInt16(char.xadvance || 0) // x advance
    writer.writeUint8(char.page || 0) // page
    writer.writeUint8(char.chnl || 15) // channel (15 = all channels)
  })

  // Write Kerning Pairs block (Type 5) if we have kerning data
  if (kernings.count > 0 && kernings.list.length > 0) {
    const kerningBlockSize = kernings.list.length * 10 // 10 bytes per kerning pair
    writer.writeBlockHeader(5, kerningBlockSize)

    kernings.list.forEach((kerning: any) => {
      writer.writeUint32(kerning.first || 0) // first character ID (4 bytes in version 3)
      writer.writeUint32(kerning.second || 0) // second character ID (4 bytes in version 3)
      writer.writeInt16(kerning.amount || 0) // kerning amount
    })
  }

  // Return binary data as Uint8Array
  const buffer = writer.getBuffer()
  return new Uint8Array(buffer)
}

const outputConfig: Output = { type, exts, getContent }

export default outputConfig
