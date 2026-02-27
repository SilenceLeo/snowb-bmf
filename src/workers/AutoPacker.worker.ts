import { GuillotineBinPack } from 'rectangle-packer'

interface Rectangle {
  width: number
  height: number
  x: number
  y: number
  letter: string
}

function maxMin(list: Rectangle[]) {
  let minWidth = Infinity
  let minHeight = Infinity
  let totalWidth = 0
  let totalHeight = 0
  let totalArea = 0

  for (let i = 0; i < list.length; i++) {
    const { width, height } = list[i]
    if (width < minWidth) minWidth = width
    if (height < minHeight) minHeight = height
    totalWidth += width
    totalHeight += height
    totalArea += width * height
  }

  return { minWidth, minHeight, maxWidth: totalWidth, maxHeight: totalHeight, totalArea }
}

function packing(list: Rectangle[]) {
  const sizes = maxMin(list)
  let min = Math.max(sizes.minWidth, sizes.minHeight)
  // Tighter upper bound: min of (2x sqrt of total area) vs (sum of dimensions)
  const areaUpperBound = Math.ceil(Math.sqrt(sizes.totalArea)) * 2
  const sumUpperBound = Math.max(sizes.maxWidth, sizes.maxHeight)
  let max = Math.min(areaUpperBound, sumUpperBound)
  if (max < min) max = sumUpperBound // fallback to original upper bound
  let state = 1
  let placed: Rectangle[] = []
  while (state) {
    const size = min + Math.ceil((max - min) / 2)
    const packer = new GuillotineBinPack<Rectangle>(size, size)
    packer.InsertSizes([...list], true, 1, 1)

    if (max - min < 2) {
      state = 0
    } else if (list.length > packer.usedRectangles.length) {
      min += Math.ceil((max - min) / 2)
    } else {
      placed = packer.usedRectangles
      max -= Math.floor((max - min) / 2)
    }
  }
  return placed
}

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as unknown as Worker
ctx.addEventListener(
  'message',
  function converter(msg) {
    try {
      const { data } = msg
      if (data.length <= 0) {
        ctx.postMessage([])
      } else if (data.length === 1) {
        const rect = data[0] as Rectangle
        rect.x = 0
        rect.y = 0
        ctx.postMessage([rect])
      } else {
        const list = packing(data as Rectangle[])
        ctx.postMessage(list)
      }
    } catch (e) {
      ctx.postMessage({ error: String(e) })
    }
  },
  false,
)
