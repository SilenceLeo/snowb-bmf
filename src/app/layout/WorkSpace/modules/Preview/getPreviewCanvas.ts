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
