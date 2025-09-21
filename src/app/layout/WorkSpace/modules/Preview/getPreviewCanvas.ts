import { BMFontChar } from 'src/file/export'

interface PreviewItem {
  x: number
  y: number
  width: number
  height: number
  letter: string
  next: string
}

export interface PreviewObject {
  xOffset: number
  yOffset: number
  width: number
  height: number
  list: PreviewItem[]
  lines: number
}

export default function getPreviewCanvas(
  text: string,
  chars: Map<string, BMFontChar>,
  kernings: Map<number, Map<number, number>>,
  lineHeight: number,
  fontHeight: number,
  padding: number = 0,
): PreviewObject {
  const list: PreviewItem[] = []
  const lines = text.split(/\r\n|\r|\n/)
  let minX = 0
  let minY = 0
  let maxX = 0
  let maxY = 0
  let y = 0
  let x = 0

  lines.forEach((str, index) => {
    y = lineHeight * index
    x = 0
    const arr = Array.from(str)
    arr.forEach((letter, idx) => {
      const char = chars.get(letter)
      if (!char) {
        return
      }
      const next = arr[idx + 1]
      const lk = kernings.get(letter.codePointAt(0) || 0)
      let kering = 0
      if (next && lk?.has(next.codePointAt(0) || 0)) {
        kering = lk.get(next.codePointAt(0) || 0) || 0
      }
      const obj = {
        x: x + char.xoffset + (char.width === 0 ? 0 : padding),
        y: y + char.yoffset + (char.width === 0 ? 0 : padding),
        width:
          (char.width || char.xadvance) - (char.width === 0 ? 0 : padding * 2),
        height:
          (char.height || fontHeight) - (char.width === 0 ? 0 : padding * 2),
        letter: char.letter,
        next,
      }
      x += char.xadvance + kering
      minX = Math.min(obj.x, minX)
      minY = Math.min(obj.y, minY)
      maxX = Math.max(obj.x + obj.width, maxX)
      maxY = Math.max(obj.y + obj.height, maxY)
      list.push(obj)
    })
  })

  return {
    lines: lines.length,
    list,
    xOffset: minX,
    yOffset: minY,
    width: maxX - minX,
    height: Math.max(maxY - minY, lines.length * lineHeight - minY) + 2,
  }
}
